import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const FONT = {
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
}

const WIDTH = 1200
const HEIGHT = 630
const pixels = Buffer.alloc(WIDTH * HEIGHT * 4)

function fill(x, y, w, h, color) {
  const x0 = Math.max(0, x)
  const y0 = Math.max(0, y)
  const x1 = Math.min(WIDTH, x + w)
  const y1 = Math.min(HEIGHT, y + h)
  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      const at = (py * WIDTH + px) * 4
      pixels[at] = color[0]
      pixels[at + 1] = color[1]
      pixels[at + 2] = color[2]
      pixels[at + 3] = 255
    }
  }
}

function textWidth(text, scale) {
  return text.length * 6 * scale
}

function drawText(text, x, y, scale, color) {
  let cursor = x
  for (const char of text) {
    const glyph = FONT[char] ?? FONT[' ']
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') fill(cursor + col * scale, y + row * scale, scale, scale, color)
      }
    }
    cursor += 6 * scale
  }
}

function centered(text, y, scale, color) {
  drawText(text, Math.round((WIDTH - textWidth(text, scale)) / 2), y, scale, color)
}

fill(0, 0, WIDTH, HEIGHT, [7, 8, 11])
fill(80, 168, WIDTH - 160, 4, [255, 177, 90])
centered('YOGESH MUNEES', 210, 10, [244, 239, 230])
centered('FULL-STACK SOFTWARE ENGINEER', 320, 4, [255, 209, 163])
centered('REACT   .NET   POSTGRESQL   APPLIED AI', 390, 3, [183, 171, 153])
fill(80, 470, WIDTH - 160, 4, [255, 177, 90])

function crc32(buffer) {
  let crc = 0xffffffff
  for (const value of buffer) {
    crc ^= value
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const name = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([length, name, data, crc])
}

const raw = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT)
for (let y = 0; y < HEIGHT; y += 1) {
  raw[y * (WIDTH * 4 + 1)] = 0
  pixels.copy(raw, y * (WIDTH * 4 + 1) + 1, y * WIDTH * 4, (y + 1) * WIDTH * 4)
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(WIDTH, 0)
ihdr.writeUInt32BE(HEIGHT, 4)
ihdr[8] = 8
ihdr[9] = 6
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
])
writeFileSync(new URL('../public/og.png', import.meta.url), png)
