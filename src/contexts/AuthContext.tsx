import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/integrations/firebase/config';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isFirebaseConfigured: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn('🔐 Firebase não configurado - pulando inicialização de auth');
      setLoading(false);
      return;
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔐 AuthContext - Usuário atualizado:', currentUser?.email || 'nenhum');
      console.log('🔐 AuthContext - User ID:', currentUser?.uid || 'nenhum');
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      console.warn('🔐 Firebase não configurado - não é possível fazer logout');
      return;
    }
    console.log('🔐 Fazendo logout...');
    await firebaseSignOut(auth);
  };

  console.log('🔐 AuthContext - Estado atual:', { user: user?.email, loading, isFirebaseConfigured });

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};
