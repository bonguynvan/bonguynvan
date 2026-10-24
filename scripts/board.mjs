// Refreshes the price board in readme.md and the header images in assets/
// from GitHub, npm and crates.io. Run by .github/workflows/board.yml each day.
//
//   LAST  stars        CHG  new stars in the last 7 days
//   VOL   downloads in the last week, from npm or crates.io
//
// Colours follow Vietnamese price boards: purple at the ceiling (+7% or
// more), green up, yellow at the reference price, red down, cyan at the floor.

import { readFile, writeFile } from 'node:fs/promises'

const LISTINGS = [
  { code: 'TCV', name: 'TradeCanvas', repo: 'bonguynvan/tradecanvas', npm: '@tradecanvas/chart', note: 'trading charts' },
  { code: 'BOG', name: 'bo-grid', repo: 'bonguynvan/bo-grid', npm: 'bo-grid', note: 'price-board grid' },
  { code: 'DSA', name: 'densa', repo: 'densa-rs/densa', crate: 'densa', note: 'live-data toolkit, Rust' },
  { code: 'FSP', name: 'Fansipan', repo: 'bonguynvan/fansipan', stage: 'dev', note: 'desktop terminal' },
  { code: 'SVT', name: 'Sveltier', repo: 'sveltier/sveltier', stage: 'alpha', note: 'UI kit for AI agents' },
  { code: 'BCN', name: 'beacon-parser', repo: 'bonguynvan/beacon-parser', stage: 'dev', note: 'analytics tag QA' },
]

const README = 'readme.md'
const BOARD_START = '<!-- board:start -->'
const BOARD_END = '<!-- board:end -->'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const LIMIT = 0.07
const USER_AGENT = 'bonguynvan-profile-board'

const THEMES = {
  dark: {
    bg: '#0b0e13', strip: '#121822', grid: '#18202b', text: '#e6edf3', muted: '#8b949e', ema: '#f2a93b',
    ceiling: '#c084fc', up: '#22c55e', ref: '#eab308', down: '#ef4444', floor: '#22d3ee',
  },
  light: {
    bg: '#f6f8fa', strip: '#eaeef2', grid: '#e3e8ee', text: '#1f2328', muted: '#59636e', ema: '#bc4c00',
    ceiling: '#8250df', up: '#1a7f37', ref: '#9a6700', down: '#cf222e', floor: '#0e7490',
  },
}

// ---------------------------------------------------------------- data

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  return res.json()
}

function githubHeaders(accept = 'application/vnd.github+json') {
  const token = process.env.GITHUB_TOKEN
  return { Accept: accept, ...(token && { Authorization: `Bearer ${token}` }) }
}

async function fetchStars(repo, since) {
  const { stargazers_count: total } = await getJson(`https://api.github.com/repos/${repo}`, githubHeaders())
  let recent = 0
  for (let page = 1; (page - 1) * 100 < total; page++) {
    const url = `https://api.github.com/repos/${repo}/stargazers?per_page=100&page=${page}`
    const stars = await getJson(url, githubHeaders('application/vnd.github.star+json'))
    recent += stars.filter((star) => Date.parse(star.starred_at) >= since).length
  }
  return { last: total, chg: recent }
}

async function fetchNpm(pkg) {
  const meta = await getJson(`https://registry.npmjs.org/${pkg.replace('/', '%2F')}`, {
    Accept: 'application/vnd.npm.install-v1+json',
  })
  const { downloads } = await getJson(`https://api.npmjs.org/downloads/point/last-week/${pkg}`)
  return { version: meta['dist-tags'].latest, vol: downloads }
}

async function fetchCrate(name, since) {
  const { crate } = await getJson(`https://crates.io/api/v1/crates/${name}`)
  const { version_downloads: days } = await getJson(`https://crates.io/api/v1/crates/${name}/downloads`)
  const vol = days.filter((day) => Date.parse(day.date) >= since).reduce((sum, day) => sum + day.downloads, 0)
  return { version: crate.max_stable_version ?? crate.max_version, vol }
}

async function fetchQuote(listing, since) {
  const [stars, release] = await Promise.all([
    fetchStars(listing.repo, since),
    listing.npm ? fetchNpm(listing.npm) : listing.crate ? fetchCrate(listing.crate, since) : null,
  ])
  const quote = { ...listing, ...stars, version: release?.version ?? listing.stage, vol: release?.vol ?? null }
  return { ...quote, trend: trendOf(quote) }
}

function indexOf(quotes) {
  const sum = (key) => quotes.reduce((total, quote) => total + (quote[key] ?? 0), 0)
  const index = { code: 'BO-INDEX', name: 'BO-INDEX', note: 'all listings', version: '', last: sum('last'), chg: sum('chg'), vol: sum('vol') }
  return { ...index, trend: trendOf(index) }
}

function trendOf({ last, chg }) {
  const previous = last - chg
  if (chg > 0 && (previous === 0 || chg / previous >= LIMIT)) return 'ceiling'
  if (chg < 0 && -chg / previous >= LIMIT) return 'floor'
  return chg > 0 ? 'up' : chg < 0 ? 'down' : 'ref'
}

// ---------------------------------------------------------------- formatting

const ARROWS = { ceiling: '▲', up: '▲', ref: '■', down: '▼', floor: '▼' }

function signed(n) {
  return n > 0 ? `+${n}` : String(n)
}

function percent({ last, chg }) {
  const previous = last - chg
  if (previous === 0) return chg > 0 ? 'NEW' : '0.0%'
  const value = (chg / previous) * 100
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

function volume(n) {
  if (n === null) return '-'
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function escapeXml(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

// ---------------------------------------------------------------- readme board

function boardRow(sign, cells) {
  const [code, last, chg, pct, vol, version, listing] = cells
  return [
    sign,
    ' ',
    code.padEnd(9),
    last.padStart(5),
    chg.padStart(6),
    pct.padStart(8),
    vol.padStart(8),
    '   ',
    version.padEnd(9),
    listing,
  ].join('').trimEnd()
}

function quoteRow(quote) {
  const sign = quote.chg > 0 ? '+' : quote.chg < 0 ? '-' : '!'
  const listing = quote.code === 'BO-INDEX' ? quote.note : `${quote.name} · ${quote.note}`
  return boardRow(sign, [
    quote.code, String(quote.last), signed(quote.chg), percent(quote), volume(quote.vol), quote.version || '', listing,
  ])
}

function renderBoard(quotes, index, session) {
  return [
    '```diff',
    `@@ BO EXCHANGE · SESSION ${session} · OPEN 24/7 @@`,
    boardRow(' ', ['CODE', 'LAST', 'CHG', '%', 'VOL/WK', 'VER', 'LISTING']),
    quoteRow(index),
    ...quotes.map(quoteRow),
    boardRow('-', ['BUG', '9999+', '-1', '-0.0%', '-', 'main', 'bugs · one fewer every day']),
    '```',
  ].join('\n')
}

// ---------------------------------------------------------------- header image

function candles(count, seed) {
  let state = seed
  const random = () => (state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32
  let close = 50
  return Array.from({ length: count }, () => {
    const open = close
    close = open + (random() - 0.4) * 8
    return { open, close, high: Math.max(open, close) + random() * 3, low: Math.min(open, close) - random() * 3 }
  })
}

function renderCandles(theme, box) {
  const bars = candles(22, 27)
  const lows = bars.map((bar) => bar.low)
  const highs = bars.map((bar) => bar.high)
  const min = Math.min(...lows)
  const max = Math.max(...highs)
  const y = (price) => box.y + box.h - ((price - min) / (max - min)) * box.h
  const step = box.w / bars.length
  const shapes = bars.map((bar, i) => {
    const x = box.x + i * step + step / 2
    const colour = bar.close >= bar.open ? theme.up : theme.down
    const top = y(Math.max(bar.open, bar.close))
    const height = Math.max(1.5, Math.abs(y(bar.open) - y(bar.close)))
    return `<g class="candle" style="animation-delay:${(i * 0.07).toFixed(2)}s" fill="${colour}" stroke="${colour}">`
      + `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${y(bar.high).toFixed(1)}" y2="${y(bar.low).toFixed(1)}"/>`
      + `<rect x="${(x - step * 0.32).toFixed(1)}" y="${top.toFixed(1)}" width="${(step * 0.64).toFixed(1)}" height="${height.toFixed(1)}" rx="1"/></g>`
  })
  let ema = bars[0].close
  const points = bars.map((bar, i) => {
    ema = ema + (bar.close - ema) * 0.35
    return `${(box.x + i * step + step / 2).toFixed(1)},${y(ema).toFixed(1)}`
  })
  const line = `<polyline class="ema" pathLength="1" points="${points.join(' ')}" fill="none" stroke="${theme.ema}" stroke-width="1.6"/>`
  return shapes.join('') + line
}

const TAPE_CHAR = 7.8
const TAPE_GAP = 44

function tapeUnit(theme, items, minWidth) {
  const cells = []
  let x = 0
  while (x < minWidth) {
    for (const item of items) {
      const value = `${item.last} ${ARROWS[item.trend]}${signed(item.chg)}`
      cells.push(`<text x="${x.toFixed(1)}"><tspan fill="${theme.text}" font-weight="700">${escapeXml(item.code)}</tspan>`
        + `<tspan fill="${theme[item.trend]}"> ${escapeXml(value)}</tspan></text>`)
      x += (item.code.length + value.length + 1) * TAPE_CHAR + TAPE_GAP
    }
  }
  return { cells: cells.join(''), width: x }
}

function renderTape(theme, items, width) {
  const unit = tapeUnit(theme, items, width)
  const seconds = (unit.width / 45).toFixed(1)
  return {
    css: `.tape{animation:tape ${seconds}s linear infinite}@keyframes tape{to{transform:translateX(-${unit.width.toFixed(1)}px)}}`,
    svg: `<g class="tape">${unit.cells}<g transform="translate(${unit.width.toFixed(1)} 0)">${unit.cells}</g></g>`,
  }
}

function renderHeader(theme, quotes, index, cat) {
  const W = 900
  const H = 232
  const STRIP = 188
  const mono = `font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"`
  const sans = `font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"`
  const tape = renderTape(theme, [index, ...quotes], W)
  const gridLines = Array.from({ length: Math.floor(W / 36) }, (_, i) => `<line x1="${i * 36 + 18}" x2="${i * 36 + 18}" y1="0" y2="${STRIP}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Nguyen Bo: open-source tools for apps full of live data">
<style>
.candle{animation:rise .5s ease-out both;transform-box:fill-box;transform-origin:bottom}
@keyframes rise{from{opacity:0;transform:scaleY(.2)}}
.ema{stroke-dasharray:1;animation:draw 2.2s .4s ease-out both}
@keyframes draw{from{stroke-dashoffset:1}}
.live{animation:blink 1.6s ease-in-out infinite}
@keyframes blink{50%{opacity:.2}}
.cat{animation:bob 3.2s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-5px)}}
${tape.css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="14"/></clipPath>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="${theme.bg}"/>
<g stroke="${theme.grid}" stroke-width="1">${gridLines}</g>
<circle class="live" cx="38" cy="40" r="4" fill="${theme.up}"/>
<text x="50" y="44" ${mono} font-size="12" fill="${theme.muted}" letter-spacing="1">LIVE · BO EXCHANGE · VIETNAM</text>
<text x="32" y="104" ${sans} font-size="46" font-weight="700" fill="${theme.text}">Nguyen Bo</text>
<text x="34" y="136" ${sans} font-size="16" fill="${theme.muted}">open-source tools for apps full of live data</text>
<text x="34" y="162" ${mono} font-size="12" fill="${theme.muted}">TypeScript · Svelte · Rust · shipped with Claude Code</text>
<text x="452" y="44" ${mono} font-size="12" fill="${theme.muted}" letter-spacing="1">BO-INDEX</text>
<text x="524" y="45" ${mono} font-size="15" font-weight="700" fill="${theme.text}">${index.last}</text>
<text x="${532 + String(index.last).length * 9}" y="45" ${mono} font-size="13" fill="${theme[index.trend]}">${ARROWS[index.trend]} ${escapeXml(signed(index.chg))} (${escapeXml(percent(index))})</text>
${renderCandles(theme, { x: 452, y: 62, w: 250, h: 104 })}
<image class="cat" href="${cat}" x="712" y="22" width="178" height="170"/>
<rect y="${STRIP}" width="${W}" height="${H - STRIP}" fill="${theme.strip}"/>
<line x1="0" x2="${W}" y1="${STRIP}" y2="${STRIP}" stroke="${theme.grid}"/>
<g transform="translate(24 ${STRIP + 27})" ${mono} font-size="13">${tape.svg}</g>
</g>
</svg>
`
}

// ---------------------------------------------------------------- main

function sessionDate(now) {
  return now.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}

function withoutSession(text) {
  return text.replace(/SESSION \d{4}-\d{2}-\d{2}/, 'SESSION')
}

async function writeIfChanged(path, next, same = (a, b) => a === b) {
  const current = await readFile(path, 'utf8').catch(() => '')
  if (same(current, next)) return false
  await writeFile(path, next)
  return true
}

async function main() {
  const now = new Date()
  const since = now.getTime() - WEEK_MS
  const quotes = await Promise.all(LISTINGS.map((listing) => fetchQuote(listing, since)))
  const index = indexOf(quotes)

  const readme = await readFile(README, 'utf8')
  const start = readme.indexOf(BOARD_START)
  const end = readme.indexOf(BOARD_END)
  if (start < 0 || end < start) throw new Error(`${README} has no ${BOARD_START} … ${BOARD_END} block`)
  const board = renderBoard(quotes, index, sessionDate(now))
  const nextReadme = `${readme.slice(0, start + BOARD_START.length)}\n${board}\n${readme.slice(end)}`

  const cat = `data:image/webp;base64,${(await readFile('assets/cat.webp')).toString('base64')}`
  const changed = await Promise.all([
    writeIfChanged(README, nextReadme, (a, b) => withoutSession(a) === withoutSession(b)),
    ...Object.entries(THEMES).map(([name, theme]) =>
      writeIfChanged(`assets/board-${name}.svg`, renderHeader(theme, quotes, index, cat))),
  ])
  console.log(changed.some(Boolean) ? 'Board updated.' : 'Board unchanged.')
  console.log(board)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
