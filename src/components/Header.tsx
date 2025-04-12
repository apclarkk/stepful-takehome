'use client';

import { useUser } from '@/contexts/UserContext';
import { useSessionType } from '@/providers/SessionTypeProvider';
import Image from 'next/image';
import { SessionType } from '@/hooks/useSessions';
import { Calendar, History } from 'akar-icons';
import { RolePill } from './RolePill';

export function Header() {
  const { user, setUser } = useUser();
  const { sessionType, setSessionType } = useSessionType();

  const tabs: { label: string; value: SessionType, Icon: React.ReactNode }[] = [
    { label: 'Upcoming', value: 'upcoming', Icon: <Calendar /> },
    { label: 'Past Meetings', value: 'past', Icon: <History /> },
  ];

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`flex items-center ${!!user ? 'justify-between' : 'justify-center'}`}>
          <Image
            src="https://cdn.prod.website-files.com/60fae2951956f7e83dd6018b/60fae70b9d07f224c72d8d46_parade-hw5bMw3aDwedptddoSLhya-logo.png"
            alt="Stepful Logo"
            className='cursor-pointer'
            width={100}
            height={100}
            onClick={() => setUser(undefined)}
          />
          {!!user && (
            <div className="flex items-center gap-4">
              <nav className="flex space-x-1 rounded-lg gap-2 p-1">
                {tabs.map(({ label, value, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSessionType(value)}
                    className={`
                      py-2 text-sm font-medium transition-colors flex flex-row gap-2 items-center cursor-pointer
                      ${sessionType === value
                        ? 'border-b-2 border-pink'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    {Icon}{label}
                  </button>
                ))}
              </nav>
              {user && <RolePill onClick={() => setUser(undefined)} role={user.role}> {user.name} </RolePill>}
            </div>
          )}

        </div>
      </div>
    </header>
  );
} 