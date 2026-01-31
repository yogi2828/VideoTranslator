'use client';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

// Keep track of Firebase initialization status
let firebaseInitialized = false;
const { firebaseApp, auth, firestore } = initializeFirebase();

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  if (!firebaseInitialized) {
    firebaseInitialized = true;
  }

  return (
    <FirebaseProvider value={{ firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
