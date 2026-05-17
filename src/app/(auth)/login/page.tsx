'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary uppercase tracking-tight">
            4x4models
          </h1>
          <p className="text-on-surface-variant mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-label uppercase tracking-wider text-on-surface mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-4 py-3 text-on-surface placeholder:text-outline/50 focus:border-primary focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-label uppercase tracking-wider text-on-surface mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-4 py-3 pr-12 text-on-surface placeholder:text-outline/50 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-error text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-label uppercase font-bold tracking-wider rounded-sm transition-all duration-300 btn-primary-glow disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
