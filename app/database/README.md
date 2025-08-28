
# AiiA Database Foundation

## Overview
This directory contains the PostgreSQL database foundation for **AiiA - Artificially Intelligent Investment Assistant**, a comprehensive fintech application that provides explainable security scoring and investment insights.

## Files Structure

```
database/
├── schema.sql          # Complete PostgreSQL schema with tables and indexes
├── sample_data.sql     # Sample INSERT statements for testing
└── README.md          # This documentation

scripts/
├── seed.ts            # Prisma seed script with realistic test data

lib/
└── database.ts        # Database connection utilities and helpers
```

## Database Schema

### Tables

1. **users** - User account information
   - `id` (Primary Key, Serial)
   - `email` (Unique, VARCHAR(255))
   - `password_hash` (VARCHAR(255))
   - `first_name` (VARCHAR(100))
   - `last_name` (VARCHAR(100))
   - `created_at` (Timestamp)

2. **securities** - Stock/security information
   - `symbol` (Primary Key, VARCHAR(10))
   - `company_name` (VARCHAR(255))
   - `sector` (VARCHAR(100))
   - `market_cap` (BIGINT)
   - `is_active` (BOOLEAN, default: TRUE)

3. **scores** - AI-generated security scores
   - `id` (Primary Key, Serial)
   - `symbol` (Foreign Key to securities)
   - `score_value` (DECIMAL(5,2))
   - `calculated_at` (Timestamp)
   - `factor_breakdown_json` (JSONB) - Explainable AI factors

4. **watchlists** - User portfolio collections
   - `id` (Primary Key, Serial)
   - `user_id` (Foreign Key to users)
   - `name` (VARCHAR(255))
   - `created_at` (Timestamp)

5. **watchlist_items** - Junction table for watchlist securities
   - `id` (Primary Key, Serial)
   - `watchlist_id` (Foreign Key to watchlists)
   - `symbol` (Foreign Key to securities)
   - `added_at` (Timestamp)
   - Unique constraint on (watchlist_id, symbol)

### Indexes
Performance-optimized indexes on frequently queried columns:
- User email lookups
- Security sector and market cap filtering
- Score value ranking and symbol lookups
- Watchlist user associations
- Date-based queries

## Usage

### 1. Generate Prisma Client
```bash
cd /home/ubuntu/aiia_mvp/app
yarn prisma generate
```

### 2. Apply Database Schema
```bash
yarn prisma db push
```

### 3. Seed Sample Data
```bash
yarn prisma db seed
```

### 4. Test Database Connection
```typescript
import prisma, { DatabaseUtils } from '@/lib/database';

// Test connection
const isConnected = await DatabaseUtils.testConnection();

// Get health status
const health = await DatabaseUtils.getHealthStatus();
```

## Sample Data

The seed script includes:
- **2 Users**: john.investor@email.com, sarah.trader@email.com
- **10 Securities**: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, JPM, JNJ, V, WMT
- **AI Scores**: Realistic scores (60-95 range) with explainable factor breakdowns
- **Watchlists**: Sample portfolios with securities assignments

## Design Choices

### 1. Primary Keys
- **users**: Auto-increment integer for internal references
- **securities**: Stock symbol (VARCHAR) as natural primary key for easy API integration
- **scores, watchlists, watchlist_items**: Auto-increment integers for performance

### 2. Data Types
- **DECIMAL(5,2)**: Score values (0.00 to 999.99 range)
- **BIGINT**: Market cap values for large numbers
- **JSONB**: Factor breakdown for efficient querying and storage
- **VARCHAR with constraints**: Optimized string lengths

### 3. Relationships
- **Cascade deletes**: Maintains referential integrity
- **Foreign key constraints**: Ensures data consistency
- **Unique constraints**: Prevents duplicate watchlist items

### 4. Performance Optimizations
- **Strategic indexes**: On frequently filtered columns
- **JSONB**: For factor breakdown querying capabilities
- **Connection pooling**: Via Prisma client configuration

### 5. Security Considerations
- **Password hashing**: Using bcrypt with salt rounds
- **Input validation**: Via Prisma type safety
- **SQL injection prevention**: Through parameterized queries

## Next Steps

1. **API Integration**: Connect to real-time market data feeds
2. **AI Scoring Engine**: Implement machine learning models for score calculation  
3. **User Authentication**: Add JWT-based session management
4. **Caching Layer**: Implement Redis for frequently accessed data
5. **Backup Strategy**: Set up automated database backups

## Environment Variables Required

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```
