
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
  const chartColor = scoreValue >= 80 ? 'bg-green-500' : scoreValue >= 70 ? 'bg-blue-500' : 'bg-yellow-500';
  
  return (
    <div className="h-48 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center">
      <BarChart3 className="h-12 w-12 text-muted-foreground mb-2" />
      <div className="text-center">
        <div className="text-lg font-semibold text-muted-foreground">{symbol} Price Chart</div>
        <div className="text-sm text-muted-foreground mt-1">Mock Chart Placeholder</div>
        <div className="flex items-center justify-center mt-3 gap-2">
          <div className={cn("w-3 h-3 rounded-full", chartColor)} />
          <span className="text-sm font-medium">Score: {scoreValue.toFixed(1)}</span>
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
    if (!value) return 'text-gray-500';
    if (value >= 35) return 'text-green-600';
    if (value >= 25) return 'text-blue-600';
    if (value >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {security?.symbol || symbol} Analysis
          </DialogTitle>
          <DialogDescription>
            Detailed security analysis and investment insights
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-muted animate-pulse rounded-lg" />
              <div className="h-24 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load security data: {error.message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {security && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{security.company_name}</h2>
                <p className="text-muted-foreground">{security.sector}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${Math.random() * 200 + 50}</div>
                <div className="text-sm text-muted-foreground">Mock Price</div>
              </div>
            </div>

            {/* Mock Chart */}
            <MockChart symbol={security.symbol} score={security.latest_score?.score_value} />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    AI Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {security.latest_score?.score_value ? parseFloat(security.latest_score.score_value).toFixed(1) : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{security.latest_score?.score_grade || 'N/A'}</Badge>
                    <span className="text-sm text-muted-foreground">{security.latest_score?.recommendation}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Market Cap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{security.market_cap_formatted}</div>
                  <div className="text-sm text-muted-foreground">{security.sector}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={security.is_active ? "default" : "secondary"}>
                    {security.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-2">
                    Listed Security
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Factor Breakdown */}
            {security.latest_score?.factor_breakdown_json && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Analysis Factors</CardTitle>
                  <CardDescription>
                    Explainable AI breakdown of the investment score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(security.latest_score.factor_breakdown_json as any).map(([key, value]) => {
                      if (key === 'explanation') return null;
                      return (
                        <div key={key} className="text-center">
                          <div className={cn("text-lg font-bold", getFactorColor(value as number))}>
                            {typeof value === 'number' ? value.toFixed(1) : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">{key}</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {(security.latest_score.factor_breakdown_json as any)?.explanation && (
                    <div className="mt-6 space-y-3">
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            {((security.latest_score.factor_breakdown_json as any).explanation.strengths || []).map((strength: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-yellow-600 mb-2">Concerns</h4>
                          <ul className="text-sm space-y-1">
                            {((security.latest_score.factor_breakdown_json as any).explanation.concerns || []).map((concern: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Add to Watchlist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add to Watchlist</CardTitle>
                <CardDescription>
                  Track this security in your investment portfolios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {watchlists?.map((watchlist) => {
                    const isAlreadyAdded = watchlist.symbols.includes(security.symbol);
                    return (
                      <Button
                        key={watchlist.id}
                        variant={isAlreadyAdded ? "secondary" : "outline"}
                        size="sm"
                        disabled={isAlreadyAdded || addToWatchlist.isPending}
                        onClick={() => handleAddToWatchlist(watchlist.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isAlreadyAdded ? 'Added to' : 'Add to'} {watchlist.name}
                      </Button>
                    );
                  })}
                  {(!watchlists || watchlists.length === 0) && (
                    <div className="text-sm text-muted-foreground">
                      No watchlists available. Create one first.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
