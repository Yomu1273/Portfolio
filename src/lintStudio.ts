export interface Finding {
  severity: 'error' | 'warning'
  ruleId: string
  message: string
  suggestion?: string
}

export interface StudioPreset {
  id: string
  label: string
  blurb: string
  schema: string
  ui: string
}

interface UiElement {
  type?: string
  scope?: string
  elements?: UiElement[]
  rule?: {
    effect?: string
    condition?: {
      scope?: string
      schema?: { const?: unknown }
    }
  }
}

const EFFECTS = new Set(['SHOW', 'HIDE', 'ENABLE', 'DISABLE'])

const levenshtein = (left: string, right: string): number => {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i]
    for (let j = 1; j <= right.length; j += 1) {
      const substitution = (previous[j - 1] ?? 0) + (left[i - 1] === right[j - 1] ? 0 : 1)
      current.push(Math.min((previous[j] ?? 0) + 1, (current[j - 1] ?? 0) + 1, substitution))
    }
    previous = current
  }
  return previous[right.length] ?? 0
}

const didYouMean = (name: string, candidates: string[]): string | undefined => {
  const maxDistance = Math.max(2, Math.floor(name.length / 3))
  let best: { candidate: string; distance: number } | undefined
  for (const candidate of candidates) {
    const distance = levenshtein(name.toLowerCase(), candidate.toLowerCase())
    if (distance === 0 || distance > maxDistance) continue
    if (!best || distance < best.distance) best = { candidate, distance }
  }
  return best ? `Did you mean \`${best.candidate}\`?` : undefined
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const propertyName = (scope: string): string | undefined => {
  const match = /#\/properties\/([^/]+)/.exec(scope)
  return match?.[1]
}

const walk = (element: UiElement, visit: (element: UiElement) => void): void => {
  visit(element)
  element.elements?.forEach((child) => walk(child, visit))
}

export function lintStudio(schemaText: string, uiText: string): { findings: Finding[]; error?: string } {
  let schema: unknown
  let ui: unknown
  try {
    schema = JSON.parse(schemaText) as unknown
    ui = JSON.parse(uiText) as unknown
  } catch {
    return { findings: [], error: 'One of the documents is not valid JSON yet.' }
  }

  if (!isObject(schema) || !isObject(schema.properties)) {
    return { findings: [], error: 'The schema needs an object `properties` map for this studio.' }
  }

  const schemaProperties = schema.properties
  const properties = Object.keys(schemaProperties)
  const required = Array.isArray(schema.required)
    ? schema.required.filter((item): item is string => typeof item === 'string')
    : []
  const findings: Finding[] = []
  const seen = new Map<string, number>()

  if (!isObject(ui)) return { findings, error: 'The UI document needs to be a JSON object.' }

  const root = ui as UiElement
  if (Array.isArray((ui as { 'ui:order'?: unknown })['ui:order'])) {
    for (const entry of (ui as { 'ui:order': unknown[] })['ui:order']) {
      if (typeof entry !== 'string' || entry === '*') continue
      if (!properties.includes(entry)) {
        findings.push({
          severity: 'error',
          ruleId: 'rjsf/unknown-order-entry',
          message: `\`${entry}\` is listed in ui:order, and the schema has no such property.`,
          suggestion: didYouMean(entry, properties),
        })
      }
    }
  }

  if (root.type || root.elements || root.scope) {
    walk(root, (element) => {
      if (typeof element.scope === 'string') {
        const name = propertyName(element.scope)
        seen.set(element.scope, (seen.get(element.scope) ?? 0) + 1)
        if (!name || !properties.includes(name)) {
          findings.push({
            severity: 'error',
            ruleId: 'jsonforms/unresolved-scope',
            message: `Scope \`${element.scope}\` does not point at a schema property, so the control cannot bind.`,
            suggestion: name ? didYouMean(name, properties) : 'Point the scope at #/properties/<name>.',
          })
        } else if (element.rule?.effect === 'HIDE' && required.includes(name)) {
          findings.push({
            severity: 'warning',
            ruleId: 'jsonforms/required-hideable',
            message: `\`${name}\` is required, and a HIDE rule can take it off the form while validation still asks for it.`,
          })
        }
      }

      const effect = element.rule?.effect
      if (effect && !EFFECTS.has(effect)) {
        findings.push({
          severity: 'error',
          ruleId: 'jsonforms/unknown-effect',
          message: `\`${effect}\` is not a JSON Forms effect. Expected SHOW, HIDE, ENABLE, or DISABLE.`,
        })
      }

      const condition = element.rule?.condition
      const expected = condition?.schema?.const
      const conditionName = condition?.scope ? propertyName(condition.scope) : undefined
      const propertySchema = conditionName ? schemaProperties[conditionName] : undefined
      if (conditionName && isObject(propertySchema) && Array.isArray(propertySchema.enum) && expected !== undefined) {
        const allowed = propertySchema.enum.some((value) => Object.is(value, expected))
        if (!allowed) {
          findings.push({
            severity: 'error',
            ruleId: 'jsonforms/impossible-condition',
            message: `This condition asks for \`${JSON.stringify(expected)}\`, which is outside the enum on \`${conditionName}\`. The rule never applies.`,
          })
        }
      }
    })
  }

  for (const [scope, count] of seen) {
    if (count > 1) {
      findings.push({
        severity: 'warning',
        ruleId: 'jsonforms/duplicate-control',
        message: `Scope \`${scope}\` is bound ${count} times.`,
      })
    }
  }

  return { findings }
}

const schema = (value: unknown): string => JSON.stringify(value, null, 2)

export const PRESETS: StudioPreset[] = [
  {
    id: 'hidden',
    label: 'Hidden required field',
    blurb: 'The serial is required, and a rule can hide it.',
    schema: schema({
      type: 'object',
      required: ['serial'],
      properties: {
        serial: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'open'] },
      },
    }),
    ui: schema({
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/serial',
          rule: {
            effect: 'HIDE',
            condition: { scope: '#/properties/status', schema: { const: 'draft' } },
          },
        },
        { type: 'Control', scope: '#/properties/status' },
      ],
    }),
  },
  {
    id: 'typo',
    label: 'Scope typo',
    blurb: 'A missing letter in the property name.',
    schema: schema({
      type: 'object',
      properties: {
        serial: { type: 'string' },
        status: { type: 'string' },
      },
    }),
    ui: schema({
      type: 'VerticalLayout',
      elements: [{ type: 'Control', scope: '#/properties/serail' }],
    }),
  },
  {
    id: 'impossible',
    label: 'Impossible condition',
    blurb: 'The const sits outside the enum, so the rule can never fire.',
    schema: schema({
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['draft', 'open'] },
        note: { type: 'string' },
      },
    }),
    ui: schema({
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/note',
          rule: {
            effect: 'SHOW',
            condition: { scope: '#/properties/status', schema: { const: 'shipped' } },
          },
        },
      ],
    }),
  },
  {
    id: 'clean',
    label: 'Clean pair',
    blurb: 'A small layout the subset accepts.',
    schema: schema({
      type: 'object',
      required: ['serial'],
      properties: {
        serial: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'open'] },
      },
    }),
    ui: schema({
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/serial' },
        { type: 'Control', scope: '#/properties/status' },
      ],
    }),
  },
]
