import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all required Firebase config values are present
const isFirebaseConfigured = Object.values(firebaseConfig).every(value =>
  value && value !== '' && value !== undefined && value !== null
);

// Initialize Firebase only if properly configured
let app;
let auth;
let db;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    auth = null as any;
    db = null as any;
  }
} else {
  console.warn('⚠️ Firebase não configurado. Verifique as variáveis de ambiente VITE_FIREBASE_* no arquivo .env.local');
  auth = null as any;
  db = null as any;
}
  // Create dummy objects to prevent crashes
  auth = null as any;
  db = null as any;
}

export { auth, db };
export default app;
