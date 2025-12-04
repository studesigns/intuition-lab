import { createContext, useState, useEffect, useContext } from 'react';
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
export const VideoContext = createContext();

// Industry Categories
export const INDUSTRIES = [
  'Healthcare',
  'Finance',
  'Tech',
  'Retail',
  'Education'
];

// VideoProvider Component
export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Real-time Videos Listener
  useEffect(() => {
    const q = query(collection(db, 'visual-vault'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setVideos(videoData);

      // Separate featured videos for hero carousel
      const featured = videoData
        .filter(v => v.isFeatured)
        .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
      setFeaturedVideos(featured);

      setLoading(false);
    }, (error) => {
      console.error("Error fetching videos:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Track authentication state from parent VoiceContext
  // (Videos share the same auth as Voices in this app)
  useEffect(() => {
    // Check if user is authenticated by checking Firebase auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Video CRUD Methods
  const addVideo = async (videoData) => {
    try {
      await addDoc(collection(db, 'visual-vault'), {
        ...videoData,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        lastModified: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding video:", error);
      return { success: false, error: error.message };
    }
  };

  const updateVideo = async (id, videoData) => {
    try {
      await updateDoc(doc(db, 'visual-vault', id), {
        ...videoData,
        lastModified: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating video:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteVideo = async (id, cloudinaryPublicId) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'visual-vault', id));

      // Note: Cloudinary deletion requires server-side delete with API key
      // For now, manual deletion in Cloudinary dashboard or implement backend endpoint
      console.warn("Remember to delete from Cloudinary:", cloudinaryPublicId);

      return { success: true };
    } catch (error) {
      console.error("Error deleting video:", error);
      return { success: false, error: error.message };
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'visual-vault', id), {
        isFeatured: !currentStatus,
        featuredOrder: !currentStatus ? Date.now() : 0,
        lastModified: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error toggling featured:", error);
      return { success: false, error: error.message };
    }
  };

  const updateFeaturedOrder = async (id, newOrder) => {
    try {
      await updateDoc(doc(db, 'visual-vault', id), {
        featuredOrder: newOrder,
        lastModified: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating featured order:", error);
      return { success: false, error: error.message };
    }
  };

  // Context Provider
  const value = {
    isAdmin,
    videos,
    featuredVideos,
    loading,
    addVideo,
    updateVideo,
    deleteVideo,
    toggleFeatured,
    updateFeaturedOrder,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

// Custom hook for using the context
export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within VideoProvider');
  }
  return context;
}
