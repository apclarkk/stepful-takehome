'use client';

import { useUser } from '@/contexts/UserContext';
import { Onboarding } from '@/components/Onboarding';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#EDEBEB]">
      <main className="mx-auto px-4 py-8">
        {!user ? <Onboarding /> : <></>}
      </main>
    </div>
  );
}
