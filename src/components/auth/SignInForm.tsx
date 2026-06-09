import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, Loader2, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface SignInFormProps {
  /** Called after a successful sign-in / sign-up (e.g. to close a modal). */
  onSuccess?: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      onSuccess?.();
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
    <>
      <header className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">{isSignUp ? 'Create an account' : 'Login'}</h2>
        <p className="text-sm text-muted-foreground font-medium">
          {isSignUp ? 'Enter your details to get started' : 'Enter your credentials to access your account'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label>Display Name</Label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10 pl-10"
                required={isSignUp}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Email Address</Label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 pl-10"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive text-center">
            {error}
          </p>
        )}

        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 font-semibold"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : isSignUp ? 'Sign Up' : 'Login'}
          </Button>

          <Button
            type="button"
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-muted-foreground hover:text-primary font-medium"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </Button>
        </div>
      </form>
    </>
  );
};
