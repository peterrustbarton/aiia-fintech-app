
// AiiA Database Seed Script
// Run with: yarn prisma db seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john.investor@email.com' },
    update: {},
    create: {
      email: 'john.investor@email.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Investor',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah.trader@email.com' },
    update: {},
    create: {
      email: 'sarah.trader@email.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Trader',
    },
  });

  console.log('👥 Created users:', { user1: user1.email, user2: user2.email });

  // Create 10 sample securities with realistic data
  const securities = [
    {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      sector: 'Technology',
      marketCap: BigInt('3000000000000'), // $3T
    },
    {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      sector: 'Technology',
      marketCap: BigInt('2800000000000'), // $2.8T
    },
    {
      symbol: 'GOOGL',
      companyName: 'Alphabet Inc.',
      sector: 'Technology',
      marketCap: BigInt('1700000000000'), // $1.7T
    },
    {
      symbol: 'AMZN',
      companyName: 'Amazon.com Inc.',
      sector: 'Consumer Discretionary',
      marketCap: BigInt('1500000000000'), // $1.5T
    },
    {
      symbol: 'TSLA',
      companyName: 'Tesla Inc.',
      sector: 'Consumer Discretionary',
      marketCap: BigInt('800000000000'), // $800B
    },
    {
      symbol: 'NVDA',
      companyName: 'NVIDIA Corporation',
      sector: 'Technology',
      marketCap: BigInt('1100000000000'), // $1.1T
    },
    {
      symbol: 'JPM',
      companyName: 'JPMorgan Chase & Co.',
      sector: 'Financials',
      marketCap: BigInt('450000000000'), // $450B
    },
    {
      symbol: 'JNJ',
      companyName: 'Johnson & Johnson',
      sector: 'Healthcare',
      marketCap: BigInt('420000000000'), // $420B
    },
    {
      symbol: 'V',
      companyName: 'Visa Inc.',
      sector: 'Financials',
      marketCap: BigInt('500000000000'), // $500B
    },
    {
      symbol: 'WMT',
      companyName: 'Walmart Inc.',
      sector: 'Consumer Staples',
      marketCap: BigInt('480000000000'), // $480B
    },
  ];

  for (const security of securities) {
    await prisma.security.upsert({
      where: { symbol: security.symbol },
      update: {},
      create: security,
    });
  }

  console.log('📊 Created securities:', securities.length);

  // Create AI-generated scores for each security
  const scoreFactors = {
    fundamental: Math.random() * 40 + 20, // 20-60
    technical: Math.random() * 30 + 15, // 15-45
    sentiment: Math.random() * 20 + 5, // 5-25
    momentum: Math.random() * 10 + 5, // 5-15
  };

  for (const security of securities) {
    const totalScore = Math.random() * 40 + 60; // 60-100 score range
    
    await prisma.score.upsert({
      where: { id: securities.indexOf(security) + 1 },
      update: {},
      create: {
        symbol: security.symbol,
        scoreValue: Math.round(totalScore * 100) / 100, // Round to 2 decimals
        factorBreakdownJson: {
          fundamental: Math.round(scoreFactors.fundamental * 100) / 100,
          technical: Math.round(scoreFactors.technical * 100) / 100,
          sentiment: Math.round(scoreFactors.sentiment * 100) / 100,
          momentum: Math.round(scoreFactors.momentum * 100) / 100,
          explanation: {
            strengths: ['Strong revenue growth', 'Solid balance sheet', 'Market leadership'],
            concerns: ['High valuation', 'Market volatility'],
            recommendation: totalScore > 80 ? 'Strong Buy' : totalScore > 70 ? 'Buy' : 'Hold'
          }
        },
      },
    });
  }

  console.log('🎯 Created AI scores for all securities');

  // Create sample watchlists
  const watchlist1 = await prisma.watchlist.create({
    data: {
      userId: user1.id,
      name: 'Tech Growth Portfolio',
    },
  });

  const watchlist2 = await prisma.watchlist.create({
    data: {
      userId: user2.id,
      name: 'Diversified Holdings',
    },
  });

  // Add items to watchlists
  await prisma.watchlistItem.createMany({
    data: [
      { watchlistId: watchlist1.id, symbol: 'AAPL' },
      { watchlistId: watchlist1.id, symbol: 'MSFT' },
      { watchlistId: watchlist1.id, symbol: 'GOOGL' },
      { watchlistId: watchlist1.id, symbol: 'NVDA' },
      { watchlistId: watchlist2.id, symbol: 'AAPL' },
      { watchlistId: watchlist2.id, symbol: 'JPM' },
      { watchlistId: watchlist2.id, symbol: 'JNJ' },
      { watchlistId: watchlist2.id, symbol: 'WMT' },
    ],
  });

  console.log('📋 Created watchlists and items');
  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
