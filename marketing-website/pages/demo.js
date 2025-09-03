import React from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

const DemoPage = () => {
  return (
    <Layout
      title="Demo - Friends of PIFA"
      description="See Friends of PIFA in action. Watch how IPL-style football auctions work with real friend groups."
    >
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-purple-700 text-white py-20">
          <div className="max-w-6xl mx-auto container-padding text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-6"
            >
              See Friends of PIFA in Action
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto mb-8"
            >
              Watch how IPL-style football auctions create unforgettable moments for friend groups
            </motion.p>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-6xl mx-auto container-padding py-16">
          {/* Interactive Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl p-12 mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <PlayIcon className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Interactive Demo Coming Soon
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                We're building an interactive demo where you can experience a live auction simulation. 
                In the meantime, explore what makes Friends of PIFA special.
              </p>
              <Link
                href="/#waitlist"
                className="btn-primary text-lg px-8 py-4"
              >
                Join Waitlist for Early Access
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* Feature Showcase */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card p-8">
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
                        <button className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full">+£5M</button>
                        <button className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full">+£10M</button>
                        <button className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full">+£20M</button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Real-time bidding with instant updates, quick bid buttons, and live chat for maximum excitement.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card p-8">
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
                          <span className="text-primary-600 dark:text-primary-400 font-medium">Join Code: FRD24X</span>
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
            </motion.div>
          </div>

          {/* User Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl p-8 lg:p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Real Stories from Beta Users
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">AC</span>
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                  "The auction was electric! We spent 2 hours bidding and trash talking. Best fantasy experience we've ever had."
                </blockquote>
                <cite className="font-semibold text-gray-900 dark:text-white">Alex Chen, London</cite>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                  "Exclusive ownership changes everything. When Real Madrid scores, only I celebrate. It's personal now."
                </blockquote>
                <cite className="font-semibold text-gray-900 dark:text-white">Sarah Martinez, Madrid</cite>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">MT</span>
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                  "Setup took 30 seconds. Everyone joined instantly with the code. We were bidding within minutes."
                </blockquote>
                <cite className="font-semibold text-gray-900 dark:text-white">Michael Thompson, Manchester</cite>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Experience It Yourself?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our waitlist and be among the first to create unforgettable auction moments with your friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#waitlist"
                className="btn-accent text-lg px-8 py-4"
              >
                Join Waitlist
                <span className="ml-2">🏆</span>
              </Link>
              <Link
                href="/#how-it-works"
                className="btn-secondary text-lg px-8 py-4"
              >
                Learn How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default DemoPage