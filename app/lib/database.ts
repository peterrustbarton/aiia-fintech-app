// AiiA Database Connection and Utilities
// Prisma Client setup with connection pooling and error handling

import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance
const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// In development, store the client on the global object to prevent 
// creating multiple instances during hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Database utility functions
export class DatabaseUtils {
  static async testConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  static async getHealthStatus() {
    try {
      const userCount = await prisma.user.count();
      const securityCount = await prisma.security.count();
      const scoreCount = await prisma.score.count();
      
      return {
        status: 'healthy',
        connected: true,
        tables: {
          users: userCount,
          securities: securityCount,
          scores: scoreCount,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Convert BigInt values to strings for JSON serialization
  static serializeBigInt(obj: any): any {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  }
}

// Export the Prisma client instance
export default prisma;

// Export type definitions for use in other files
export type {
  User,
  Security,
  Score,
  Watchlist,
  WatchlistItem,
} from '@prisma/client';
