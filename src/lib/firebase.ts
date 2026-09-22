import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCcjDcTLV4n21s3NlpOKwaK1ndJY_32a9M',
  authDomain: 'zenncode-portfolio.firebaseapp.com',
  projectId: 'zenncode-portfolio',
  storageBucket: 'zenncode-portfolio.firebasestorage.app',
  messagingSenderId: '580330313881',
  appId: '1:580330313881:web:1b23374c721826b83d0008',
  measurementId: 'G-VFE32YD45G',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

/**
 * Firestore — backs the community chat realtime feed.
 * Null only if init throws (extremely rare); listeners handle the rest.
 */
export let db: Firestore | null = null
try {
  db = getFirestore(app)
} catch {
  db = null
}

/**
 * Analytics only runs in the browser (not during SSR / tooling).
 * Guarded: ad-blockers / unsupported browsers must not crash startup.
 */
export let analytics: Analytics | null = null

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (!supported) return
      try {
        analytics = getAnalytics(app)
      } catch {
        analytics = null
      }
    })
    .catch(() => {
      analytics = null
    })
}
