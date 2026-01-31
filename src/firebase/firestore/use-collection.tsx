'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Firestore,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useCollection<T>(path: string, field?: string, value?: any) {
  const db = useFirestore();
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    let q: Query;
    if (field && value) {
      q = query(collection(db, path), where(field, '==', value));
    } else {
      q = query(collection(db, path));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, path, field, value]);

  return { data, isLoading };
}
