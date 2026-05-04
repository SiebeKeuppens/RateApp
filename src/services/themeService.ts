import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';
import { Theme, RatingObject, Rating } from '../types';

export const themeService = {
  // Themes
  async getThemes(): Promise<Theme[]> {
    const querySnapshot = await getDocs(collection(db, 'themes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Theme));
  },

  async getTheme(themeId: string): Promise<Theme | null> {
    const docSnap = await getDoc(doc(db, 'themes', themeId));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Theme) : null;
  },

  async addTheme(theme: Omit<Theme, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'themes'), {
      ...theme,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Rating Objects (Now in a top-level collection)
  async getRatingObjects(themeId: string): Promise<RatingObject[]> {
    const q = query(collection(db, 'ratingobject'), where('themeId', '==', themeId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RatingObject));
  },

  async addRatingObject(object: Omit<RatingObject, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'ratingobject'), {
      ...object,
      rating: 0,
      ratingCount: 0
    });
    return docRef.id;
  },

  // Ratings
  async getUserRatings(userId: string, themeId: string): Promise<Set<string>> {
    const q = query(
      collection(db, 'ratings'), 
      where('userId', '==', userId), 
      where('themeId', '==', themeId)
    );
    const querySnapshot = await getDocs(q);
    return new Set(querySnapshot.docs.map(doc => (doc.data() as Rating).objectId));
  },

  async addRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<void> {
    const ratingRef = collection(db, 'ratings');
    const objectRef = doc(db, 'ratingobject', rating.objectId);

    await runTransaction(db, async (transaction) => {
      // Check if user already rated this object
      const q = query(
        collection(db, 'ratings'), 
        where('userId', '==', rating.userId), 
        where('objectId', '==', rating.objectId)
      );
      const existingRating = await getDocs(q);
      if (!existingRating.empty) {
        throw new Error("You have already rated this item.");
      }

      const objectDoc = await transaction.get(objectRef);
      if (!objectDoc.exists()) {
        throw new Error("Rating object does not exist!");
      }

      const data = objectDoc.data() as RatingObject;
      const currentRating = data.rating || 0;
      const currentCount = data.ratingCount || 0;
      
      const newCount = currentCount + 1;
      const newRating = (currentRating * currentCount + rating.score) / newCount;

      // 1. Add the rating document
      const newRatingRef = doc(ratingRef);
      transaction.set(newRatingRef, {
        ...rating,
        createdAt: serverTimestamp()
      });

      // 2. Update the object's stats
      transaction.update(objectRef, {
        rating: newRating,
        ratingCount: newCount
      });
    });
  }
};
