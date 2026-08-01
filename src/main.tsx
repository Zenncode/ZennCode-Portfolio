import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { applyTheme, ThemeProvider } from './hooks/useTheme'
import './lib/firebase'
import './index.css'

// Apply theme before paint — default is light (white), not OS night mode
;(() => {
  let pref = localStorage.getItem('theme-pref')

  // One-time: old builds defaulted to "system" (often dark). Force light once.
  if (localStorage.getItem('theme-light-default-v1') !== '1') {
    if (!pref || pref === 'system') {
      pref = 'light'
      localStorage.setItem('theme-pref', 'light')
    }
    localStorage.setItem('theme-light-default-v1', '1')
  }

  if (pref !== 'light' && pref !== 'dark' && pref !== 'system') {
    pref = 'light'
    localStorage.setItem('theme-pref', 'light')
  }

  applyTheme((pref ?? 'light') as 'light' | 'dark' | 'system')
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
