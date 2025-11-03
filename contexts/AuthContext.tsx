'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  type: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ดึงข้อมูลจาก Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            username: data.username,
            name: data.name,
            email: data.email,
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
            type: data.type || 'user',
          });
        } else {
          // ถ้า Firestore ไม่มี แต่ Firebase Auth มี
          setUser({
            id: firebaseUser.uid,
            username: firebaseUser.email!.split('@')[0],
            name: firebaseUser.email!.split('@')[0],
            email: firebaseUser.email!,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            type: 'user',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      let emailToLogin = identifier;

      // ถ้า identifier ไม่มี @ ให้คิดว่าเป็น username → หา email จาก Firestore
      if (!identifier.includes('@')) {
        const q = query(collection(db, 'users'), where('username', '==', identifier));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          emailToLogin = snapshot.docs[0].data().email;
        } else {
          throw new Error('ไม่พบ username นี้');
        }
      }

      const credential = await signInWithEmailAndPassword(auth, emailToLogin, password);

      // user จะถูก set ผ่าน onAuthStateChanged
      console.log('Login success:', credential.user.email);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
