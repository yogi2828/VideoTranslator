import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

// This function now acts as a simple getter for the initialized instances.
function initializeFirebase() {
    // This function is deprecated and will be removed.
    // Initialization is now handled in FirebaseClientProvider.
    return {};
}

export {
    initializeFirebase,
    FirebaseProvider,
    useFirebase,
    useFirebaseApp,
    useAuth,
    useFirestore,
    useUser,
    useCollection,
    useDoc
};
