'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Automated Assignment Grading System</h1>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
