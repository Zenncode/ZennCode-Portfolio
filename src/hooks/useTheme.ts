import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

function getSystem(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolve(pref: ThemePreference): ResolvedTheme {
  return pref === 'system' ? getSystem() : pref
}

function readPref(): ThemePreference {
  const stored = localStorage.getItem('theme-pref')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  // Default: white / light mode (not OS night mode)
  return 'light'
}

export function applyTheme(pref: ThemePreference) {
  const resolved = resolve(pref)
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.style.colorScheme = resolved
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    typeof window === 'undefined' ? 'light' : readPref(),
  )
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    typeof window === 'undefined' ? 'light' : resolve(readPref()),
  )

  useEffect(() => {
    applyTheme(preference)
    setResolved(resolve(preference))
    localStorage.setItem('theme-pref', preference)
  }, [preference])

  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme('system')
      setResolved(getSystem())
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])

  // Cycle: light (default) → dark → system → light
  const cycle = useCallback(() => {
    setPreference((p) =>
      p === 'light' ? 'dark' : p === 'dark' ? 'system' : 'light',
    )
  }, [])

  const toggle = useCallback(() => {
    setPreference((p) => {
      const current = resolve(p)
      return current === 'light' ? 'dark' : 'light'
    })
  }, [])

  return { preference, resolved, setPreference, cycle, toggle }
}
