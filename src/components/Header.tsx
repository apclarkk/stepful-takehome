'use client';

import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
export function Header() {
  const { user, setUser } = useUser();

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`flex items-center ${!!user ? 'justify-between' : 'justify-center'}`}>
          <Image src="https://cdn.prod.website-files.com/60fae2951956f7e83dd6018b/60fae70b9d07f224c72d8d46_parade-hw5bMw3aDwedptddoSLhya-logo.png" alt="Stepful Logo" width={100} height={100} />
        </div>
      </div>
    </header>
  );
} 