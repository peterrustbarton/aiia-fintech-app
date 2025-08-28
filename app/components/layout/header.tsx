
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold">
              AiiA <span className="text-blue-600">Dashboard</span>
            </h1>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 ml-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
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
              "h-4 w-4",
              health?.status === 'healthy' ? "text-green-600" : "text-red-600"
            )} 
          />
          <span className="hidden sm:inline-block text-xs text-muted-foreground">
            {health?.status === 'healthy' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
}
