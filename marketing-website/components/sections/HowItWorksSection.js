import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const HowItWorksSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      id: 1,
      name: 'Create Your League',
      description: 'Invite 2-8 friends to join your private football auction league. Set your budget and rules.',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Live Auction Draft',
      description: 'Bid on real Champions League and Europa League teams in real-time. Strategic bidding with £500M budget.',
      icon: CurrencyDollarIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      name: 'Build Your Squad',
      description: 'Secure exclusive ownership of 4-8 teams. No sharing - you own your teams completely during the season.',
      icon: TrophyIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      name: 'Compete & Win',
      description: 'Earn points based on real-world team performance. Goals, wins, and draws determine your league champion.',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-red-500'
    },
  ]

  return (
    <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800 section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From league creation to championship glory - here's how Friends of PIFA brings 
            IPL-style excitement to football with your friends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 transform -translate-y-1/2 z-0" />
              )}
              
              <div className="relative bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Draft Your Dream Team?
            </h3>
            <p className="text-xl opacity-90 mb-6">
              Join the waitlist and be notified when your league is ready to draft.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Early Access
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorksSection