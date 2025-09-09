import React from 'react'
import MarketingNavbar from '../components/marketing/MarketingNavbar'

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MarketingNavbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            See FAFF in Action
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Watch how Football Auctions for Friends (FAFF) create unforgettable moments for friend groups
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl p-12 mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Try the Live App Now
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Instead of a static demo, experience the real thing! Create a tournament, invite friends, and start bidding on Champions League teams.
            </p>
            <a
              href="/app"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Launch Live App
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Live Auction Experience
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Live Auction</span>
                <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-white font-medium">LIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">MC</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Manchester City</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Premier League Champions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">£45M</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Current bid</div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Bidding by Alex</div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">+£5M</button>
                    <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">+£10M</button>
                    <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">+£20M</button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time bidding with instant updates, quick bid buttons, and live chat for maximum excitement.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Friend Group Dashboard
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 mb-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Friends Championship 2024</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Live</span>
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">5/8 players joined</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Join Code: FRD24X</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">£500M</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Budget per player</div>
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">32</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Teams available</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Simple league creation with join codes, budget tracking, and real-time participant management.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Experience It Yourself?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of football fans already creating unforgettable auction moments with their friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/app"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all"
            >
              Start Playing Now
              <span className="ml-2">🏆</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoPage