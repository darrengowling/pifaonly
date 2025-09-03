import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const InvestorSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const metrics = [
    {
      id: 1,
      label: 'Monthly Active Users',
      value: '1,000+',
      growth: '+45% MoM',
      icon: UserGroupIcon,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 2,
      label: 'User Retention (D7)',
      value: '78%',
      growth: 'Industry: 23%',
      icon: TrendingUpIcon,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 3,
      label: 'Avg Session Time',
      value: '32min',
      growth: '3x industry avg',
      icon: ChartBarIcon,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 4,
      label: 'Countries Active',
      value: '12',
      growth: 'EU + UK focused',
      icon: GlobeAltIcon,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  const traction = [
    {
      title: 'Strong Product-Market Fit',
      description: '4.9/5 average rating with 95% of users recommending to friends',
      metric: '4.9★',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Viral Growth Loop',
      description: 'Friend-based leagues create natural viral mechanics and organic growth',
      metric: '2.3x',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Engagement Excellence',
      description: '78% weekly retention - 3x higher than traditional fantasy sports',
      metric: '78%',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Revenue Ready',
      description: 'Multiple monetization paths validated through user research',
      metric: '5+',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section id="investors" className="bg-white dark:bg-gray-900 section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 mb-6">
            📈 For Investors & Press
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Strong Traction in Underserved Market
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Friends of PIFA is capturing the $7B fantasy sports market with a unique social-first approach 
            focused on premium football experiences for small friend groups.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card p-6 text-center"
            >
              <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-4`} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {metric.label}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                {metric.growth}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Traction Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {traction.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="card p-8"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{item.metric}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Market Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Addressing Clear Market Gap
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Problem: Fantasy Sports Are Broken for Friends
                  </h4>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Traditional fantasy has become impersonal and complex</li>
                    <li>• Shared player pools create conflict and confusion</li>
                    <li>• Most platforms optimize for large leagues, not friend groups</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Solution: Social-First, Exclusive Ownership
                  </h4>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• IPL-style auctions create memorable social experiences</li>
                    <li>• Exclusive team ownership eliminates conflicts</li>
                    <li>• Designed specifically for 2-8 person friend groups</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    $7B
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mb-1">
                    Fantasy Sports Market Size
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Growing 13% annually
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    40M+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mb-1">
                    Football Fans in EU/UK
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Our primary target market
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    <1%
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mb-1">
                    Market Share Needed
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    For significant scale
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Interested in Learning More?
            </h3>
            <p className="text-xl opacity-90 mb-6">
              Get our investor deck, user metrics, and roadmap
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:investors@friendsofpifa.com"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Request Investor Deck
              </a>
              <a 
                href="mailto:press@friendsofpifa.com"
                className="bg-white/10 text-white hover:bg-white/20 px-8 py-3 rounded-lg font-semibold transition-colors border border-white/20"
              >
                Press Inquiries
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default InvestorSection