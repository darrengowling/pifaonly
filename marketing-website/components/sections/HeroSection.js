import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon } from '@heroicons/react/24/solid'
import WaitlistModal from '../WaitlistModal'

const HeroSection = () => {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-gray-950 dark:via-blue-950 dark:to-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute inset-0 bg-[url('/images/stadium-pattern.svg')] opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto container-padding section-padding">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8"
          >
            🚀 Now in Beta • Join 1000+ Early Users
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6"
          >
            IPL-Style Football
            <br />
            <span className="text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Auctions for Friends
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Build your dream team through live auctions. Exclusive player ownership. 
            Real Champions League teams. Small friend groups. Pure competitive fun.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button
              onClick={() => setShowWaitlist(true)}
              className="btn-accent text-lg px-8 py-4 shadow-2xl hover:shadow-accent-500/25 transform hover:scale-105 transition-all duration-200"
            >
              Join Waitlist
              <span className="ml-2">🏆</span>
            </button>
            
            <button
              onClick={() => setShowDemo(true)}
              className="btn-secondary text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Demo Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're preparing an interactive demo. Join the waitlist to be notified when it's ready!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDemo(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDemo(false)
                  setShowWaitlist(true)
                }}
                className="btn-primary flex-1"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroSection