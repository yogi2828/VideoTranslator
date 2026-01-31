import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
    if (typeof window !== 'undefined' && !getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
        auth = getAuth(firebaseApp);
        firestore = getFirestore(firebaseApp);
    } else if (getApps().length) {
        firebaseApp = getApp();
        auth = getAuth(firebaseApp);
        firestore = getFirestore(firebaseApp);
    }
    
    return { firebaseApp, auth, firestore };
}

export {
    initializeFirebase,
    FirebaseProvider,
    FirebaseClientProvider,
    useFirebase,
    useFirebaseApp,
    useAuth,
    useFirestore,
    useUser,
    useCollection,
    useDoc
};
