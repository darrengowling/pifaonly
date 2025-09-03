import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    {
      id: 1,
      name: 'Beta Users',
      value: '1,000+',
      description: 'Early adopters testing the platform'
    },
    {
      id: 2,
      name: 'Leagues Created',
      value: '150+',
      description: 'Friend groups competing worldwide'
    },
    {
      id: 3,
      name: 'Teams Available',
      value: '64',
      description: 'Champions & Europa League clubs'
    },
    {
      id: 4,
      name: 'Avg. Session Time',
      value: '32min',
      description: 'Highly engaging auction experience'
    },
  ]

  return (
    <section className="bg-white dark:bg-gray-900 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Football Fans Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Early traction shows strong product-market fit with engaged user communities
          </p>
        </motion.div>

        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <dt className="text-base font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </dt>
              <dd className="mt-1 text-4xl font-bold text-primary-600 dark:text-primary-400">
                {stat.value}
              </dd>
              <dd className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default StatsSection