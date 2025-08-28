
// React hooks for API calls with error handling and loading states

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, CURRENT_USER_ID, Security, Watchlist, WatchlistItem } from '@/lib/api';
import { toast } from 'sonner';

// Securities hooks
export function useSecurities() {
  return useQuery({
    queryKey: ['securities'],
    queryFn: () => apiClient.getSecurities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSecurity(symbol: string) {
  return useQuery({
    queryKey: ['security', symbol],
    queryFn: () => apiClient.getSecurity(symbol),
    enabled: !!symbol,
  });
}

// Watchlists hooks
export function useWatchlists() {
  return useQuery({
    queryKey: ['watchlists', CURRENT_USER_ID],
    queryFn: () => apiClient.getUserWatchlists(CURRENT_USER_ID),
  });
}

export function useCreateWatchlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => apiClient.createWatchlist(CURRENT_USER_ID, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast.success('Watchlist created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create watchlist: ${error.message}`);
    },
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, symbol }: { watchlistId: number; symbol: string }) =>
      apiClient.addToWatchlist(watchlistId, symbol),
    onSuccess: (_, { symbol }) => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast.success(`${symbol} added to watchlist`);
    },
    onError: (error) => {
      toast.error(`Failed to add to watchlist: ${error.message}`);
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, symbol }: { watchlistId: number; symbol: string }) =>
      apiClient.removeFromWatchlist(watchlistId, symbol),
    onSuccess: (_, { symbol }) => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast.success(`${symbol} removed from watchlist`);
    },
    onError: (error) => {
      toast.error(`Failed to remove from watchlist: ${error.message}`);
    },
  });
}

// Health check hook
export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 30000, // Check every 30 seconds
  });
}
