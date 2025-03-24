import React, { createContext, useState, useEffect } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../Utils/Firebase";
import { db } from "../Utils/Firebase"; // Asegúrate de que la importación es correcta

export interface AuthContextValue {
  user: any;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        const userRef = doc(db, "users", usr.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: usr.uid,
            email: usr.email,
            createdAt: new Date(),
          });
        }

        setUser(usr);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const usr = userCredential.user;

    await setDoc(doc(db, "users", usr.uid), {
      uid: usr.uid,
      email: usr.email,
      createdAt: new Date(),
    }, { merge: true });

    setUser(usr);
    return userCredential;
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const usr = userCredential.user;

    await setDoc(doc(db, "users", usr.uid), {
      uid: usr.uid,
      email: usr.email,
      createdAt: new Date(),
    });

    setUser(usr);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
