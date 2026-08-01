import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'site-sound'
/** Soft ambient level — polite site bed */
const MASTER_GAIN = 0.08

type AmbientEngine = {
  ctx: AudioContext
  master: GainNode
  oscs: OscillatorNode[]
  stop: () => void
}

let engine: AmbientEngine | null = null
/** User has clicked the speaker at least once this session (autoplay unlock) */
let unlocked = false

function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function getAudioContextClass(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  )
}

/**
 * Soft generative ambient pad (no external file needed).
 * Layered sines + slow gain breathing — calm music while sound is on.
 */
function startAmbient(): void {
  if (engine) return

  const AC = getAudioContextClass()
  if (!AC) return

  const ctx = new AC()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const now = ctx.currentTime
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(MASTER_GAIN, now + 1.1)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1000
  filter.Q.value = 0.55
  filter.connect(master)

  // A minor-ish calm pad: A2 · C3 · E3 · A3
  const layers: { freq: number; gain: number; detune: number }[] = [
    { freq: 110, gain: 0.42, detune: 0 },
    { freq: 130.81, gain: 0.22, detune: 3 },
    { freq: 164.81, gain: 0.28, detune: -4 },
    { freq: 220, gain: 0.16, detune: 2 },
  ]

  const oscs: OscillatorNode[] = []

  layers.forEach((layer, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = layer.freq
    osc.detune.value = layer.detune

    const g = ctx.createGain()
    // Base level + slow LFO for breathing
    const base = layer.gain
    g.gain.value = base

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.07 + i * 0.025
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = base * 0.28
    lfo.connect(lfoDepth)
    lfoDepth.connect(g.gain)

    osc.connect(g)
    g.connect(filter)
    osc.start()
    lfo.start()
    oscs.push(osc, lfo)
  })

  engine = {
    ctx,
    master,
    oscs,
    stop() {
      const t = ctx.currentTime
      try {
        master.gain.cancelScheduledValues(t)
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t)
        master.gain.linearRampToValueAtTime(0.0001, t + 0.4)
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        oscs.forEach((o) => {
          try {
            o.stop()
            o.disconnect()
          } catch {
            /* ignore */
          }
        })
        try {
          master.disconnect()
          void ctx.close()
        } catch {
          /* ignore */
        }
        if (engine?.ctx === ctx) engine = null
      }, 450)
    },
  }

  void ctx.resume()
}

function stopAmbient(): void {
  engine?.stop()
  engine = null
}

/** Short chime when turning sound on */
function playEnableChime(ctx: AudioContext) {
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(659.25, t)
  osc.frequency.exponentialRampToValueAtTime(987.77, t + 0.12)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.07, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.3)
}

/**
 * Site speaker toggle — ambient music bed.
 * Must be started from a user click (browser autoplay rules).
 */
export function useSiteSound() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(readEnabled())
  }, [])

  useEffect(() => {
    const onVis = () => {
      if (!engine || !readEnabled()) return
      if (document.hidden) {
        void engine.ctx.suspend()
      } else if (unlocked) {
        void engine.ctx.resume()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const toggle = useCallback(async () => {
    unlocked = true
    const next = !readEnabled()
    writeEnabled(next)
    setEnabled(next)

    if (next) {
      startAmbient()
      if (engine) {
        if (engine.ctx.state === 'suspended') {
          await engine.ctx.resume()
        }
        playEnableChime(engine.ctx)
      }
    } else {
      stopAmbient()
    }
  }, [])

  return { enabled, toggle }
}
