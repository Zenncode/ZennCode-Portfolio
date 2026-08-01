import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

type ThemeClick = {
  clientX?: number
  clientY?: number
  currentTarget?: EventTarget | null
} | null | undefined

type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (
    next: ThemePreference | ((prev: ThemePreference) => ThemePreference),
    ev?: ThemeClick,
  ) => void
  cycle: (ev?: ThemeClick) => void
  toggle: (ev?: ThemeClick) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

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
  return 'light'
}

export function applyTheme(pref: ThemePreference) {
  const resolved = resolve(pref)
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.style.colorScheme = resolved
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function supportsViewTransition(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

/** Viewport center of the clicked theme button */
function clickPoint(ev?: ThemeClick): { x: number; y: number } {
  const target = ev?.currentTarget
  if (target instanceof Element) {
    const rect = target.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }
  if (ev?.clientX != null && ev?.clientY != null) {
    return { x: ev.clientX, y: ev.clientY }
  }
  return { x: window.innerWidth, y: window.innerHeight }
}

/**
 * Circular wave reveal: OLD theme stays until the expanding circle covers it.
 * Uses View Transitions API (same idea as bryllim.com).
 */
function revealWithCircle(
  commit: () => void,
  ev?: ThemeClick,
) {
  if (prefersReducedMotion() || !supportsViewTransition()) {
    const root = document.documentElement
    root.classList.add('theme-anim')
    commit()
    window.setTimeout(() => root.classList.remove('theme-anim'), 480)
    return
  }

  const { x, y } = clickPoint(ev)
  const r = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vt = (document as any).startViewTransition(() => {
    // flushSync so React paints the new theme inside the transition snapshot
    flushSync(() => {
      commit()
    })
  })

  vt.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${r}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 560,
          easing: 'cubic-bezier(.32,.08,.24,1)',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pseudoElement: '::view-transition-new(root)' as any,
        },
      )
    })
    .catch(() => {
      /* animation optional */
    })
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    typeof window === 'undefined' ? 'light' : readPref(),
  )
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    typeof window === 'undefined' ? 'light' : resolve(readPref()),
  )
  const prefRef = useRef(preference)
  prefRef.current = preference

  // Persist + keep resolved in sync (theme attr applied in setPreference / boot)
  useEffect(() => {
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

  const setPreference = useCallback(
    (
      next: ThemePreference | ((prev: ThemePreference) => ThemePreference),
      ev?: ThemeClick,
    ) => {
      const value =
        typeof next === 'function' ? next(prefRef.current) : next
      const prevResolved = resolve(prefRef.current)
      const nextResolved = resolve(value)

      const commit = () => {
        prefRef.current = value
        setPreferenceState(value)
        setResolved(nextResolved)
        applyTheme(value)
        localStorage.setItem('theme-pref', value)
      }

      // Same look (e.g. light ↔ system at daytime) — no wave needed
      if (nextResolved === prevResolved) {
        commit()
        return
      }

      // Wave: old UI stays until circle covers it
      revealWithCircle(commit, ev)
    },
    [],
  )

  const cycle = useCallback(
    (ev?: ThemeClick) => {
      setPreference(
        (p) => (p === 'light' ? 'dark' : p === 'dark' ? 'system' : 'light'),
        ev,
      )
    },
    [setPreference],
  )

  const toggle = useCallback(
    (ev?: ThemeClick) => {
      setPreference((p) => {
        const current = resolve(p)
        return current === 'light' ? 'dark' : 'light'
      }, ev)
    },
    [setPreference],
  )

  const value = useMemo(
    () => ({ preference, resolved, setPreference, cycle, toggle }),
    [preference, resolved, setPreference, cycle, toggle],
  )

  return createElement(ThemeContext.Provider, { value }, children)
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
