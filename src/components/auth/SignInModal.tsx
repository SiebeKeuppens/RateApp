import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { X, Mail, Lock, Loader2, User } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          role: 'user',
          createdAt: new Date()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Email already in use.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
        
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-extralight tracking-tight text-foreground mb-2">{isSignUp ? 'Register' : 'Sign In'}</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            {isSignUp ? 'Create a new account' : 'Enter your credentials to proceed'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Display Name</label>
              <div className="flex items-center space-x-3 bg-secondary/30 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all group">
                <User size={16} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground font-medium"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email Address</label>
            <div className="flex items-center space-x-3 bg-secondary/30 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all group">
              <Mail size={16} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Password</label>
            <div className="flex items-center space-x-3 bg-secondary/30 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all group">
              <Lock size={16} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground font-medium"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-[10px] text-destructive uppercase tracking-widest text-center font-bold">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : isSignUp ? 'Create Account' : 'Authenticate'}
            </button>
            
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-[10px] text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors font-bold"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
