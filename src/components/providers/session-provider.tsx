'use client';

import type { User } from '@/lib/types';
import React, { createContext, useState, useMemo } from 'react';

interface SessionContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        avatarUrl: 'https://picsum.photos/seed/user/100/100',
      });
      setIsLoading(false);
    }, 1000);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      isLoading,
    }),
    [user, isLoading]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
