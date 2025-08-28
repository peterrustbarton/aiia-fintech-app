
// Watchlists management page

"use client";

import { Header } from '@/components/layout/header';
import { WatchlistManager } from '@/components/watchlists/watchlist-manager';

export default function WatchlistsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-6">
        <WatchlistManager />
      </main>
    </div>
  );
}
