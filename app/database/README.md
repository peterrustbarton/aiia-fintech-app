
# AiiA Database Foundation

## Overview
This directory contains the PostgreSQL database foundation for the AiiA (Artificially Intelligent Investment Assistant) fintech application MVP.

## Database Schema

The database consists of 5 core tables designed for a financial investment platform:

### 1. `users`
Stores user account information for platform authentication and personalization.

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique user identifier
- `email` (VARCHAR(255) UNIQUE NOT NULL) - User email address (login credential)
- `password_hash` (VARCHAR(255) NOT NULL) - Bcrypt hashed password
- `first_name` (VARCHAR(100) NOT NULL) - User's first name
- `last_name` (VARCHAR(100) NOT NULL) - User's last name
- `created_at` (TIMESTAMP WITH TIME ZONE) - Account creation timestamp

**Indexes:** email, created_at

### 2. `securities`
Contains information about financial securities (stocks, ETFs, etc.) available on the platform.

**Columns:**
- `symbol` (VARCHAR(10) PRIMARY KEY) - Stock ticker symbol (e.g., AAPL, MSFT)
- `company_name` (VARCHAR(255) NOT NULL) - Full company name
- `sector` (VARCHAR(100)) - Industry sector classification
- `market_cap` (BIGINT) - Market capitalization in USD
- `is_active` (BOOLEAN DEFAULT TRUE) - Whether security is actively traded

**Indexes:** sector, market_cap, is_active, company_name

### 3. `scores`
Stores AI-generated investment scores and analysis for securities.

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique score record identifier
- `symbol` (VARCHAR(10) NOT NULL) - References securities.symbol
- `score_value` (DECIMAL(5,2)) - AI score (0-100 scale)
- `calculated_at` (TIMESTAMP WITH TIME ZONE) - Score calculation timestamp
- `factor_breakdown_json` (JSONB) - Detailed scoring factors in JSON format

**Indexes:** symbol, calculated_at, score_value, compound index on (symbol, calculated_at DESC)
**Constraints:** score_value CHECK (0 <= score_value <= 100)

### 4. `watchlists`
User-created lists for organizing securities of interest.

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique watchlist identifier
- `user_id` (INTEGER NOT NULL) - References users.id
- `name` (VARCHAR(255) NOT NULL) - User-defined watchlist name
- `created_at` (TIMESTAMP WITH TIME ZONE) - Watchlist creation timestamp

**Indexes:** user_id, created_at

### 5. `watchlist_items`
Junction table linking securities to watchlists (many-to-many relationship).

**Columns:**
- `id` (SERIAL PRIMARY KEY) - Unique item identifier
- `watchlist_id` (INTEGER NOT NULL) - References watchlists.id
- `symbol` (VARCHAR(10) NOT NULL) - References securities.symbol
- `added_at` (TIMESTAMP WITH TIME ZONE) - Item addition timestamp

**Indexes:** watchlist_id, symbol, added_at
**Constraints:** UNIQUE(watchlist_id, symbol) - prevents duplicate securities in same watchlist

## Design Decisions

### Primary Keys
- **Auto-incrementing integers** for users, scores, watchlists, and watchlist_items (standard practice for transactional tables)
- **Natural key (symbol)** for securities table since ticker symbols are industry-standard unique identifiers

### Foreign Key Relationships
- `scores.symbol` → `securities.symbol` (CASCADE DELETE)
- `watchlists.user_id` → `users.id` (CASCADE DELETE)
- `watchlist_items.watchlist_id` → `watchlists.id` (CASCADE DELETE)
- `watchlist_items.symbol` → `securities.symbol` (CASCADE DELETE)

### Data Types
- **JSONB** for factor_breakdown - allows flexible scoring criteria storage with PostgreSQL's advanced JSON querying
- **DECIMAL(5,2)** for scores - precise decimal handling for financial calculations
- **BIGINT** for market_cap - handles large market capitalization values
- **TIMESTAMP WITH TIME ZONE** - proper timezone handling for global users

### Performance Optimizations
- **Comprehensive indexing** on frequently queried columns
- **Compound indexes** for common query patterns (e.g., symbol + calculated_at)
- **Unique constraints** to prevent data inconsistencies
- **Foreign key indexes** for join performance

## Files

- `schema.sql` - Complete DDL statements for table creation and indexes
- `sample_data.sql` - Realistic test data including 10 major stocks and 2 users
- `connection.py` - SQLAlchemy connection setup and ORM models
- `README.md` - This documentation file

## Sample Data

The sample data includes:
- **2 test users** with bcrypt-hashed passwords
- **10 major securities** (AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, JPM, JNJ, V)
- **AI scores** for all securities with realistic factor breakdowns
- **4 sample watchlists** distributed between users
- **Multiple watchlist items** demonstrating the many-to-many relationship

## Usage

### Setup Database Schema
```sql
psql -d your_database -f schema.sql
```

### Load Sample Data
```sql
psql -d your_database -f sample_data.sql
```

### Python Connection
```python
from database.connection import test_connection, SessionLocal, User, Security

# Test connection
test_connection()

# Create session and query
db = SessionLocal()
users = db.query(User).all()
db.close()
```

## Future Enhancements

This MVP foundation can be extended with:
- User role management (admin, premium, basic)
- Portfolio tracking tables
- Transaction history
- Real-time price data integration
- Advanced scoring algorithm parameters
- Security categories and tags
- User preferences and settings
- Audit logging for compliance

## Security Considerations

- Passwords are bcrypt hashed (never store plain text)
- Email addresses are unique and indexed for fast authentication
- Foreign key constraints maintain data integrity
- Timestamps support audit trails and compliance requirements

---
**Note:** This schema is designed for MVP development. Production deployment should include additional security measures, backup strategies, and monitoring solutions.
