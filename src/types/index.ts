export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  photoURL?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  createdAt: any;
  createdBy: string;
  icon?: string; // Icon name from lucide-react or similar
  color?: string; // Tailwind color class or hex
}

export interface RatingObject {
  id: string;
  themeId: string;
  name: string;
  rating: number; // Average rating
  ratingCount: number;
}

export interface Rating {
  id: string;
  themeId: string;
  objectId: string;
  userId: string;
  score: number;
  comment?: string;
  createdAt: any;
}
