
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
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-6 space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Investment Dashboard</h1>
          <p className="text-text-secondary mt-2">
            AI-powered security analysis and investment insights with live market data
          </p>
        </div>

        {error && (
          <div className="panel animate-fade-in-up">
            <div className="p-6">
              <div className="flex items-center gap-2 text-financial-negative">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load securities: {error.message}</span>
              </div>
            </div>
          </div>
        )}

        <div className="animate-fade-in-up">
          <SecuritiesTable 
            securities={securities || []} 
            loading={isLoading} 
            onRefresh={handleRefresh}
          />
        </div>
      </main>
    </div>
  );
}
