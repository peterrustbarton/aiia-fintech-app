
// Modal for detailed security analysis with mock chart and actions

"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Plus, AlertCircle, Target, BarChart3, DollarSign } from 'lucide-react';
import { useSecurity, useWatchlists, useAddToWatchlist } from '@/hooks/use-api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SymbolModalProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock chart component
function MockChart({ symbol, score }: { symbol: string; score?: string }) {
  const scoreValue = parseFloat(score || '75');
  const chartColor = scoreValue >= 80 ? 'text-financial-positive' : scoreValue >= 70 ? 'text-theme-accent-primary' : 'text-financial-neutral';
  
  return (
    <div className="h-48 rounded-lg border-2 border-dashed border-theme-panel-border bg-theme-panel-hover/30 flex flex-col items-center justify-center animate-fade-in-up">
      <BarChart3 className="h-12 w-12 text-theme-accent-primary mb-2" />
      <div className="text-center">
        <div className="text-lg font-semibold text-text-primary">{symbol} Price Chart</div>
        <div className="text-sm text-text-secondary mt-1">Mock Chart Placeholder</div>
        <div className="flex items-center justify-center mt-3 gap-2">
          <div className={cn("w-3 h-3 rounded-full", chartColor)} />
          <span className="text-sm font-medium text-text-primary">Score: {scoreValue.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export function SymbolModal({ symbol, isOpen, onClose }: SymbolModalProps) {
  const { data: security, isLoading, error } = useSecurity(symbol);
  const { data: watchlists } = useWatchlists();
  const addToWatchlist = useAddToWatchlist();

  const handleAddToWatchlist = (watchlistId: number) => {
    addToWatchlist.mutate({ watchlistId, symbol });
  };

  const getFactorColor = (value?: number) => {
    if (!value) return 'text-neutral';
    if (value >= 35) return 'text-positive';
    if (value >= 25) return 'text-theme-accent-primary';
    if (value >= 15) return 'text-neutral';
    return 'text-negative';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto panel">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            <TrendingUp className="h-5 w-5 text-theme-accent-primary" />
            {security?.symbol || symbol} Analysis
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Detailed security analysis and investment insights
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <div className="h-48 rounded-lg animate-shimmer" style={{ background: 'rgba(56, 189, 248, 0.1)' }} />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded-lg animate-shimmer" style={{ background: 'rgba(56, 189, 248, 0.1)' }} />
              <div className="h-24 rounded-lg animate-shimmer" style={{ background: 'rgba(56, 189, 248, 0.1)' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-financial-negative-bg border border-financial-negative/20">
            <div className="flex items-center gap-2 text-financial-negative">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load security data: {error.message}</span>
            </div>
          </div>
        )}

        {security && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{security.company_name}</h2>
                <p className="text-text-secondary">{security.sector}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-financial-positive">${(Math.random() * 200 + 50).toFixed(2)}</div>
                <div className="text-sm text-text-secondary">Mock Price</div>
              </div>
            </div>

            {/* Mock Chart */}
            <MockChart symbol={security.symbol} score={security.latest_score?.score_value} />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="panel hover:-translate-y-1 transition-all duration-200">
                <div className="p-4">
                  <div className="text-sm font-medium flex items-center gap-2 text-text-secondary mb-3">
                    <Target className="h-4 w-4 text-theme-accent-primary" />
                    AI Score
                  </div>
                  <div className="text-2xl font-bold text-theme-accent-primary">
                    {security.latest_score?.score_value ? parseFloat(security.latest_score.score_value).toFixed(1) : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge-positive text-xs">
                      {security.latest_score?.score_grade || 'N/A'}
                    </span>
                    <span className="text-sm text-text-secondary">{security.latest_score?.recommendation}</span>
                  </div>
                </div>
              </div>

              <div className="panel hover:-translate-y-1 transition-all duration-200">
                <div className="p-4">
                  <div className="text-sm font-medium flex items-center gap-2 text-text-secondary mb-3">
                    <DollarSign className="h-4 w-4 text-theme-accent-primary" />
                    Market Cap
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{security.market_cap_formatted}</div>
                  <div className="text-sm text-text-secondary">{security.sector}</div>
                </div>
              </div>

              <div className="panel hover:-translate-y-1 transition-all duration-200">
                <div className="p-4">
                  <div className="text-sm font-medium text-text-secondary mb-3">Status</div>
                  <span className={security.is_active ? "badge-positive" : "badge-neutral"}>
                    {security.is_active ? "Active" : "Inactive"}
                  </span>
                  <div className="text-sm text-text-secondary mt-2">
                    Listed Security
                  </div>
                </div>
              </div>
            </div>

            {/* AI Factor Breakdown */}
            {security.latest_score?.factor_breakdown_json && (
              <div className="panel animate-fade-in-up">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-2">AI Analysis Factors</h3>
                  <p className="text-text-secondary text-sm mb-4">
                    Explainable AI breakdown of the investment score
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(security.latest_score.factor_breakdown_json as any).map(([key, value]) => {
                      if (key === 'explanation') return null;
                      return (
                        <div key={key} className="text-center p-3 rounded-lg bg-theme-panel-hover border border-theme-panel-border">
                          <div className={cn("text-lg font-bold", getFactorColor(value as number))}>
                            {typeof value === 'number' ? value.toFixed(1) : 'N/A'}
                          </div>
                          <div className="text-sm text-text-secondary capitalize">{key}</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {(security.latest_score.factor_breakdown_json as any)?.explanation && (
                    <div className="mt-6 space-y-3">
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-financial-positive mb-2">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            {((security.latest_score.factor_breakdown_json as any).explanation.strengths || []).map((strength: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-text-primary">
                                <div className="w-1.5 h-1.5 bg-financial-positive rounded-full" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-financial-neutral mb-2">Concerns</h4>
                          <ul className="text-sm space-y-1">
                            {((security.latest_score.factor_breakdown_json as any).explanation.concerns || []).map((concern: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-text-primary">
                                <div className="w-1.5 h-1.5 bg-financial-neutral rounded-full" />
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add to Watchlist */}
            <div className="panel animate-fade-in-up">
              <div className="p-6">
                <h3 className="text-lg font-bold text-text-primary mb-2">Add to Watchlist</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Track this security in your investment portfolios
                </p>
                <div className="flex flex-wrap gap-2">
                  {watchlists?.map((watchlist) => {
                    const isAlreadyAdded = watchlist.symbols.includes(security.symbol);
                    return (
                      <button
                        key={watchlist.id}
                        className={isAlreadyAdded ? "btn-ghost" : "btn-primary-gradient text-sm"}
                        disabled={isAlreadyAdded || addToWatchlist.isPending}
                        onClick={() => handleAddToWatchlist(watchlist.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isAlreadyAdded ? 'Added to' : 'Add to'} {watchlist.name}
                      </button>
                    );
                  })}
                  {(!watchlists || watchlists.length === 0) && (
                    <div className="text-sm text-text-secondary">
                      No watchlists available. Create one first.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
