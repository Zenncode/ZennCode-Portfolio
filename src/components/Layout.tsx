import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import CommunityWidget from './CommunityWidget'
import TypingTest from './TypingTest'

export default function Layout() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [typingOpen, setTypingOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      // Alt+K or Ctrl/Cmd+K → ask anything
      if (
        ((e.altKey || e.metaKey || e.ctrlKey) && key === 'k') ||
        (e.altKey && key === 'k')
      ) {
        e.preventDefault()
        setTypingOpen(false)
        setCmdOpen((o) => !o)
      }
      // Alt+J → typing test
      if (e.altKey && key === 'j') {
        e.preventDefault()
        setCmdOpen(false)
        setTypingOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen flex flex-col lg:block">
      <SidebarNav
        onOpenCommand={() => {
          setTypingOpen(false)
          setCmdOpen(true)
        }}
        onOpenTyping={() => {
          setCmdOpen(false)
          setTypingOpen(true)
        }}
      />
      <main className="flex-1 w-full pb-16 flex flex-col items-center lg:ml-[var(--spacing-sidebar)] lg:w-[calc(100%-var(--spacing-sidebar))] lg:min-h-screen lg:pb-20">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CommunityWidget />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <TypingTest open={typingOpen} onClose={() => setTypingOpen(false)} />
    </div>
  )
}
