import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  SparklesIcon,
  BoltIcon,
  UserGroupIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      id: 1,
      name: 'Live Auction System',
      description: 'Real-time bidding with WebSocket technology. See every bid as it happens with instant updates.',
      icon: BoltIcon,
      gradient: 'from-blue-500 to-cyan-500',
      benefits: ['Real-time bidding', 'Instant notifications', 'Fair auction mechanics']
    },
    {
      id: 2,
      name: 'Exclusive Team Ownership',
      description: 'Own your teams completely. No sharing, no conflicts. Your Champions League team is yours alone.',
      icon: TrophyIcon,
      gradient: 'from-purple-500 to-pink-500',
      benefits: ['100% exclusive ownership', '64 premium teams', 'No sharing conflicts']
    },
    {
      id: 3,
      name: 'Small Friend Groups',
      description: 'Designed for 2-8 friends. Intimate leagues where everyone knows each other and competition is personal.',
      icon: UserGroupIcon,
      gradient: 'from-green-500 to-emerald-500',
      benefits: ['2-8 players optimal', 'Personal competition', 'Close friend dynamics']
    },
    {
      id: 4,
      name: 'Smart Budget Management',
      description: '£500M budget with intelligent tracking. Strategy matters - spend wisely to build your dream squad.',
      icon: CurrencyDollarIcon,
      gradient: 'from-orange-500 to-red-500',
      benefits: ['£500M starting budget', 'Smart spending alerts', 'Strategic depth']
    },
    {
      id: 5,
      name: 'Real-time Chat',
      description: 'Built-in chat for trash talk, strategy, and celebration. Keep the social connection alive.',
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-pink-500 to-rose-500',
      benefits: ['Live auction chat', 'Emoji reactions', 'Trash talk friendly']
    },
    {
      id: 6,
      name: 'Mobile Optimized',
      description: 'Fully responsive design. Bid on your phone, tablet, or desktop with the same smooth experience.',
      icon: DevicePhoneMobileIcon,
      gradient: 'from-indigo-500 to-purple-500',
      benefits: ['Mobile-first design', 'Cross-platform sync', 'Touch-optimized']
    },
    {
      id: 7,
      name: 'Performance Tracking',
      description: 'Real Champions League data integration. Track your teams performance and league standings.',
      icon: ChartBarIcon,
      gradient: 'from-yellow-500 to-orange-500',
      benefits: ['Real match data', 'Live scoring', 'Season-long tracking']
    },
    {
      id: 8,
      name: 'Instant Setup',
      description: 'Create a league in 30 seconds. Share a join code with friends and start drafting immediately.',
      icon: SparklesIcon,
      gradient: 'from-teal-500 to-green-500',
      benefits: ['30-second setup', 'Simple join codes', 'No complex registration']
    },
  ]

  return (
    <section id="features" className="bg-white dark:bg-gray-900 section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need for Epic Auctions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Built specifically for friend groups who want the thrill of IPL-style auctions 
            with the world's best football teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group card-hover p-6"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {feature.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Benefits */}
              <ul className="space-y-1">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Friends Choose PIFA Over Generic Fantasy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Exclusive Ownership</h4>
                      <p className="text-gray-600 dark:text-gray-300">Unlike traditional fantasy where everyone can pick the same players, you own your teams exclusively.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Live Social Experience</h4>
                      <p className="text-gray-600 dark:text-gray-300">Real-time auctions with friends create unforgettable moments and lasting memories.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Premium Teams Only</h4>
                      <p className="text-gray-600 dark:text-gray-300">Focus on Champions League and Europa League elite - the teams that matter most.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Live Auction</span>
                    <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-white font-medium">LIVE</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">MC</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">Manchester City</span>
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">£45M</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current bid by Alex</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">Budget remaining:</span>
                        <span className="font-medium text-gray-900 dark:text-white">£455M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection