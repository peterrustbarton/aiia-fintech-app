
-- Sample Data for AiiA MVP Database
-- INSERT statements with realistic test data

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBzIdnSvM2k/2C', 'John', 'Doe'),
('jane.smith@example.com', '$2b$12$6NLCqhIj9C9QGLDLwI.Y8eT7a7LuOQ6fG1Z7bHlLGMFcR3T6f7i8u', 'Jane', 'Smith');

-- Insert sample securities (10 major stocks)
INSERT INTO securities (symbol, company_name, sector, market_cap, is_active) VALUES
('AAPL', 'Apple Inc.', 'Technology', 3000000000000, TRUE),
('MSFT', 'Microsoft Corporation', 'Technology', 2800000000000, TRUE),
('GOOGL', 'Alphabet Inc.', 'Technology', 1700000000000, TRUE),
('AMZN', 'Amazon.com Inc.', 'Consumer Discretionary', 1500000000000, TRUE),
('TSLA', 'Tesla Inc.', 'Consumer Discretionary', 800000000000, TRUE),
('META', 'Meta Platforms Inc.', 'Technology', 750000000000, TRUE),
('NVDA', 'NVIDIA Corporation', 'Technology', 1800000000000, TRUE),
('JPM', 'JPMorgan Chase & Co.', 'Financials', 450000000000, TRUE),
('JNJ', 'Johnson & Johnson', 'Healthcare', 420000000000, TRUE),
('V', 'Visa Inc.', 'Financials', 500000000000, TRUE);

-- Insert sample scores for securities
INSERT INTO scores (symbol, score_value, factor_breakdown_json) VALUES
('AAPL', 85.5, '{"growth": 90, "value": 75, "momentum": 88, "quality": 92, "volatility": 70}'),
('MSFT', 88.2, '{"growth": 85, "value": 80, "momentum": 90, "quality": 95, "volatility": 75}'),
('GOOGL', 82.1, '{"growth": 88, "value": 78, "momentum": 85, "quality": 87, "volatility": 68}'),
('AMZN', 79.8, '{"growth": 92, "value": 65, "momentum": 82, "quality": 85, "volatility": 75}'),
('TSLA', 75.3, '{"growth": 95, "value": 45, "momentum": 88, "quality": 70, "volatility": 40}'),
('META', 81.7, '{"growth": 85, "value": 72, "momentum": 86, "quality": 80, "volatility": 65}'),
('NVDA', 91.2, '{"growth": 98, "value": 70, "momentum": 95, "quality": 90, "volatility": 60}'),
('JPM', 83.4, '{"growth": 70, "value": 90, "momentum": 85, "quality": 88, "volatility": 80}'),
('JNJ', 86.9, '{"growth": 65, "value": 95, "momentum": 80, "quality": 95, "volatility": 90}'),
('V', 89.1, '{"growth": 80, "value": 85, "momentum": 92, "quality": 95, "volatility": 85}');

-- Insert sample watchlists
INSERT INTO watchlists (user_id, name) VALUES
(1, 'Tech Stocks'),
(1, 'Dividend Aristocrats'),
(2, 'Growth Portfolio'),
(2, 'Safe Haven');

-- Insert sample watchlist items
INSERT INTO watchlist_items (watchlist_id, symbol) VALUES
-- John's Tech Stocks watchlist
(1, 'AAPL'),
(1, 'MSFT'),
(1, 'GOOGL'),
(1, 'META'),
(1, 'NVDA'),
-- John's Dividend Aristocrats watchlist
(2, 'JNJ'),
(2, 'JPM'),
(2, 'V'),
-- Jane's Growth Portfolio watchlist
(3, 'TSLA'),
(3, 'NVDA'),
(3, 'AMZN'),
(3, 'GOOGL'),
-- Jane's Safe Haven watchlist
(4, 'JNJ'),
(4, 'JPM'),
(4, 'V');
