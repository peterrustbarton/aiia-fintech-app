
// Securities table with sorting and modal trigger

"use client";

import { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, RefreshCw, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Security } from '@/lib/api';
import { cn } from '@/lib/utils';
import { SymbolModal } from './symbol-modal';

interface SecuritiesTableProps {
  securities: Security[];
  loading?: boolean;
  onRefresh?: () => void;
}

type SortField = 'symbol' | 'company_name' | 'sector' | 'market_cap' | 'score' | 'live_price' | 'price_change';
type SortDirection = 'asc' | 'desc';

export function SecuritiesTable({ securities, loading, onRefresh }: SecuritiesTableProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!onRefresh) return;
    
    const interval = setInterval(() => {
      onRefresh();
      setLastUpdated(new Date());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [onRefresh]);

  // Set initial last updated time
  useEffect(() => {
    if (securities.length > 0 && !lastUpdated) {
      setLastUpdated(new Date());
    }
  }, [securities.length, lastUpdated]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSecurities = [...securities].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'score':
        aValue = parseFloat(a.latest_score?.score_value || '0');
        bValue = parseFloat(b.latest_score?.score_value || '0');
        break;
      case 'market_cap':
        aValue = parseFloat(a.market_cap || '0');
        bValue = parseFloat(b.market_cap || '0');
        break;
      case 'live_price':
        aValue = a.live_price || 0;
        bValue = b.live_price || 0;
        break;
      case 'price_change':
        aValue = a.price_change_percent || 0;
        bValue = b.price_change_percent || 0;
        break;
      default:
        aValue = a[sortField as keyof Security] || '';
        bValue = b[sortField as keyof Security] || '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getScoreColor = (score?: string) => {
    if (!score) return 'text-neutral';
    const numScore = parseFloat(score);
    if (numScore >= 85) return 'text-positive';
    if (numScore >= 70) return 'text-theme-accent-primary';
    if (numScore >= 60) return 'text-neutral';
    return 'text-negative';
  };

  const getScoreBadgeClass = (grade: string) => {
    if (grade.startsWith('A')) return 'badge-positive';
    if (grade.startsWith('B')) return 'badge-neutral';
    if (grade.startsWith('C')) return 'text-text-secondary border border-theme-panel-border bg-theme-panel-hover';
    return 'badge-negative';
  };

  const getChangeColor = (change?: number | null) => {
    if (change === undefined || change === null) return 'text-neutral';
    if (change > 0) return 'text-positive';
    if (change < 0) return 'text-negative';
    return 'text-neutral';
  };

  const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change?: number | null) => {
    if (change === undefined || change === null) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffMin === 0) return 'Updated now';
    if (diffMin === 1) return '1 min ago';
    if (diffMin < 60) return `${diffMin} mins ago`;
    return lastUpdated.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="panel animate-pulse-glow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Securities Dashboard</h2>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 rounded animate-shimmer" style={{ background: 'rgba(56, 189, 248, 0.1)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="panel hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-theme-accent-primary" />
            <h2 className="text-xl font-bold text-text-primary">Securities Dashboard</h2>
            <div className="px-3 py-1 rounded-full border border-theme-panel-border text-xs text-text-secondary ml-auto">
              {securities.length} Securities
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock className="h-4 w-4" />
              {getLastUpdatedText()}
              {securities.some(s => s.data_source) && (
                <span className="badge-positive text-xs">
                  Live Data
                </span>
              )}
            </div>
            {onRefresh && (
              <button
                className="btn-ghost text-sm"
                onClick={() => {
                  onRefresh();
                  setLastUpdated(new Date());
                }}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Refresh
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('symbol')}
                  >
                    Symbol <SortIcon field="symbol" />
                  </button>
                </th>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('company_name')}
                  >
                    Company <SortIcon field="company_name" />
                  </button>
                </th>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('sector')}
                  >
                    Sector <SortIcon field="sector" />
                  </button>
                </th>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('market_cap')}
                  >
                    Market Cap <SortIcon field="market_cap" />
                  </button>
                </th>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('live_price')}
                  >
                    Live Price <SortIcon field="live_price" />
                  </button>
                </th>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('price_change')}
                  >
                    Change % <SortIcon field="price_change" />
                  </button>
                </th>
                <th>
                  <button 
                    className="btn-ghost text-xs h-8 p-0"
                    onClick={() => handleSort('score')}
                  >
                    AI Score <SortIcon field="score" />
                  </button>
                </th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {sortedSecurities.map((security) => (
                <tr 
                  key={security.symbol}
                  className="cursor-pointer"
                  onClick={() => setSelectedSymbol(security.symbol)}
                >
                  <td>
                    <div className="font-mono font-semibold text-theme-accent-primary">
                      {security.symbol}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-text-primary">{security.company_name}</div>
                  </td>
                  <td>
                    {security.sector && (
                      <span className="px-2 py-1 rounded-md border border-theme-panel-border text-xs text-text-secondary">
                        {security.sector}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="font-medium text-text-primary">{security.market_cap_formatted}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-text-primary">
                        {formatPrice(security.live_price)}
                      </span>
                      {security.data_source && (
                        <span className="px-2 py-1 rounded-md border border-theme-panel-border text-xs text-text-secondary">
                          {security.data_source}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-bold text-lg", 
                        security.price_change_percent === null || security.price_change_percent === undefined
                          ? "text-neutral"
                          : security.price_change_percent > 0 
                          ? "text-positive" 
                          : security.price_change_percent < 0
                          ? "text-negative"
                          : "text-neutral"
                      )}>
                        {formatChange(security.price_change_percent)}
                      </span>
                      {security.price_change_percent !== null && security.price_change_percent !== undefined && (
                        <>
                          {security.price_change_percent > 0 && (
                            <TrendingUp className="h-4 w-4 text-financial-positive" />
                          )}
                          {security.price_change_percent < 0 && (
                            <TrendingDown className="h-4 w-4 text-financial-negative" />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-bold text-lg", getScoreColor(security.latest_score?.score_value))}>
                        {security.latest_score?.score_value ? parseFloat(security.latest_score.score_value).toFixed(1) : 'N/A'}
                      </span>
                      {security.latest_score?.score_grade && (
                        <span className={cn("px-2 py-1 rounded-md text-xs font-medium", getScoreBadgeClass(security.latest_score.score_grade))}>
                          {security.latest_score.score_grade}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {security.latest_score?.recommendation === 'Strong Buy' && (
                        <TrendingUp className="h-4 w-4 text-financial-positive" />
                      )}
                      {security.latest_score?.recommendation === 'Buy' && (
                        <TrendingUp className="h-4 w-4 text-theme-accent-primary" />
                      )}
                      {security.latest_score?.recommendation === 'Hold' && (
                        <TrendingDown className="h-4 w-4 text-financial-neutral" />
                      )}
                      <span className="text-sm font-medium text-text-primary">
                        {security.latest_score?.recommendation || 'N/A'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSymbol && (
        <SymbolModal
          symbol={selectedSymbol}
          isOpen={!!selectedSymbol}
          onClose={() => setSelectedSymbol(null)}
        />
      )}
    </>
  );
}
