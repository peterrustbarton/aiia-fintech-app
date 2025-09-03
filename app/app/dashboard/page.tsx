
// Main dashboard page with securities table

"use client";

import { Header } from '@/components/layout/header';
import { SecuritiesTable } from '@/components/securities/securities-table';
import { useSecurities } from '@/hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: securities, isLoading, error, refetch } = useSecurities();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered security analysis and investment insights with live market data
          </p>
        </div>

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load securities: {error.message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <SecuritiesTable 
          securities={securities || []} 
          loading={isLoading} 
          onRefresh={handleRefresh}
        />
      </main>
    </div>
  );
}
