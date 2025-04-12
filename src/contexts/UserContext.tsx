'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@prisma/client';
import { useUsers, CreateUserInput } from '@/hooks/useUsers';



interface UserContextType {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  allUsers: User[] | undefined;
  createUser: (input: CreateUserInput) => Promise<User>;
  isCreatingUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { users: allUsers, createUser, isCreatingUser } = useUsers();

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      allUsers,
      createUser,
      isCreatingUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export { UserContext }; 
