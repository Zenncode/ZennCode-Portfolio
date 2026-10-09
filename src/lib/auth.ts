import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  type Auth,
  type User,
} from 'firebase/auth'
import { app } from './firebase'
import { adminConfig } from '../data/portfolio'

/**
 * Admin auth — Firebase Authentication, fronted by a plain username box.
 *
 * WHY NOT A HARDCODED PASSWORD
 * A static SPA ships its whole source to every visitor, and this repo is
 * public on GitHub. A password written into the bundle (or committed) is a
 * published password: F12 → Sources, or just browsing the repo, and anyone
 * types it in. It would keep out a casual visitor and nothing else.
 *
 * So the login box accepts what you want to type — `zenncode` — but the
 * credential is verified by Firebase over the wire, and the private data is
 * gated by the owner's EMAIL in firestore.rules. The password itself is never
 * in the bundle or the repo; only the username → email mapping is, and the
 * email is already public in the site footer.
 */

export let auth: Auth | null = null
try {
  auth = getAuth(app)
} catch {
  auth = null
}

/**
 * Resolves what was typed in the login box into a real email:
 *   `zenncode`      → owner email
 *   `z@example.com` → passed through untouched
 */
export function resolveEmail(identifier: string): string {
  const id = identifier.trim().toLowerCase()
  if (id.includes('@')) return id
  if (adminConfig.usernames.includes(id)) return adminConfig.ownerEmail
  return id // not a known handle — let Firebase reject it with a clear message
}

/** True only for allowlisted accounts. Mirrors `isOwner()` in firestore.rules. */
export function isOwnerEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === adminConfig.ownerEmail
}

export function isCurrentUserAdmin(user: User | null): boolean {
  return isOwnerEmail(user?.email)
}

export function onAuthChanged(fn: (user: User | null) => void): () => void {
  if (!auth) {
    fn(null)
    return () => {}
  }
  return onAuthStateChanged(auth, fn)
}

export async function signInWithIdentifier(
  identifier: string,
  password: string,
): Promise<void> {
  if (!auth) throw new Error('Firebase Auth is unavailable in this browser.')
  await signInWithEmailAndPassword(auth, resolveEmail(identifier), password)
}

/**
 * Deliberately no Google sign-in and no sign-up in the client. One credential
 * pair, created once by hand in the Firebase console. Self-service
 * registration would let anyone mint an account on this project.
 */

export async function signOutAdmin(): Promise<void> {
  if (!auth) return
  try {
    await signOut(auth)
  } catch {
    /* already signed out */
  }
}

/** Raw Firebase codes → sentences a human can act on. */
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? ''
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address doesn’t look right.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/user-disabled':
      return 'Wrong username or password.'
    case 'auth/operation-not-allowed':
    case 'auth/operation-not-supported':
    case 'auth/configuration-not-found':
      return 'Email/password sign-in isn’t enabled on this Firebase project yet.'
    case 'auth/too-many-requests':
      return 'Too many attempts — wait a few minutes and try again.'
    case 'auth/network-request-failed':
      return 'Network error — check your connection.'
    default:
      return 'Sign-in failed. Please try again.'
  }
}
