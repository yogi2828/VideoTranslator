'use client';
import { addDoc, collection, serverTimestamp, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface HistoryData {
  videoName: string;
  translatedText: string;
  targetLanguage: string;
}

export function saveTranslationHistory(db: Firestore, userId: string, data: HistoryData) {
    if (!userId) {
        console.warn('Cannot save history, user not logged in.');
        return;
    }
    const historyCollection = collection(db, 'users', userId, 'history');
    const historyData = {
        ...data,
        userId,
        createdAt: serverTimestamp(),
    };

    addDoc(historyCollection, historyData)
        .catch(async (serverError) => {
            console.error("Firestore save error:", serverError);
            const permissionError = new FirestorePermissionError({
                path: historyCollection.path,
                operation: 'create',
                requestResourceData: historyData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}
