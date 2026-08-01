import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import TypingTest from './TypingTest'
import CommunityChat from './CommunityChat'

export default function Layout() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [typingOpen, setTypingOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if ((e.altKey || e.metaKey || e.ctrlKey) && key === 'k') {
        e.preventDefault()
        setTypingOpen(false)
        setChatOpen(false)
        setCmdOpen((o) => !o)
        return
      }

      if (e.altKey && key === 'j') {
        e.preventDefault()
        setCmdOpen(false)
        setChatOpen(false)
        setTypingOpen((o) => !o)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen flex flex-col lg:block bg-[var(--color-bg)]">
      <SidebarNav
        onOpenCommand={() => {
          setTypingOpen(false)
          setChatOpen(false)
          setCmdOpen(true)
        }}
        onOpenTyping={() => {
          setCmdOpen(false)
          setChatOpen(false)
          setTypingOpen(true)
        }}
        onOpenChat={() => {
          setCmdOpen(false)
          setTypingOpen(false)
          setChatOpen(true)
        }}
      />
      <main className="flex-1 w-full min-h-screen pb-16 lg:ml-[var(--spacing-sidebar)] lg:w-[calc(100%-var(--spacing-sidebar))]">
        <div className="w-full flex flex-col items-stretch">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <TypingTest open={typingOpen} onClose={() => setTypingOpen(false)} />
      <CommunityChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
