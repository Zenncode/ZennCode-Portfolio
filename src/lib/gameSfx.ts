/**
 * Reliable game SFX via Web Audio API (works even when WAV decode fails).
 * Unlock must happen inside a user gesture (key/click).
 */

type SfxName = 'step' | 'collision'

let ctx: AudioContext | null = null
let unlocked = false
let lastStep = 0
let lastColl = 0
let lastCollKey = ''
let masterGain: GainNode | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  masterGain = ctx.createGain()
  masterGain.gain.value = 0.85
  masterGain.connect(ctx.destination)
  return ctx
}

/** Call from keydown / click so the browser allows audio */
export async function unlockGameSfx(): Promise<void> {
  const c = getCtx()
  if (!c) return
  try {
    if (c.state === 'suspended') await c.resume()
    // silent blip to fully unlock on some browsers
    const o = c.createOscillator()
    const g = c.createGain()
    g.gain.value = 0.0001
    o.connect(g)
    g.connect(masterGain || c.destination)
    o.start()
    o.stop(c.currentTime + 0.02)
    unlocked = true
  } catch {
    unlocked = false
  }
}

export function isGameSfxUnlocked() {
  return unlocked
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const len = Math.max(1, Math.floor(c.sampleRate * seconds))
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function playStepSynth() {
  const c = getCtx()
  if (!c || !masterGain || !unlocked) return
  if (c.state === 'suspended') void c.resume()

  const now = c.currentTime
  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, 0.08)

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900
  filter.Q.value = 0.8

  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(0.55, now + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

  // soft low thud under the noise
  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(110, now)
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.07)
  const og = c.createGain()
  og.gain.setValueAtTime(0.0001, now)
  og.gain.exponentialRampToValueAtTime(0.35, now + 0.005)
  og.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

  noise.connect(filter)
  filter.connect(g)
  g.connect(masterGain)
  osc.connect(og)
  og.connect(masterGain)

  noise.start(now)
  noise.stop(now + 0.1)
  osc.start(now)
  osc.stop(now + 0.1)
}

function playCollisionSynth() {
  const c = getCtx()
  if (!c || !masterGain || !unlocked) return
  if (c.state === 'suspended') void c.resume()

  const now = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(140, now)
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.14)

  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(0.7, now + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, 0.12)
  const nf = c.createBiquadFilter()
  nf.type = 'lowpass'
  nf.frequency.value = 600
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.0001, now)
  ng.gain.exponentialRampToValueAtTime(0.4, now + 0.005)
  ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

  osc.connect(g)
  g.connect(masterGain)
  noise.connect(nf)
  nf.connect(ng)
  ng.connect(masterGain)

  osc.start(now)
  osc.stop(now + 0.2)
  noise.start(now)
  noise.stop(now + 0.13)
}

/** Footstep — throttled so it doesn't machine-gun */
export function playGameStep() {
  if (!unlocked) return
  const t = performance.now()
  if (t - lastStep < 85) return
  lastStep = t
  playStepSynth()
}

/** Bump into furniture / wall */
export function playGameCollision(key = 'x') {
  if (!unlocked) return
  const t = performance.now()
  if (t - lastColl < 280 && key === lastCollKey) return
  lastColl = t
  lastCollKey = key
  playCollisionSynth()
}

export function playGameSfx(name: SfxName, key?: string) {
  if (name === 'step') playGameStep()
  else playGameCollision(key)
}
