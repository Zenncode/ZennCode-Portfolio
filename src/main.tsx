import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { applyTheme, ThemeProvider } from './hooks/useTheme'
import { recordVisit } from './lib/visitors'
import { startLinkTracking } from './lib/links'
import './lib/firebase'
import './index.css'

// Apply theme before paint — default is light (white), not OS night mode
;(() => {
  let pref = localStorage.getItem('theme-pref')

  // Default to light if not set (system prefers dark but we default to light)
  if (!pref) {
    pref = 'light'
    localStorage.setItem('theme-pref', 'light')
  }

  applyTheme(pref as 'light' | 'dark' | 'system')
})()

// One count per browser session, ignored for signed-in users and for anyone
// who set Do Not Track. See src/lib/visitors.ts.
recordVisit()
// Outbound + internal link clicks, attributed to the same visitor id.
startLinkTracking()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
