
import Link from 'next/link'
import { Users, TrendingUp, Target, BookOpen, Database } from 'lucide-react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function HomePage() {
  // Fetch basic statistics from the database
  const [userCount, securityCount, scoreCount, watchlistCount] = await Promise.all([
    prisma.user.count(),
    prisma.security.count(),
    prisma.score.count(),
    prisma.watchlist.count(),
  ])

  // Fetch latest scores for display
  const latestScores = await prisma.score.findMany({
    take: 5,
    orderBy: { calculatedAt: 'desc' },
    include: {
      security: true
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                AiiA <span className="text-blue-600">Database Foundation</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">PostgreSQL Connected</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Artificially Intelligent Investment Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete database foundation for the AiiA fintech platform MVP with PostgreSQL schema, 
            sample data, and robust architecture designed for scalable investment intelligence.
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Database Foundation Ready</span>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{userCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Securities</p>
                <p className="text-3xl font-bold text-gray-900">{securityCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">AI Scores</p>
                <p className="text-3xl font-bold text-gray-900">{scoreCount}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Watchlists</p>
                <p className="text-3xl font-bold text-gray-900">{watchlistCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Latest AI Scores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-12">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Latest AI Investment Scores
            </h3>
            <p className="text-gray-600 mt-1">AI-generated investment analysis and scoring</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {latestScores?.map((score) => (
                <div key={score?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="font-bold text-gray-900 text-lg min-w-[60px]">
                      {score?.symbol}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{score?.security?.companyName}</p>
                      <p className="text-sm text-gray-600">{score?.security?.sector}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      Number(score?.scoreValue) >= 85 ? 'text-green-600' :
                      Number(score?.scoreValue) >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score?.scoreValue?.toString()}
                    </div>
                    <p className="text-xs text-gray-500">AI Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Database Schema Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-600" />
              Database Schema Overview
            </h3>
            <p className="text-gray-600 mt-1">5 core tables with proper relationships and indexes</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">users</h4>
                <p className="text-sm text-gray-600 mb-3">User authentication and profile data</p>
                <div className="text-xs text-gray-500">
                  <p>• id, email, password_hash</p>
                  <p>• first_name, last_name</p>
                  <p>• created_at (timestamp)</p>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">securities</h4>
                <p className="text-sm text-gray-600 mb-3">Stock and ETF information</p>
                <div className="text-xs text-gray-500">
                  <p>• symbol (primary key)</p>
                  <p>• company_name, sector</p>
                  <p>• market_cap, is_active</p>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">scores</h4>
                <p className="text-sm text-gray-600 mb-3">AI-generated investment scores</p>
                <div className="text-xs text-gray-500">
                  <p>• score_value (0-100 scale)</p>
                  <p>• factor_breakdown_json</p>
                  <p>• calculated_at</p>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">watchlists</h4>
                <p className="text-sm text-gray-600 mb-3">User-created investment lists</p>
                <div className="text-xs text-gray-500">
                  <p>• user_id (foreign key)</p>
                  <p>• name, created_at</p>
                  <p>• One-to-many with users</p>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">watchlist_items</h4>
                <p className="text-sm text-gray-600 mb-3">Securities in watchlists</p>
                <div className="text-xs text-gray-500">
                  <p>• watchlist_id, symbol</p>
                  <p>• Many-to-many junction</p>
                  <p>• Unique constraints</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Complete database foundation with SQL schema, sample data, documentation, and connection setup
          </p>
          <p className="text-sm text-gray-500">
            Check the <code className="bg-gray-100 px-2 py-1 rounded">/database</code> directory for all files including comprehensive README
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>AiiA Database Foundation MVP • PostgreSQL + Prisma + NextJS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
