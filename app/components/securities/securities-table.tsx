
// Securities table with sorting and modal trigger

"use client";

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
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
}

type SortField = 'symbol' | 'company_name' | 'sector' | 'market_cap' | 'score';
type SortDirection = 'asc' | 'desc';

export function SecuritiesTable({ securities, loading }: SecuritiesTableProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

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
    if (!score) return 'text-gray-500';
    const numScore = parseFloat(score);
    if (numScore >= 85) return 'text-green-600';
    if (numScore >= 70) return 'text-blue-600';
    if (numScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B')) return 'secondary';
    if (grade.startsWith('C')) return 'outline';
    return 'destructive';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Securities Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Securities Dashboard
            <Badge variant="outline" className="ml-auto">
              {securities.length} Securities
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('symbol')} className="h-8 p-0">
                      Symbol <SortIcon field="symbol" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('company_name')} className="h-8 p-0">
                      Company <SortIcon field="company_name" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('sector')} className="h-8 p-0">
                      Sector <SortIcon field="sector" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('market_cap')} className="h-8 p-0">
                      Market Cap <SortIcon field="market_cap" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('score')} className="h-8 p-0">
                      AI Score <SortIcon field="score" />
                    </Button>
                  </TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSecurities.map((security) => (
                  <TableRow 
                    key={security.symbol}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedSymbol(security.symbol)}
                  >
                    <TableCell>
                      <div className="font-mono font-semibold text-blue-600">
                        {security.symbol}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{security.company_name}</div>
                    </TableCell>
                    <TableCell>
                      {security.sector && (
                        <Badge variant="outline">{security.sector}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{security.market_cap_formatted}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-bold text-lg", getScoreColor(security.latest_score?.score_value))}>
                          {security.latest_score?.score_value ? parseFloat(security.latest_score.score_value).toFixed(1) : 'N/A'}
                        </span>
                        {security.latest_score?.score_grade && (
                          <Badge variant={getScoreBadgeVariant(security.latest_score.score_grade)}>
                            {security.latest_score.score_grade}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {security.latest_score?.recommendation === 'Strong Buy' && (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                        {security.latest_score?.recommendation === 'Buy' && (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        )}
                        {security.latest_score?.recommendation === 'Hold' && (
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-sm font-medium">
                          {security.latest_score?.recommendation || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
