
// Redirect to dashboard for now
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
