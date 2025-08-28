
-- Sample INSERT statements for AiiA Database
-- This file contains the same data as the seed script but in raw SQL format

-- Insert sample users (passwords are hashed 'password123')
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('john.investor@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYw4ZKaOipmjy3e', 'John', 'Investor'),
('sarah.trader@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYw4ZKaOipmjy3e', 'Sarah', 'Trader')
ON CONFLICT (email) DO NOTHING;

-- Insert sample securities
INSERT INTO securities (symbol, company_name, sector, market_cap, is_active) VALUES
('AAPL', 'Apple Inc.', 'Technology', 3000000000000, TRUE),
('MSFT', 'Microsoft Corporation', 'Technology', 2800000000000, TRUE),
('GOOGL', 'Alphabet Inc.', 'Technology', 1700000000000, TRUE),
('AMZN', 'Amazon.com Inc.', 'Consumer Discretionary', 1500000000000, TRUE),
('TSLA', 'Tesla Inc.', 'Consumer Discretionary', 800000000000, TRUE),
('NVDA', 'NVIDIA Corporation', 'Technology', 1100000000000, TRUE),
('JPM', 'JPMorgan Chase & Co.', 'Financials', 450000000000, TRUE),
('JNJ', 'Johnson & Johnson', 'Healthcare', 420000000000, TRUE),
('V', 'Visa Inc.', 'Financials', 500000000000, TRUE),
('WMT', 'Walmart Inc.', 'Consumer Staples', 480000000000, TRUE)
ON CONFLICT (symbol) DO NOTHING;

-- Insert AI-generated scores
INSERT INTO scores (symbol, score_value, factor_breakdown_json) VALUES
('AAPL', 85.50, '{"fundamental": 42.5, "technical": 25.0, "sentiment": 12.5, "momentum": 5.5, "explanation": {"strengths": ["Strong revenue growth", "Solid balance sheet", "Market leadership"], "concerns": ["High valuation", "Market volatility"], "recommendation": "Strong Buy"}}'),
('MSFT', 88.25, '{"fundamental": 45.0, "technical": 28.0, "sentiment": 10.0, "momentum": 5.25, "explanation": {"strengths": ["Cloud dominance", "Recurring revenue", "AI integration"], "concerns": ["Competition", "Valuation"], "recommendation": "Strong Buy"}}'),
('GOOGL', 82.75, '{"fundamental": 38.5, "technical": 30.0, "sentiment": 9.25, "momentum": 5.0, "explanation": {"strengths": ["Search monopoly", "AI capabilities", "Cash reserves"], "concerns": ["Regulatory risk", "Ad market"], "recommendation": "Strong Buy"}}'),
('AMZN', 79.50, '{"fundamental": 35.0, "technical": 32.0, "sentiment": 8.0, "momentum": 4.5, "explanation": {"strengths": ["E-commerce leader", "AWS growth", "Innovation"], "concerns": ["Competition", "Margins"], "recommendation": "Buy"}}'),
('TSLA', 75.25, '{"fundamental": 30.0, "technical": 35.0, "sentiment": 7.25, "momentum": 3.0, "explanation": {"strengths": ["EV market leader", "Technology", "Brand"], "concerns": ["Volatility", "Competition"], "recommendation": "Buy"}}'),
('NVDA', 91.00, '{"fundamental": 48.0, "technical": 30.0, "sentiment": 8.0, "momentum": 5.0, "explanation": {"strengths": ["AI chip leader", "Data center growth", "Gaming"], "concerns": ["Cyclical nature", "Geopolitics"], "recommendation": "Strong Buy"}}'),
('JPM', 72.50, '{"fundamental": 40.0, "technical": 20.0, "sentiment": 7.5, "momentum": 5.0, "explanation": {"strengths": ["Banking leader", "Interest rates", "Capital"], "concerns": ["Economic cycle", "Regulation"], "recommendation": "Buy"}}'),
('JNJ', 68.75, '{"fundamental": 38.0, "technical": 18.0, "sentiment": 8.75, "momentum": 4.0, "explanation": {"strengths": ["Dividend aristocrat", "Healthcare demand", "Pipeline"], "concerns": ["Patent cliffs", "Litigation"], "recommendation": "Hold"}}'),
('V', 83.25, '{"fundamental": 44.0, "technical": 26.0, "sentiment": 8.25, "momentum": 5.0, "explanation": {"strengths": ["Payment network", "Moat", "Growth"], "concerns": ["Digital currencies", "Regulation"], "recommendation": "Strong Buy"}}'),
('WMT', 70.00, '{"fundamental": 36.0, "technical": 22.0, "sentiment": 7.0, "momentum": 5.0, "explanation": {"strengths": ["Retail giant", "E-commerce growth", "Stability"], "concerns": ["Margins", "Competition"], "recommendation": "Hold"}}');

-- Insert sample watchlists (assuming user IDs 1 and 2)
INSERT INTO watchlists (user_id, name) VALUES
(1, 'Tech Growth Portfolio'),
(2, 'Diversified Holdings')
ON CONFLICT DO NOTHING;

-- Insert watchlist items (assuming watchlist IDs 1 and 2)
INSERT INTO watchlist_items (watchlist_id, symbol) VALUES
(1, 'AAPL'),
(1, 'MSFT'),
(1, 'GOOGL'),
(1, 'NVDA'),
(2, 'AAPL'),
(2, 'JPM'),
(2, 'JNJ'),
(2, 'WMT')
ON CONFLICT (watchlist_id, symbol) DO NOTHING;
