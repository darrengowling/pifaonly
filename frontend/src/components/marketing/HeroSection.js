import React, { useState } from 'react'
import WaitlistModal from './WaitlistModal'

const HeroSection = () => {
  const [showWaitlist, setShowWaitlist] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8">
            🚀 Now in Beta • Join 1000+ Early Users
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Football Auctions
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              for Friends
            </span>
            <span className="text-yellow-400"> (FAFF)</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Build your dream team through live auctions. Exclusive player ownership. 
            Real Champions League teams. Small friend groups. Pure competitive fun.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => setShowWaitlist(true)}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-200"
            >
              Join Waitlist
              <span className="ml-2">🏆</span>
            </button>
            
            <a
              href="/app"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Try App Demo
            </a>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-300">Max Players</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">64</div>
                  <div className="text-sm text-gray-300">Champions & Europa League Teams</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">£500M</div>
                  <div className="text-sm text-gray-300">Budget Per Player</div>
                </div>
              </div>
              
              {/* Mock Auction Interface Preview */}
              <div className="mt-8 bg-gray-800/50 rounded-xl p-4 text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Live Auction</span>
                  <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-white">LIVE</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                    MC
                  </div>
                  <div>
                    <div className="font-semibold text-white">Manchester City</div>
                    <div className="text-sm text-gray-400">Current bid: £45M by Alex</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </section>
  )
}

export default HeroSection