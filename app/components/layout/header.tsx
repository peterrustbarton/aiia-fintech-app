
// Main navigation header component

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart3, List, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHealth } from '@/hooks/use-api';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Watchlists', href: '/watchlists', icon: List },
];

export function Header() {
  const pathname = usePathname();
  const { data: health } = useHealth();

  return (
    <header className="sticky top-0 z-50 w-full panel border-b-0 rounded-none animate-slide-down">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <div className="p-2 rounded-lg shadow-glow" style={{ background: 'linear-gradient(45deg, var(--accent-blue), var(--accent-teal))' }}>
            <TrendingUp className="h-5 w-5 text-theme-bg-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-text-primary">
              AiiA <span style={{ color: 'var(--accent-blue)' }}>Dashboard</span>
            </h1>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 ml-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:-translate-y-1",
                  isActive
                    ? "text-theme-accent-primary bg-theme-panel-hover shadow-glow"
                    : "text-text-secondary hover:text-theme-accent-primary hover:bg-theme-panel-hover"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Health Status */}
        <div className="ml-auto flex items-center space-x-2">
          <Activity 
            className={cn(
              "h-4 w-4 transition-colors",
              health?.status === 'healthy' ? "text-financial-positive" : "text-financial-negative"
            )} 
          />
          <span className="hidden sm:inline-block text-xs text-text-secondary">
            {health?.status === 'healthy' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
}
