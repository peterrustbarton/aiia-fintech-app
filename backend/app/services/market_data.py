
"""
Market Data Service
Fetches live stock and crypto data from multiple providers with caching
"""

import asyncio
import aiohttp
import os
import time
from datetime import datetime
from typing import Dict, Optional, Any, Tuple
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class MarketQuote:
    """Market data quote structure"""
    symbol: str
    price: Optional[float] = None
    change_percent: Optional[float] = None
    sector: Optional[str] = None
    market_cap: Optional[float] = None
    timestamp: Optional[datetime] = None
    source: Optional[str] = None

@dataclass
class CacheEntry:
    """Cache entry with TTL"""
    data: MarketQuote
    timestamp: float
    ttl: int = 90  # 90 seconds default TTL

class MarketDataService:
    """Market data service with caching and multiple providers"""
    
    def __init__(self):
        self.cache: Dict[str, CacheEntry] = {}
        self.session: Optional[aiohttp.ClientSession] = None
        
        # API keys from environment
        self.finnhub_key = os.getenv('FINNHUB_API_KEY')
        self.alphavantage_key = os.getenv('ALPHAVANTAGE_API_KEY') 
        self.alpaca_key_id = os.getenv('ALPACA_API_KEY_ID')
        self.alpaca_secret = os.getenv('ALPACA_SECRET_KEY')
        
        # API endpoints
        self.finnhub_base = "https://finnhub.io/api/v1"
        self.alphavantage_base = "https://www.alphavantage.co/query"
        self.alpaca_base = "https://data.alpaca.markets/v2"
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create HTTP session"""
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=10)
            self.session = aiohttp.ClientSession(timeout=timeout)
        return self.session
    
    async def close(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()
            self.session = None
    
    def _is_cache_valid(self, symbol: str) -> bool:
        """Check if cached data is still valid"""
        if symbol not in self.cache:
            return False
        
        cache_entry = self.cache[symbol]
        age = time.time() - cache_entry.timestamp
        return age < cache_entry.ttl
    
    def _get_from_cache(self, symbol: str) -> Optional[MarketQuote]:
        """Get data from cache if valid"""
        if self._is_cache_valid(symbol):
            return self.cache[symbol].data
        return None
    
    def _set_cache(self, symbol: str, data: MarketQuote, ttl: int = 90):
        """Set cache entry with TTL"""
        self.cache[symbol] = CacheEntry(
            data=data,
            timestamp=time.time(),
            ttl=ttl
        )
    
    async def get_finnhub_quote(self, symbol: str) -> Optional[MarketQuote]:
        """
        Get quote from Finnhub API (primary for price + % change)
        """
        if not self.finnhub_key or self.finnhub_key == 'your_finnhub_api_key':
            logger.warning("Finnhub API key not configured")
            return None
            
        try:
            session = await self._get_session()
            url = f"{self.finnhub_base}/quote"
            params = {
                'symbol': symbol,
                'token': self.finnhub_key
            }
            
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Extract price and change data
                    current_price = data.get('c')  # Current price
                    prev_close = data.get('pc')    # Previous close
                    
                    change_percent = None
                    if current_price and prev_close and prev_close > 0:
                        change_percent = ((current_price - prev_close) / prev_close) * 100
                    
                    return MarketQuote(
                        symbol=symbol,
                        price=current_price,
                        change_percent=change_percent,
                        timestamp=datetime.now(),
                        source="Finnhub"
                    )
                else:
                    logger.error(f"Finnhub API error {response.status} for {symbol}")
                    
        except Exception as e:
            logger.error(f"Finnhub API error for {symbol}: {e}")
        
        return None
    
    async def get_alpha_vantage_quote(self, symbol: str) -> Optional[MarketQuote]:
        """
        Get quote from AlphaVantage API (primary for fundamentals)
        """
        if not self.alphavantage_key or self.alphavantage_key == 'your_alphavantage_api_key':
            logger.warning("AlphaVantage API key not configured")
            return None
            
        try:
            session = await self._get_session()
            
            # Get company overview for fundamentals
            url = self.alphavantage_base
            params = {
                'function': 'OVERVIEW',
                'symbol': symbol,
                'apikey': self.alphavantage_key
            }
            
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Check for API limit or error
                    if 'Error Message' in data or 'Note' in data:
                        logger.warning(f"AlphaVantage API limit/error for {symbol}: {data}")
                        return None
                    
                    # Extract fundamentals
                    sector = data.get('Sector')
                    market_cap = data.get('MarketCapitalization')
                    
                    # Convert market cap to number
                    market_cap_num = None
                    if market_cap and market_cap != 'None':
                        try:
                            market_cap_num = float(market_cap)
                        except (ValueError, TypeError):
                            pass
                    
                    return MarketQuote(
                        symbol=symbol,
                        sector=sector,
                        market_cap=market_cap_num,
                        timestamp=datetime.now(),
                        source="AlphaVantage"
                    )
                else:
                    logger.error(f"AlphaVantage API error {response.status} for {symbol}")
                    
        except Exception as e:
            logger.error(f"AlphaVantage API error for {symbol}: {e}")
        
        return None
    
    async def get_alpaca_quote(self, symbol: str) -> Optional[MarketQuote]:
        """
        Get quote from Alpaca API (fallback for price/fundamentals)
        """
        if not self.alpaca_key_id or self.alpaca_key_id == 'your_alpaca_key_id':
            logger.warning("Alpaca API key not configured")
            return None
            
        try:
            session = await self._get_session()
            
            # Get latest bar (price data)
            url = f"{self.alpaca_base}/stocks/{symbol}/bars/latest"
            headers = {
                'APCA-API-KEY-ID': self.alpaca_key_id,
                'APCA-API-SECRET-KEY': self.alpaca_secret
            }
            
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    bar = data.get('bar', {})
                    
                    current_price = bar.get('c')  # Close price
                    prev_price = bar.get('o')     # Open price (approximation)
                    
                    change_percent = None
                    if current_price and prev_price and prev_price > 0:
                        change_percent = ((current_price - prev_price) / prev_price) * 100
                    
                    return MarketQuote(
                        symbol=symbol,
                        price=current_price,
                        change_percent=change_percent,
                        timestamp=datetime.now(),
                        source="Alpaca"
                    )
                else:
                    logger.error(f"Alpaca API error {response.status} for {symbol}")
                    
        except Exception as e:
            logger.error(f"Alpaca API error for {symbol}: {e}")
        
        return None
    
    async def get_enriched_quote(self, symbol: str) -> MarketQuote:
        """
        Get enriched market data with fallbacks and caching
        Priority: Finnhub (price) + AlphaVantage (fundamentals) + Alpaca (fallback)
        """
        # Check cache first
        cached = self._get_from_cache(symbol)
        if cached:
            logger.debug(f"Using cached data for {symbol}")
            return cached
        
        # Initialize result quote
        quote = MarketQuote(symbol=symbol, timestamp=datetime.now())
        
        # Fetch from multiple sources concurrently
        tasks = []
        if self.finnhub_key and self.finnhub_key != 'your_finnhub_api_key':
            tasks.append(self.get_finnhub_quote(symbol))
        if self.alphavantage_key and self.alphavantage_key != 'your_alphavantage_api_key':
            tasks.append(self.get_alpha_vantage_quote(symbol))
        if self.alpaca_key_id and self.alpaca_key_id != 'your_alpaca_key_id':
            tasks.append(self.get_alpaca_quote(symbol))
        
        if tasks:
            try:
                # Wait for all API calls with timeout
                results = await asyncio.wait_for(
                    asyncio.gather(*tasks, return_exceptions=True),
                    timeout=15.0
                )
                
                # Merge results with priority
                for result in results:
                    if isinstance(result, MarketQuote):
                        # Price data priority: Finnhub > Alpaca
                        if result.price is not None and quote.price is None:
                            quote.price = result.price
                            quote.source = result.source
                        
                        # Change percent priority: Finnhub > Alpaca  
                        if result.change_percent is not None and quote.change_percent is None:
                            quote.change_percent = result.change_percent
                        
                        # Fundamentals priority: AlphaVantage > Alpaca
                        if result.sector and not quote.sector:
                            quote.sector = result.sector
                        
                        if result.market_cap is not None and quote.market_cap is None:
                            quote.market_cap = result.market_cap
                
            except asyncio.TimeoutError:
                logger.warning(f"Timeout fetching market data for {symbol}")
            except Exception as e:
                logger.error(f"Error fetching market data for {symbol}: {e}")
        
        # Cache the result (even if partial)
        self._set_cache(symbol, quote)
        
        return quote
    
    async def get_multiple_quotes(self, symbols: list) -> Dict[str, MarketQuote]:
        """Get quotes for multiple symbols concurrently"""
        if not symbols:
            return {}
        
        # Limit concurrent requests to avoid overwhelming APIs
        semaphore = asyncio.Semaphore(5)  # Max 5 concurrent requests
        
        async def get_quote_with_semaphore(symbol):
            async with semaphore:
                return symbol, await self.get_enriched_quote(symbol)
        
        tasks = [get_quote_with_semaphore(symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        quotes = {}
        for result in results:
            if isinstance(result, tuple) and len(result) == 2:
                symbol, quote = result
                quotes[symbol] = quote
            elif isinstance(result, Exception):
                logger.error(f"Error getting quote: {result}")
        
        return quotes

# Global service instance
market_data_service = MarketDataService()

async def get_market_data_service() -> MarketDataService:
    """Get market data service instance"""
    return market_data_service

async def cleanup_market_data_service():
    """Cleanup service on shutdown"""
    await market_data_service.close()
