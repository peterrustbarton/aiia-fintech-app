
// Watchlist management component with CRUD operations

"use client";

import { useState } from 'react';
import { Plus, Trash2, List, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWatchlists, useCreateWatchlist, useRemoveFromWatchlist } from '@/hooks/use-api';
import { toast } from 'sonner';

export function WatchlistManager() {
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: watchlists, isLoading } = useWatchlists();
  const createWatchlist = useCreateWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Helper functions for formatting live data
  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change?: number | null) => {
    if (change === undefined || change === null) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change?: number | null) => {
    if (change === undefined || change === null) return 'text-gray-500';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const handleCreateWatchlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchlistName.trim()) return;

    try {
      await createWatchlist.mutateAsync(newWatchlistName.trim());
      setNewWatchlistName('');
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error already handled by the hook
    }
  };

  const handleRemoveItem = (watchlistId: number, symbol: string, watchlistName: string) => {
    removeFromWatchlist.mutate({ watchlistId, symbol });
    toast.success(`${symbol} removed from ${watchlistName}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="panel animate-pulse-glow">
            <div className="p-6">
              <div className="h-6 rounded animate-shimmer" style={{ background: 'rgba(56, 189, 248, 0.1)' }} />
              <div className="mt-4 h-20 rounded animate-shimmer" style={{ background: 'rgba(56, 189, 248, 0.1)' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Watchlists</h2>
          <p className="text-text-secondary mt-1">
            Manage your investment portfolios and track securities
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary-gradient">
              <Plus className="h-4 w-4 mr-2" />
              New Watchlist
            </button>
          </DialogTrigger>
          <DialogContent className="panel">
            <DialogHeader>
              <DialogTitle className="text-text-primary">Create New Watchlist</DialogTitle>
              <DialogDescription className="text-text-secondary">
                Create a new watchlist to organize and track your securities
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWatchlist} className="space-y-4">
              <Input
                placeholder="Enter watchlist name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                autoFocus
                className="bg-theme-panel-hover border-theme-panel-border text-text-primary"
              />
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  className="btn-ghost" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary-gradient"
                  disabled={!newWatchlistName.trim() || createWatchlist.isPending}
                >
                  {createWatchlist.isPending ? 'Creating...' : 'Create Watchlist'}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Watchlists */}
      <div className="grid gap-6">
        {watchlists?.length === 0 ? (
          <div className="panel animate-fade-in-up">
            <div className="p-6 text-center py-12">
              <List className="mx-auto h-12 w-12 text-text-secondary" />
              <h3 className="mt-4 text-lg font-semibold text-text-primary">No watchlists yet</h3>
              <p className="text-text-secondary">
                Create your first watchlist to start tracking securities
              </p>
              <button 
                className="btn-primary-gradient mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Watchlist
              </button>
            </div>
          </div>
        ) : (
          watchlists?.map((watchlist) => (
            <div key={watchlist.id} className="panel hover:-translate-y-1 transition-all duration-300 animate-fade-in-up">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-theme-accent-primary" />
                      <h3 className="text-xl font-bold text-text-primary">{watchlist.name}</h3>
                    </div>
                    <p className="text-text-secondary text-sm mt-1">
                      Created {new Date(watchlist.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full border border-theme-panel-border text-xs text-text-secondary">
                    {watchlist.item_count} securities
                  </span>
                </div>
              </div>
              
              {watchlist.items && watchlist.items.length > 0 ? (
                <div className="overflow-hidden">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Sector</th>
                        <th>Live Price</th>
                        <th>Change %</th>
                        <th>Added</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.items.map((item) => (
                        <tr key={`${watchlist.id}-${item.symbol}`}>
                          <td>
                            <div className="font-mono font-semibold text-theme-accent-primary">
                              {item.symbol}
                            </div>
                          </td>
                          <td>
                            <div className="font-medium text-text-primary">
                              {item.security?.company_name || 'Unknown'}
                            </div>
                          </td>
                          <td>
                            {item.security?.sector && (
                              <span className="px-2 py-1 rounded-md border border-theme-panel-border text-xs text-text-secondary">
                                {item.security.sector}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-text-primary">
                                {formatPrice(item.security?.live_price)}
                              </span>
                              {item.security?.data_source && (
                                <span className="px-2 py-1 rounded-md border border-theme-panel-border text-xs text-text-secondary">
                                  {item.security.data_source}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${getChangeColor(item.security?.price_change_percent)}`}>
                                {formatChange(item.security?.price_change_percent)}
                              </span>
                              {item.security?.price_change_percent !== null && item.security?.price_change_percent !== undefined && (
                                <>
                                  {item.security.price_change_percent > 0 && (
                                    <TrendingUp className="h-4 w-4 text-financial-positive" />
                                  )}
                                  {item.security.price_change_percent < 0 && (
                                    <TrendingDown className="h-4 w-4 text-financial-negative" />
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="text-sm text-text-secondary">
                              {new Date(item.added_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn-ghost text-xs p-2 text-financial-negative hover:text-financial-negative"
                              onClick={() => handleRemoveItem(watchlist.id, item.symbol, watchlist.name)}
                              disabled={removeFromWatchlist.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center py-8">
                  <TrendingUp className="mx-auto h-8 w-8 text-text-secondary" />
                  <p className="mt-2 text-sm text-text-primary">
                    No securities in this watchlist yet
                  </p>
                  <p className="text-sm text-text-secondary">
                    Add securities from the dashboard
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
