
// Watchlists management page

"use client";

import { Header } from '@/components/layout/header';
import { WatchlistManager } from '@/components/watchlists/watchlist-manager';

export default function WatchlistsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-6">
        <div className="animate-fade-in-up">
          <WatchlistManager />
        </div>
      </main>
    </div>
  );
}
