import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appAccess, setAppAccess] = useState<Record<string, boolean> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult(true);
          setAppAccess(idTokenResult.claims.appAccess as Record<string, boolean> || {});

          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile({ uid: firebaseUser.uid, ...userDoc.data() } as UserProfile);
          } else {
            setProfile({ uid: firebaseUser.uid, email: firebaseUser.email || '', role: 'user' });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
          setAppAccess(null);
        }
      } else {
        setProfile(null);
        setAppAccess(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = profile?.role === 'admin';
  const hasAccess = appAccess ? !!appAccess['RatingApp'] : false;

  return { user, profile, isAdmin, hasAccess, appAccess, loading };
}
