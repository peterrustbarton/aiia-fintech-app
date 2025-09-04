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
import TradeModal from '../TradeModal'; // NEW IMPORT

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

    // NEW STATE for trade modal
    const [tradeOpen, setTradeOpen] = useState(false);
    const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);
    const [tradeCompany, setTradeCompany] = useState<string | null>(null);

    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        if (!onRefresh) return;

        const interval = setInterval(() => {
            onRefresh();
            setLastUpdated(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, [onRefresh]);

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

    const getChangeColor = (change?: number | null) => {
        if (change === undefined || change === null) return 'text-gray-500';
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-500';
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {getLastUpdatedText()}
                            {securities.some(s => s.data_source) && (
                                <Badge variant="outline" className="text-xs">
                                    Live Data
                                </Badge>
                            )}
                        </div>
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onRefresh();
                                    setLastUpdated(new Date());
                                }}
                                disabled={loading}
                            >
                                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                                Refresh
                            </Button>
                        )}
                    </div>
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
                                        <Button variant="ghost" onClick={() => handleSort('live_price')} className="h-8 p-0">
                                            Live Price <SortIcon field="live_price" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('price_change')} className="h-8 p-0">
                                            Change % <SortIcon field="price_change" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => handleSort('score')} className="h-8 p-0">
                                            AI Score <SortIcon field="score" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Recommendation</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedSecurities.map((security) => (
                                    <TableRow
                                        key={security.symbol}
                                        className="hover:bg-muted/50"
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
                                                <span className="font-bold text-lg">
                                                    {formatPrice(security.live_price)}
                                                </span>
                                                {security.data_source && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {security.data_source}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={cn("font-bold text-lg", getChangeColor(security.price_change_percent))}>
                                                    {formatChange(security.price_change_percent)}
                                                </span>
                                                {security.price_change_percent !== null && security.price_change_percent !== undefined && (
                                                    <>
                                                        {security.price_change_percent > 0 && (
                                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                                        )}
                                                        {security.price_change_percent < 0 && (
                                                            <TrendingDown className="h-4 w-4 text-red-600" />
                                                        )}
                                                    </>
                                                )}
                                            </div>
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
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                className="btn-primary-gradient"
                                                onClick={() => {
                                                    setTradeSymbol(security.symbol);
                                                    setTradeCompany(security.company_name || "");
                                                    setTradeOpen(true);
                                                }}
                                            >
                                                Trade
                                            </Button>
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

            {tradeSymbol && (
                <TradeModal
                    isOpen={tradeOpen}
                    onClose={() => setTradeOpen(false)}
                    symbol={tradeSymbol}
                    companyName={tradeCompany || ""}
                />
            )}
        </>
    );
}