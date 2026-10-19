/**
 * DOM smoke test for the motion layer.
 *
 * Builds the real app entry as a single IIFE (`vite.smoke.config.ts`) and runs
 * it inside jsdom with IntersectionObserver and matchMedia stubbed. It proves
 * that the app boots without runtime errors, that reveal sections arm
 * themselves and then reveal, and that the scroll-driven sections mount.
 *
 *   npx vite build --config vite.smoke.config.ts
 *   node scripts/motion-check.mjs [route]
 *
 * jsdom is optional tooling, not a project dependency:
 *   npm install --no-save jsdom
 */
import { readFileSync } from 'node:fs'
import { JSDOM, VirtualConsole } from 'jsdom'

const route = process.argv[2] ?? '/collections/aeroform'
const reducedMotion = process.env.REDUCED === '1'
const bundle = readFileSync('dist-smoke/app.iife.js', 'utf8')

const errors = []
const virtualConsole = new VirtualConsole()
virtualConsole.on('jsdomError', (error) => errors.push(`jsdom: ${error.message}`))
virtualConsole.on('error', (...args) => errors.push(`console.error: ${args.map(String).join(' ')}`.slice(0, 400)))

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: `http://localhost${route}`,
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
})

const { window } = dom

// — Browser APIs jsdom lacks ————————————————————————————————
window.matchMedia = (query) => ({
  matches: reducedMotion && query.includes('prefers-reduced-motion'),
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})

class StubIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe(target) {
    window.setTimeout(() => {
      this.callback([{ isIntersecting: true, target, intersectionRatio: 1 }], this)
    }, 0)
  }
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = StubIntersectionObserver

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.HTMLCanvasElement.prototype.getContext = () => null
window.scrollTo = () => {}
window.scroll = () => {}

window.addEventListener('error', (event) => errors.push(`window.error: ${event.message}`))

try {
  window.eval(bundle)
} catch (error) {
  errors.push(`eval: ${error.message}`)
}

await new Promise((resolve) => window.setTimeout(resolve, 1200))

const document = window.document

/** Fakes a layout rect, since jsdom performs no layout. */
function stubRect(element, rect) {
  if (!element) return
  element.getBoundingClientRect = () => ({
    x: 0,
    y: rect.top,
    top: rect.top,
    left: 0,
    right: 1200,
    bottom: rect.top + rect.height,
    width: 1200,
    height: rect.height,
    toJSON: () => rect,
  })
}

const scrollReport = {}
if (process.env.SCROLL_TEST === '1') {
  // Parallax: a frame halfway through the viewport should shift its image.
  const wrap = document.querySelector('.parallax > div')
  const inner = wrap?.firstElementChild
  if (wrap && inner) {
    stubRect(wrap, { top: 200, height: 400 })
    const before = inner.style.transform
    window.dispatchEvent(new window.Event('scroll'))
    await new Promise((resolve) => window.setTimeout(resolve, 60))
    scrollReport.parallaxBefore = before
    scrollReport.parallaxAfter = inner.style.transform
  }

  // Pinned study: a section halfway through its own height should report 50 %
  // progress and select the third chapter.
  const study = document.querySelector('.study')
  if (study) {
    stubRect(study, { top: -1250, height: 3000 })
    window.dispatchEvent(new window.Event('scroll'))
    await new Promise((resolve) => window.setTimeout(resolve, 60))
    scrollReport.studyProgress = document
      .querySelector('.study__sticky')
      ?.style.getPropertyValue('--study-progress')
    scrollReport.activeChapter = document.querySelector('.study__chapter.is-active')?.textContent?.slice(0, 40)
  }

  if (!scrollReport.parallaxAfter || scrollReport.parallaxAfter === scrollReport.parallaxBefore)
    errors.push('parallax did not respond to scroll')
  if (scrollReport.activeChapter && !/03|chamfer|crown/i.test(scrollReport.activeChapter))
    errors.push(`study chapter did not advance on scroll: ${scrollReport.activeChapter}`)
}
const reveals = [...document.querySelectorAll('.reveal')]
const report = {
  route,
  mounted: Boolean(document.querySelector('#root')?.children.length),
  reveals: reveals.length,
  armed: reveals.filter((el) => el.classList.contains('is-armed')).length,
  revealed: reveals.filter((el) => el.classList.contains('is-revealed')).length,
  maskedHeadings: document.querySelectorAll('.reveal-lines--mask').length,
  headingsRevealed: document.querySelectorAll('.reveal-lines--mask.is-revealed').length,
  study: Boolean(document.querySelector('.study')),
  film: Boolean(document.querySelector('.film')),
  marquee: Boolean(document.querySelector('.marquee')),
  motionButton: Boolean(document.querySelector('.hdr__motion')),
  reducedStylesheet: Boolean(document.getElementById('mv-reduced-motion')),
  staticStudy: Boolean(document.querySelector('.study--static')),
  filmVideo: Boolean(document.querySelector('.film__video')),
}

const failures = []
if (!report.mounted) failures.push('application did not mount')
if (report.reveals === 0) failures.push('no reveal sections rendered')
if (report.revealed === 0) failures.push('no reveal section received .is-revealed')
if (route.startsWith('/collections') && !report.study) failures.push('scroll study missing')
if (route.startsWith('/collections') && !report.film) failures.push('scroll film missing')
if (reducedMotion && !report.reducedStylesheet) failures.push('reduced-motion stylesheet was not injected')
if (reducedMotion && route.startsWith('/collections') && !report.staticStudy)
  failures.push('study did not fall back to the static grid')
if (reducedMotion && report.filmVideo) failures.push('film video rendered despite reduced motion')
// jsdom has no media stack; those warnings are the harness, not the app.
const appErrors = errors.filter((line) => !/HTMLMediaElement/.test(line))
if (appErrors.length) failures.push(...appErrors)

console.log(JSON.stringify({ ...report, ...scrollReport }, null, 2))
if (failures.length) {
  console.error(`\nFAIL\n${failures.join('\n')}`)
  process.exit(1)
}
console.log('\nMotion layer boots and reveals correctly.')
process.exit(0)
