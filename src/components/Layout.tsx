import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import TypingTest from './TypingTest'
import CommunityChat from './CommunityChat'

/** True when focus is in something the user types into. */
function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

export default function Layout() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [typingOpen, setTypingOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Move focus into the page on navigation so keyboard and screen-reader
  // users land on the new content instead of the top of the nav.
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
  }, [])

  // Escape closes the topmost overlay (chat > palette > typing test).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (chatOpen) setChatOpen(false)
      else if (cmdOpen) setCmdOpen(false)
      else if (typingOpen) setTypingOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chatOpen, cmdOpen, typingOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never hijack keys the user is typing into a field, and respect
      // handlers that already consumed the event (chat, game, palette).
      if (e.defaultPrevented || isTextEntry(e.target)) return

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
      <main
        ref={mainRef}
        tabIndex={-1}
        aria-label="Page content"
        className="flex-1 w-full min-h-screen pb-16 outline-none lg:ml-[var(--spacing-sidebar)] lg:w-[calc(100%-var(--spacing-sidebar))]"
      >
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
