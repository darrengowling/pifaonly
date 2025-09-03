import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { StarIcon } from '@heroicons/react/24/solid'

const TestimonialsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      id: 1,
      content: "This is exactly what we wanted - IPL auction excitement but for football with our friends. The live bidding is addictive and the trash talk in chat makes it even better!",
      author: "Alex Chen",
      role: "League Creator",
      location: "London, UK",
      avatar: "AC",
      rating: 5,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      content: "Finally, a fantasy app that doesn't feel like homework. The auction format is brilliant - no more boring drafts where everyone picks the same players.",
      author: "Sarah Martinez",
      role: "Beta User",
      location: "Madrid, Spain", 
      avatar: "SM",
      rating: 5,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      content: "The exclusive team ownership is genius. When I bid £60M for Real Madrid, they're MINE. No sharing, no confusion. It makes every match matter so much more.",
      author: "Michael Thompson",
      role: "Friend Group Admin",
      location: "Manchester, UK",
      avatar: "MT",
      rating: 5,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      content: "Set up a league with my university mates in under a minute. The join code system is so simple - shared it in our WhatsApp and everyone was in immediately.",
      author: "Emma Rodriguez",
      role: "University Student",
      location: "Barcelona, Spain",
      avatar: "ER",
      rating: 5,
      gradient: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      content: "We've been looking for something like this for years. Traditional fantasy football is boring - this brings back the excitement of watching every single match.",
      author: "James Wilson",
      role: "Football Enthusiast",
      location: "Liverpool, UK",
      avatar: "JW",
      rating: 5,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: 6,
      content: "The mobile experience is perfect. I can bid during my commute and never miss the action. The notifications keep me engaged throughout the auction.",
      author: "Sofia Andersson",
      role: "Working Professional",
      location: "Stockholm, Sweden",
      avatar: "SA",
      rating: 5,
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  return (
    <section className="bg-gray-50 dark:bg-gray-800 section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Loved by Football Fans Everywhere
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See what our beta users are saying about their Friends of PIFA experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  4.9/5
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Average user rating
                </div>
                <div className="flex justify-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  95%
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Would recommend to friends
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Based on 1,000+ beta users
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  32min
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Average session time
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Highly engaging experience
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection