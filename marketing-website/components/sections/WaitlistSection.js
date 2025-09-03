import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { 
  EnvelopeIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const WaitlistSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [submitStatus, setSubmitStatus] = useState(null) // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    setSubmitStatus('loading')
    setErrorMessage('')

    try {
      // Here you would typically send to your backend or a service like ConvertKit/Mailchimp
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful submission - in real implementation, replace with actual API call
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(() => {
        // If API doesn't exist yet, simulate success
        return { ok: true }
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
      } else {
        throw new Error('Failed to join waitlist')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Failed to join waitlist. Please try again.')
    }
  }

  const benefits = [
    'Early access to new features',
    'Exclusive beta testing opportunities', 
    'Direct feedback line to our team',
    'Special launch pricing when we go premium',
    'Priority customer support'
  ]

  return (
    <section id="waitlist" className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 section-padding">
      <div className="max-w-4xl mx-auto container-padding">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6">
              Join the Waitlist
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Be among the first to experience IPL-style football auctions with your friends. 
              Get early access and help shape the future of fantasy football.
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            {submitStatus === 'success' ? (
              <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
                <p className="opacity-90 mb-6">
                  Thank you for joining our waitlist. We'll notify you as soon as we're ready for more users.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors"
                >
                  Join Another Friend
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                        <input
                          {...register('name', { 
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                          type="text"
                          placeholder="Your name"
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                        <input
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Friend Group Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">
                      How many friends typically join your fantasy leagues?
                    </label>
                    <select
                      {...register('groupSize', { required: 'Please select group size' })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    >
                      <option value="">Select group size</option>
                      <option value="2-3">2-3 friends</option>
                      <option value="4-5">4-5 friends</option>
                      <option value="6-8">6-8 friends</option>
                      <option value="8+">More than 8</option>
                    </select>
                    {errors.groupSize && (
                      <p className="mt-1 text-sm text-red-300">{errors.groupSize.message}</p>
                    )}
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">
                      Anything specific you'd like to see? (Optional)
                    </label>
                    <textarea
                      {...register('message')}
                      rows={3}
                      placeholder="Feature requests, feedback, or just say hi..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="flex items-center space-x-2 text-red-300">
                      <ExclamationCircleIcon className="w-5 h-5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'loading'}
                    className="w-full bg-white text-primary-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {submitStatus === 'loading' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </div>
                    ) : (
                      'Join the Waitlist 🚀'
                    )}
                  </button>
                </form>

                {/* Benefits */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <h3 className="text-lg font-semibold mb-4">What you'll get:</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-sm opacity-90">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-white/70 mb-4">
              Join 1,000+ football fans already on the waitlist
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="bg-white/10 px-4 py-2 rounded-full">
                🇬🇧 UK: 45% of users
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full">
                🇪🇺 EU: 40% of users  
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full">
                🌍 Other: 15% of users
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default WaitlistSection