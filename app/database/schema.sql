
-- AiiA - Artificially Intelligent Investment Assistant
-- Database Schema for MVP
-- PostgreSQL Database Schema

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Users
-- Stores user account information for the AiiA platform
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Securities
-- Stores information about financial securities (stocks, ETFs, etc.)
CREATE TABLE securities (
    symbol VARCHAR(10) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    market_cap BIGINT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table 3: Scores
-- Stores AI-generated investment scores for securities
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    score_value DECIMAL(5,2) NOT NULL CHECK (score_value >= 0 AND score_value <= 100),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    factor_breakdown_json JSONB,
    FOREIGN KEY (symbol) REFERENCES securities(symbol) ON DELETE CASCADE
);

-- Table 4: Watchlists
-- Stores user-created watchlists
CREATE TABLE watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table 5: Watchlist Items
-- Links securities to watchlists (many-to-many relationship)
CREATE TABLE watchlist_items (
    id SERIAL PRIMARY KEY,
    watchlist_id INTEGER NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(id) ON DELETE CASCADE,
    FOREIGN KEY (symbol) REFERENCES securities(symbol) ON DELETE CASCADE,
    UNIQUE(watchlist_id, symbol) -- Prevent duplicate securities in same watchlist
);

-- Indexes for Performance Optimization

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Securities table indexes
CREATE INDEX idx_securities_sector ON securities(sector);
CREATE INDEX idx_securities_market_cap ON securities(market_cap);
CREATE INDEX idx_securities_is_active ON securities(is_active);
CREATE INDEX idx_securities_company_name ON securities(company_name);

-- Scores table indexes
CREATE INDEX idx_scores_symbol ON scores(symbol);
CREATE INDEX idx_scores_calculated_at ON scores(calculated_at);
CREATE INDEX idx_scores_score_value ON scores(score_value);
CREATE INDEX idx_scores_symbol_calculated_at ON scores(symbol, calculated_at DESC);

-- Watchlists table indexes
CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX idx_watchlists_created_at ON watchlists(created_at);

-- Watchlist Items table indexes
CREATE INDEX idx_watchlist_items_watchlist_id ON watchlist_items(watchlist_id);
CREATE INDEX idx_watchlist_items_symbol ON watchlist_items(symbol);
CREATE INDEX idx_watchlist_items_added_at ON watchlist_items(added_at);
