
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in reverse order due to foreign key constraints)
  await prisma.watchlistItem.deleteMany()
  await prisma.score.deleteMany()
  await prisma.watchlist.deleteMany()
  await prisma.security.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👤 Creating users...')
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john.doe@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBzIdnSvM2k/2C', // password: password123
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        email: 'jane.smith@example.com',
        passwordHash: '$2b$12$6NLCqhIj9C9QGLDLwI.Y8eT7a7LuOQ6fG1Z7bHlLGMFcR3T6f7i8u', // password: password123
        firstName: 'Jane',
        lastName: 'Smith'
      }
    ]
  })
  console.log(`✅ Created ${users.count} users`)

  // Create securities
  console.log('📈 Creating securities...')
  const securities = await prisma.security.createMany({
    data: [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        sector: 'Technology',
        marketCap: BigInt('3000000000000'),
        isActive: true
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        sector: 'Technology',
        marketCap: BigInt('2800000000000'),
        isActive: true
      },
      {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        sector: 'Technology',
        marketCap: BigInt('1700000000000'),
        isActive: true
      },
      {
        symbol: 'AMZN',
        companyName: 'Amazon.com Inc.',
        sector: 'Consumer Discretionary',
        marketCap: BigInt('1500000000000'),
        isActive: true
      },
      {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        sector: 'Consumer Discretionary',
        marketCap: BigInt('800000000000'),
        isActive: true
      },
      {
        symbol: 'META',
        companyName: 'Meta Platforms Inc.',
        sector: 'Technology',
        marketCap: BigInt('750000000000'),
        isActive: true
      },
      {
        symbol: 'NVDA',
        companyName: 'NVIDIA Corporation',
        sector: 'Technology',
        marketCap: BigInt('1800000000000'),
        isActive: true
      },
      {
        symbol: 'JPM',
        companyName: 'JPMorgan Chase & Co.',
        sector: 'Financials',
        marketCap: BigInt('450000000000'),
        isActive: true
      },
      {
        symbol: 'JNJ',
        companyName: 'Johnson & Johnson',
        sector: 'Healthcare',
        marketCap: BigInt('420000000000'),
        isActive: true
      },
      {
        symbol: 'V',
        companyName: 'Visa Inc.',
        sector: 'Financials',
        marketCap: BigInt('500000000000'),
        isActive: true
      }
    ]
  })
  console.log(`✅ Created ${securities.count} securities`)

  // Create scores for securities
  console.log('🎯 Creating AI scores...')
  const scores = await prisma.score.createMany({
    data: [
      {
        symbol: 'AAPL',
        scoreValue: 85.5,
        factorBreakdownJson: { growth: 90, value: 75, momentum: 88, quality: 92, volatility: 70 }
      },
      {
        symbol: 'MSFT',
        scoreValue: 88.2,
        factorBreakdownJson: { growth: 85, value: 80, momentum: 90, quality: 95, volatility: 75 }
      },
      {
        symbol: 'GOOGL',
        scoreValue: 82.1,
        factorBreakdownJson: { growth: 88, value: 78, momentum: 85, quality: 87, volatility: 68 }
      },
      {
        symbol: 'AMZN',
        scoreValue: 79.8,
        factorBreakdownJson: { growth: 92, value: 65, momentum: 82, quality: 85, volatility: 75 }
      },
      {
        symbol: 'TSLA',
        scoreValue: 75.3,
        factorBreakdownJson: { growth: 95, value: 45, momentum: 88, quality: 70, volatility: 40 }
      },
      {
        symbol: 'META',
        scoreValue: 81.7,
        factorBreakdownJson: { growth: 85, value: 72, momentum: 86, quality: 80, volatility: 65 }
      },
      {
        symbol: 'NVDA',
        scoreValue: 91.2,
        factorBreakdownJson: { growth: 98, value: 70, momentum: 95, quality: 90, volatility: 60 }
      },
      {
        symbol: 'JPM',
        scoreValue: 83.4,
        factorBreakdownJson: { growth: 70, value: 90, momentum: 85, quality: 88, volatility: 80 }
      },
      {
        symbol: 'JNJ',
        scoreValue: 86.9,
        factorBreakdownJson: { growth: 65, value: 95, momentum: 80, quality: 95, volatility: 90 }
      },
      {
        symbol: 'V',
        scoreValue: 89.1,
        factorBreakdownJson: { growth: 80, value: 85, momentum: 92, quality: 95, volatility: 85 }
      }
    ]
  })
  console.log(`✅ Created ${scores.count} AI scores`)

  // Get user IDs for creating watchlists
  const johnUser = await prisma.user.findUnique({ where: { email: 'john.doe@example.com' } })
  const janeUser = await prisma.user.findUnique({ where: { email: 'jane.smith@example.com' } })

  if (!johnUser || !janeUser) {
    throw new Error('Users not found after creation')
  }

  // Create watchlists
  console.log('📋 Creating watchlists...')
  const watchlists = await prisma.watchlist.createMany({
    data: [
      { userId: johnUser.id, name: 'Tech Stocks' },
      { userId: johnUser.id, name: 'Dividend Aristocrats' },
      { userId: janeUser.id, name: 'Growth Portfolio' },
      { userId: janeUser.id, name: 'Safe Haven' }
    ]
  })
  console.log(`✅ Created ${watchlists.count} watchlists`)

  // Get watchlist IDs for creating watchlist items
  const johnTechWatchlist = await prisma.watchlist.findFirst({
    where: { userId: johnUser.id, name: 'Tech Stocks' }
  })
  const johnDividendWatchlist = await prisma.watchlist.findFirst({
    where: { userId: johnUser.id, name: 'Dividend Aristocrats' }
  })
  const janeGrowthWatchlist = await prisma.watchlist.findFirst({
    where: { userId: janeUser.id, name: 'Growth Portfolio' }
  })
  const janeSafeWatchlist = await prisma.watchlist.findFirst({
    where: { userId: janeUser.id, name: 'Safe Haven' }
  })

  // Create watchlist items
  console.log('🔗 Creating watchlist items...')
  const watchlistItems = await prisma.watchlistItem.createMany({
    data: [
      // John's Tech Stocks
      { watchlistId: johnTechWatchlist!.id, symbol: 'AAPL' },
      { watchlistId: johnTechWatchlist!.id, symbol: 'MSFT' },
      { watchlistId: johnTechWatchlist!.id, symbol: 'GOOGL' },
      { watchlistId: johnTechWatchlist!.id, symbol: 'META' },
      { watchlistId: johnTechWatchlist!.id, symbol: 'NVDA' },
      // John's Dividend Aristocrats
      { watchlistId: johnDividendWatchlist!.id, symbol: 'JNJ' },
      { watchlistId: johnDividendWatchlist!.id, symbol: 'JPM' },
      { watchlistId: johnDividendWatchlist!.id, symbol: 'V' },
      // Jane's Growth Portfolio
      { watchlistId: janeGrowthWatchlist!.id, symbol: 'TSLA' },
      { watchlistId: janeGrowthWatchlist!.id, symbol: 'NVDA' },
      { watchlistId: janeGrowthWatchlist!.id, symbol: 'AMZN' },
      { watchlistId: janeGrowthWatchlist!.id, symbol: 'GOOGL' },
      // Jane's Safe Haven
      { watchlistId: janeSafeWatchlist!.id, symbol: 'JNJ' },
      { watchlistId: janeSafeWatchlist!.id, symbol: 'JPM' },
      { watchlistId: janeSafeWatchlist!.id, symbol: 'V' }
    ]
  })
  console.log(`✅ Created ${watchlistItems.count} watchlist items`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
