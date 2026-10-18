import { useMemo, useState, type ReactNode } from 'react'
import type { ExhibitId } from './data.ts'
import { PRESETS, lintStudio } from './lintStudio.ts'

const CASES = [
  { id: 'full', label: 'Full serial', before: 2500, after: 17, beforeText: '2.5 s', afterText: '17 ms', note: 'Stands in for the measured 2.4–2.6 s staging range.' },
  { id: 'middle', label: 'Middle fragment', before: 2500, after: 35, beforeText: '2.5 s', afterText: '35 ms', note: 'A fragment taken from the middle of the value.' },
  { id: 'short', label: 'Three characters', before: 2500, after: 254, beforeText: '2.5 s', afterText: '254 ms', note: 'The common short search remained the slowest indexed case.' },
  { id: 'part', label: 'Full part number', before: 64, after: 1, beforeText: '64 ms', afterText: '<1 ms', note: 'Autocomplete when the part number is complete. The bar uses 1 ms as the ceiling.' },
] as const

const MODELS = [
  { id: 'knn', name: 'KNN', mae: 0.004, note: 'Close to the best base model, and not the one used for the submission runs.' },
  { id: 'cart', name: 'CART', mae: 0.003, note: 'Lowest error of the three base models. These were the runs that went to CLEF. Best F1 0.5634, cluster recall 0.4414.' },
  { id: 'svr', name: 'SVR', mae: 0.085, note: 'An order of magnitude further from the labels than KNN or CART.' },
  { id: 'vote', name: 'Voting regressor', mae: 0.017, note: 'The fusion of all three. Combining them did not beat CART on MAE.' },
] as const

const PROJECTS = [
  { id: 'mars', name: 'Mars transportation ledger', year: '2021', stack: 'Java', text: 'An imagined transport system with enough accounting to need a source of truth. The destination was fiction. The records were the lesson.' },
  { id: 'auction', name: 'Live auction', year: '2021', stack: 'Node.js, Express, MongoDB', text: 'List a thing, bid on it, sell it to the highest bid. The interesting part was keeping the live state and the record of the sale in the same system.' },
  { id: 'khelo', name: 'Khelo India rebuild', year: '2022', stack: 'Node.js, MySQL, Bootstrap', text: 'A faster front and back for a sports site, tagged on my profile as an SIH project. HTML, JavaScript, and a relational store instead of a single page.' },
] as const

const STEPS = [
  { id: 'ticket', title: 'A defect arrives', text: 'The ticket already has a project, a summary, and someone waiting on it.' },
  { id: 'hook', title: 'n8n receives it', text: 'The workflow starts from the ticket instead of from a person copying fields into a prompt.' },
  { id: 'context', title: 'Context is gathered', text: 'Repository, recent changes, and the ticket text travel together.' },
  { id: 'draft', title: 'Cursor drafts a change', text: 'The agent proposes a patch. It does not decide that the patch is done.' },
  { id: 'pr', title: 'A draft pull request opens', text: 'GitHub holds the proposal where review already happens.' },
  { id: 'human', title: 'A person reviews it', text: 'The automation stops here. Merge stays a human decision.' },
] as const

function percentLess(before: number, after: number): string {
  const value = Math.round((1 - after / before) * 1000) / 10
  return `${value}% less time`
}

export function Exhibit({ id }: { id: ExhibitId }) {
  switch (id) {
    case 'early':
      return <EarlyExhibit />
    case 'sign':
      return <SignExhibit />
    case 'research':
      return <ResearchExhibit />
    case 'workflow':
      return <WorkflowExhibit />
    case 'latency':
      return <LatencyExhibit />
    case 'release':
      return <ReleaseExhibit />
    case 'pipeline':
      return <PipelineExhibit />
    case 'lint':
      return <LintExhibit />
  }
}

function ExhibitFrame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="exhibit">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function EarlyExhibit() {
  const [active, setActive] = useState<(typeof PROJECTS)[number]['id']>('mars')
  const project = PROJECTS.find((item) => item.id === active) ?? PROJECTS[0]
  return (
    <ExhibitFrame caption="Three student systems. Open any of them. The other two stay on the list.">
      <div className="choice-row" role="tablist" aria-label="Early systems">
        {PROJECTS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === active} onClick={() => setActive(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="exhibit-body">
        <p className="meta">{project.year} · {project.stack}</p>
        <p>{project.text}</p>
      </div>
    </ExhibitFrame>
  )
}

function SignExhibit() {
  const [phrase, setPhrase] = useState('The pump needs service')
  const [stage, setStage] = useState(0)
  const tokens = phrase.trim().split(/\s+/).filter(Boolean)
  const stages = [
    { title: 'Speech becomes text', body: phrase.trim() || 'Speak, or in this studio, type.' },
    { title: 'Text becomes a plan', body: tokens.length ? tokens.join('  ·  ') : 'No tokens yet.' },
    { title: 'A plan becomes notation', body: 'Handshape, orientation, location, movement. These four slots are what HamNoSys records. They are empty here.' },
    { title: 'Notation drives an avatar', body: 'The avatar would play parameters, not a downloaded clip. Latency was the reason to prefer that.' },
  ]
  return (
    <ExhibitFrame caption="A teaching model of the pipeline. It will not invent Indian Sign Language.">
      <label className="field">
        <span>Phrase</span>
        <input value={phrase} maxLength={80} onChange={(event) => setPhrase(event.target.value)} />
      </label>
      <div className="choice-row" role="tablist" aria-label="Pipeline stage">
        {stages.map((item, index) => (
          <button key={item.title} type="button" role="tab" aria-selected={stage === index} onClick={() => setStage(index)}>
            {index + 1}. {item.title}
          </button>
        ))}
      </div>
      <div className="exhibit-body">
        <h3>{stages[stage]?.title}</h3>
        <p>{stages[stage]?.body}</p>
        {stage === 2 ? (
          <ul className="slot-list">
            {['Handshape', 'Orientation', 'Location', 'Movement'].map((slot) => (
              <li key={slot}><span>{slot}</span><em>Left empty</em></li>
            ))}
          </ul>
        ) : null}
      </div>
    </ExhibitFrame>
  )
}

function ResearchExhibit() {
  const [active, setActive] = useState<(typeof MODELS)[number]['id']>('cart')
  const model = MODELS.find((item) => item.id === active) ?? MODELS[1]
  const max = 0.085
  return (
    <ExhibitFrame caption="Mean absolute error on the CLEF fusion task. Lower is closer to the reference scores. Source: CEUR Vol-3180, paper 107.">
      <div className="bars" role="list">
        {MODELS.map((item) => (
          <button key={item.id} type="button" className="bar-row" aria-pressed={item.id === active} onClick={() => setActive(item.id)}>
            <span>{item.name}</span>
            <span className="track"><span style={{ transform: `scaleX(${item.mae / max})` }} /></span>
            <span className="figure">{item.mae.toFixed(3)}</span>
          </button>
        ))}
      </div>
      <p className="exhibit-body">{model.note}</p>
    </ExhibitFrame>
  )
}

function WorkflowExhibit() {
  const [workflow, setWorkflow] = useState<'warranty' | 'return'>('warranty')
  const [role, setRole] = useState<'customer' | 'agent'>('customer')
  const fields = [
    'Product',
    workflow === 'warranty' ? 'Failure date' : 'Return quantity',
    'Description',
    role === 'agent' ? 'Internal note' : 'Contact',
  ]
  const config = {
    workflow,
    role,
    sections: fields.map((field) => field.toLowerCase().replace(' ', '_')),
  }
  return (
    <ExhibitFrame caption="A reduced model of the configuration approach. The rules are illustrative. The real product rules stayed in configuration, not in a new form for every workflow.">
      <div className="split-controls">
        <fieldset>
          <legend>Workflow</legend>
          {(['warranty', 'return'] as const).map((item) => (
            <label key={item}><input type="radio" name="workflow" checked={workflow === item} onChange={() => setWorkflow(item)} />{item}</label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Role</legend>
          {(['customer', 'agent'] as const).map((item) => (
            <label key={item}><input type="radio" name="role" checked={role === item} onChange={() => setRole(item)} />{item}</label>
          ))}
        </fieldset>
      </div>
      <ol className="form-preview">
        {fields.map((field) => <li key={field}>{field}</li>)}
      </ol>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </ExhibitFrame>
  )
}

function LatencyExhibit() {
  const [active, setActive] = useState<(typeof CASES)[number]['id']>('full')
  const [replay, setReplay] = useState(false)
  const item = CASES.find((entry) => entry.id === active) ?? CASES[0]
  const replayTiming = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    setReplay(true)
    window.setTimeout(() => setReplay(false), 60)
  }
  return (
    <ExhibitFrame caption="Staging measurements from the search work. Bars are linear within the selected case. The table keeps every case visible.">
      <div className="choice-row" role="tablist" aria-label="Search case">
        {CASES.map((entry) => (
          <button key={entry.id} type="button" role="tab" aria-selected={entry.id === active} onClick={() => setActive(entry.id)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="race">
        <RaceRow label="Before" text={item.beforeText} scale={replay ? 0 : 1} />
        <RaceRow label="After" text={item.afterText} scale={replay ? 0 : item.after / item.before} />
      </div>
      <p className="meta">{percentLess(item.before, item.after)} · {item.note}</p>
      <button type="button" className="text-button" onClick={replayTiming}>Replay the timing</button>
      <table>
        <caption>All four staging cases</caption>
        <thead>
          <tr><th>Case</th><th>Before</th><th>After</th><th>Change</th></tr>
        </thead>
        <tbody>
          {CASES.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.label}</td>
              <td>{entry.beforeText}</td>
              <td>{entry.afterText}</td>
              <td>{percentLess(entry.before, entry.after)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ExhibitFrame>
  )
}

function RaceRow({ label, text, scale }: { label: string; text: string; scale: number }) {
  return (
    <div className="race-row">
      <span>{label}</span>
      <span className="track"><span style={{ transform: `scaleX(${Math.max(scale, 0.02)})` }} /></span>
      <strong>{text}</strong>
    </div>
  )
}

function ReleaseExhibit() {
  const [customer, setCustomer] = useState(true)
  const [analyticsDown, setAnalyticsDown] = useState(false)
  const [raw, setRaw] = useState('<strong>Claim received</strong><script>alert(1)</script>')
  const safe = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return (
    <ExhibitFrame caption="Three release behaviors you can flip. Names of customers, schemas, and internal URLs stay out.">
      <label className="check"><input type="checkbox" checked={customer} onChange={(event) => setCustomer(event.target.checked)} />Viewing as an external customer</label>
      <p className={customer ? 'status status-hold' : 'status status-open'}>
        {customer
          ? 'The claims journey is open. Unfinished workflows stay gated, including return handling still in test.'
          : 'An internal role can open the unfinished workflow. The customer gate does not move.'}
      </p>
      <label className="check"><input type="checkbox" checked={analyticsDown} onChange={(event) => setAnalyticsDown(event.target.checked)} />Product analytics is unreachable</label>
      <p className={analyticsDown ? 'status status-hold' : 'status status-open'}>
        {analyticsDown
          ? 'Analytics calls fail inside their own boundary. The screen in front of the person stays up.'
          : 'Analytics is connected, and still off the critical path. Cutting it does not require a new core deploy.'}
      </p>
      <label className="field">
        <span>HTML email source</span>
        <textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows={3} />
      </label>
      <p className="meta">Rendered as text, so a tag cannot run.</p>
      <pre>{safe}</pre>
    </ExhibitFrame>
  )
}

function PipelineExhibit() {
  const [step, setStep] = useState(0)
  const [approach, setApproach] = useState<'tfidf' | 'vector' | 'knowledge'>('knowledge')
  const notes = {
    tfidf: 'Counts overlap in words. Fast, and brittle when a customer describes the same fault in different language.',
    vector: 'Finds nearby text. Stronger on paraphrase, weaker when the answer lives in a policy the ticket never quotes.',
    knowledge: 'Retrieves product knowledge and then answers. Slower, and the one that can cite a source the ticket itself does not contain.',
  }
  return (
    <ExhibitFrame caption="The 92% figure is the evaluated issue recommender. This walkthrough does not re-score it. The draft-PR path always ends at a person.">
      <ol className="steps">
        {STEPS.map((item, index) => (
          <li key={item.id} data-on={index <= step}>
            <button type="button" onClick={() => setStep(index)} aria-current={index === step}>
              <span>{item.title}</span>
              <small>{item.text}</small>
            </button>
          </li>
        ))}
      </ol>
      <div className="choice-row">
        <button type="button" className="text-button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>Previous stage</button>
        <button type="button" className="text-button" onClick={() => setStep((value) => Math.min(STEPS.length - 1, value + 1))} disabled={step === STEPS.length - 1}>Next stage</button>
      </div>
      <div className="choice-row" role="tablist" aria-label="Retrieval approach">
        {(['tfidf', 'vector', 'knowledge'] as const).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={approach === item} onClick={() => setApproach(item)}>
            {item === 'tfidf' ? 'TF-IDF' : item === 'vector' ? 'Vector search' : 'Knowledge-backed model'}
          </button>
        ))}
      </div>
      <p>{notes[approach]}</p>
    </ExhibitFrame>
  )
}

function LintExhibit() {
  const [presetId, setPresetId] = useState(PRESETS[0]?.id ?? 'hidden')
  const preset = PRESETS.find((item) => item.id === presetId) ?? PRESETS[0]
  const [schemaText, setSchemaText] = useState(preset?.schema ?? '')
  const [uiText, setUiText] = useState(preset?.ui ?? '')
  const result = useMemo(() => lintStudio(schemaText, uiText), [schemaText, uiText])

  const applyPreset = (id: string) => {
    const next = PRESETS.find((item) => item.id === id)
    if (!next) return
    setPresetId(id)
    setSchemaText(next.schema)
    setUiText(next.ui)
  }

  return (
    <ExhibitFrame caption="A browser subset of schema-form-lint: unresolved scopes, hidden required fields, impossible enums, duplicate controls, and ui:order typos. The npm package runs the full 17 rules.">
      <div className="choice-row" role="tablist" aria-label="Lint examples">
        {PRESETS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === presetId} onClick={() => applyPreset(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="meta">{preset?.blurb} Edit either document. The findings follow.</p>
      <div className="editors">
        <label className="field">
          <span>Schema</span>
          <textarea value={schemaText} spellCheck={false} onChange={(event) => setSchemaText(event.target.value)} rows={12} />
        </label>
        <label className="field">
          <span>UI</span>
          <textarea value={uiText} spellCheck={false} onChange={(event) => setUiText(event.target.value)} rows={12} />
        </label>
      </div>
      {result.error ? <p className="status status-hold" role="status">{result.error}</p> : null}
      {!result.error && result.findings.length === 0 ? <p className="status status-open" role="status">This subset reports no findings.</p> : null}
      <ul className="findings">
        {result.findings.map((finding, index) => (
          <li key={`${finding.ruleId}-${index}`} data-severity={finding.severity}>
            <span>{finding.ruleId}</span>
            <p>{finding.message}</p>
            {finding.suggestion ? <p className="suggestion">{finding.suggestion}</p> : null}
          </li>
        ))}
      </ul>
    </ExhibitFrame>
  )
}
