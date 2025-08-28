
// Watchlist management component with CRUD operations

"use client";

import { useState } from 'react';
import { Plus, Trash2, List, TrendingUp } from 'lucide-react';
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
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Watchlists</h2>
          <p className="text-muted-foreground">
            Manage your investment portfolios and track securities
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
              <DialogDescription>
                Create a new watchlist to organize and track your securities
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWatchlist} className="space-y-4">
              <Input
                placeholder="Enter watchlist name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newWatchlistName.trim() || createWatchlist.isPending}>
                  {createWatchlist.isPending ? 'Creating...' : 'Create Watchlist'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Watchlists */}
      <div className="grid gap-6">
        {watchlists?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <List className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No watchlists yet</h3>
                <p className="text-muted-foreground">
                  Create your first watchlist to start tracking securities
                </p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Watchlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          watchlists?.map((watchlist) => (
            <Card key={watchlist.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <List className="h-5 w-5" />
                      {watchlist.name}
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(watchlist.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {watchlist.item_count} securities
                  </Badge>
                </div>
              </CardHeader>
              
              {watchlist.items && watchlist.items.length > 0 ? (
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead>Added</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {watchlist.items.map((item) => (
                          <TableRow key={`${watchlist.id}-${item.symbol}`}>
                            <TableCell>
                              <div className="font-mono font-semibold text-blue-600">
                                {item.symbol}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {item.security?.company_name || 'Unknown'}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.security?.sector && (
                                <Badge variant="outline">{item.security.sector}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {new Date(item.added_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(watchlist.id, item.symbol, watchlist.name)}
                                disabled={removeFromWatchlist.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No securities in this watchlist yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add securities from the dashboard
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
