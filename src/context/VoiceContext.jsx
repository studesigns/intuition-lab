import { createContext, useState, useEffect, useContext } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

// Create Context
export const VoiceContext = createContext();

// Constants
export const CATEGORIES = [
  'All',
  'Narration',
  'Character',
  'News',
  'Commercial',
  'Conversational',
  'Corporate',
  'E-Learning',
  'Podcast'
];

export const SOURCES = [
  { id: 'wellsaid', name: 'WellSaid Labs', color: 'bg-indigo-500', textColor: 'text-indigo-600', bgLight: 'bg-indigo-50' },
  { id: 'elevenlabs', name: 'ElevenLabs', color: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
  { id: 'synthesia', name: 'Synthesia', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
  { id: 'other', name: 'Other', color: 'bg-gray-500', textColor: 'text-gray-600', bgLight: 'bg-gray-50' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'ja', name: 'Japanese', countryCode: 'jp' },
  { code: 'zh', name: 'Chinese', countryCode: 'cn' },
  { code: 'de', name: 'German', countryCode: 'de' },
  { code: 'hi', name: 'Hindi', countryCode: 'in' },
  { code: 'fr', name: 'French', countryCode: 'fr' },
  { code: 'ko', name: 'Korean', countryCode: 'kr' },
  { code: 'pt', name: 'Portuguese', countryCode: 'pt' },
  { code: 'it', name: 'Italian', countryCode: 'it' },
  { code: 'es', name: 'Spanish', countryCode: 'es' },
  { code: 'id', name: 'Indonesian', countryCode: 'id' },
  { code: 'nl', name: 'Dutch', countryCode: 'nl' },
  { code: 'tr', name: 'Turkish', countryCode: 'tr' },
  { code: 'fil', name: 'Filipino', countryCode: 'ph' },
  { code: 'pl', name: 'Polish', countryCode: 'pl' },
  { code: 'sv', name: 'Swedish', countryCode: 'se' },
  { code: 'bg', name: 'Bulgarian', countryCode: 'bg' },
  { code: 'ro', name: 'Romanian', countryCode: 'ro' },
  { code: 'ar', name: 'Arabic', countryCode: 'sa' },
  { code: 'cs', name: 'Czech', countryCode: 'cz' },
  { code: 'el', name: 'Greek', countryCode: 'gr' },
  { code: 'fi', name: 'Finnish', countryCode: 'fi' },
  { code: 'hr', name: 'Croatian', countryCode: 'hr' },
  { code: 'ms', name: 'Malay', countryCode: 'my' },
  { code: 'sk', name: 'Slovak', countryCode: 'sk' },
  { code: 'da', name: 'Danish', countryCode: 'dk' },
  { code: 'ta', name: 'Tamil', countryCode: 'in' },
  { code: 'uk', name: 'Ukrainian', countryCode: 'ua' },
  { code: 'ru', name: 'Russian', countryCode: 'ru' },
];

export const ACCENTS = [
  'American',
  'British',
  'African American',
  'Australian',
  'Canadian',
  'Indian',
  'Irish',
  'Southern American',
  'Nigerian',
  'Transatlantic',
  'New Zealand',
  'Scottish',
  'South African',
  'Other'
];

// Helper function to convert URLs to playable format
export const convertToPlayableUrl = (url) => {
  if (!url) return '';
  if (url.includes('onedrive.live.com/embed')) return url.replace('/embed', '/download');
  if (url.includes('dropbox.com')) return url.replace('dl=0', 'raw=1').replace('?dl=1', '?raw=1');
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  return url;
};

// VoiceProvider Component - Exact AppProvider logic from original index.html
export function VoiceProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Authentication State - EXACT: lines 134-140
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Voices Listener - EXACT: lines 142-157
  useEffect(() => {
    const q = query(collection(db, 'voices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const voiceData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setVoices(voiceData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching voices:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Authentication Methods - EXACT: lines 159-166
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  // Voice CRUD Methods - EXACT: lines 168-181
  const addVoice = async (voiceData) => {
    await addDoc(collection(db, 'voices'), {
      ...voiceData,
      createdAt: serverTimestamp()
    });
  };

  const updateVoice = async (id, voiceData) => {
    await updateDoc(doc(db, 'voices', id), voiceData);
  };

  const deleteVoice = async (id) => {
    await deleteDoc(doc(db, 'voices', id));
  };

  // Context Provider - EXACT: lines 183-200
  const value = {
    isAdmin,
    user,
    voices,
    loading,
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    addVoice,
    updateVoice,
    deleteVoice
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
}

// Custom hook for using the context
export function useVoiceContext() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoiceContext must be used within VoiceProvider');
  }
  return context;
}
