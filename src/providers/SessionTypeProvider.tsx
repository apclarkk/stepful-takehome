"use client"
import { createContext, useContext, ReactNode, useState } from 'react';
import { SessionType } from '@/hooks/useSessions';

interface SessionTypeContextType {
    sessionType: SessionType;
    setSessionType: (type: SessionType) => void;
}

const SessionTypeContext = createContext<SessionTypeContextType | undefined>(undefined);

export function useSessionType() {
    const context = useContext(SessionTypeContext);
    if (context === undefined) {
        throw new Error('useSessionType must be used within a SessionTypeProvider');
    }
    return context;
}

export function SessionTypeProvider({ children }: { children: ReactNode }) {
    const [sessionType, setSessionType] = useState<SessionType>('upcoming');

    return (
        <SessionTypeContext.Provider value={{ sessionType, setSessionType }}>
            {children}
        </SessionTypeContext.Provider>
    );
} 