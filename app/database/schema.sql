
-- AiiA - Artificially Intelligent Investment Assistant
-- PostgreSQL Database Schema
-- Generated from Prisma schema

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Securities table (symbol as primary key for stock symbols)
CREATE TABLE IF NOT EXISTS securities (
    symbol VARCHAR(10) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    market_cap BIGINT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Scores table for AI-generated security scores
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    score_value DECIMAL(5,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    factor_breakdown_json JSONB,
    FOREIGN KEY (symbol) REFERENCES securities(symbol) ON DELETE CASCADE
);

-- Create Watchlists table for user portfolios
CREATE TABLE IF NOT EXISTS watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Watchlist Items junction table
CREATE TABLE IF NOT EXISTS watchlist_items (
    id SERIAL PRIMARY KEY,
    watchlist_id INTEGER NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE,
    FOREIGN KEY (symbol) REFERENCES securities(symbol) ON DELETE CASCADE,
    UNIQUE(watchlist_id, symbol)
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_securities_sector ON securities(sector);
CREATE INDEX IF NOT EXISTS idx_securities_market_cap ON securities(market_cap);
CREATE INDEX IF NOT EXISTS idx_securities_is_active ON securities(is_active);
CREATE INDEX IF NOT EXISTS idx_scores_symbol ON scores(symbol);
CREATE INDEX IF NOT EXISTS idx_scores_calculated_at ON scores(calculated_at);
CREATE INDEX IF NOT EXISTS idx_scores_value ON scores(score_value);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_watchlist_id ON watchlist_items(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_symbol ON watchlist_items(symbol);
CREATE INDEX IF NOT EXISTS idx_watchlist_items_added_at ON watchlist_items(added_at);
