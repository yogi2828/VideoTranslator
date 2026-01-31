'use client';
import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T>(path: string) {
  const db = useFirestore();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const docRef = doc(db, path);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = { id: snapshot.id, ...snapshot.data() } as T;
          setData(docData);
        } else {
          setData(undefined);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching document:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, path]);

  return { data, isLoading };
}
