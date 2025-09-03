import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  XMarkIcon,
  EnvelopeIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const WaitlistModal = ({ onClose }) => {
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
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        throw new Error('Failed to join waitlist')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Failed to join waitlist. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Join the Waitlist
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitStatus === 'success' ? (
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                You're on the list!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Thank you for joining our waitlist. We'll notify you as soon as we're ready for more users.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This modal will close automatically...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Get early access to Friends of PIFA and be among the first to experience 
                  IPL-style football auctions with your friends.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Friend Group Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Typical friend group size for fantasy leagues?
                  </label>
                  <select
                    {...register('groupSize', { required: 'Please select group size' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select group size</option>
                    <option value="2-3">2-3 friends</option>
                    <option value="4-5">4-5 friends</option>
                    <option value="6-8">6-8 friends</option>
                    <option value="8+">More than 8</option>
                  </select>
                  {errors.groupSize && (
                    <p className="mt-1 text-sm text-red-500">{errors.groupSize.message}</p>
                  )}
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-500">
                    <ExclamationCircleIcon className="w-5 h-5" />
                    <span className="text-sm">{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'loading'}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'loading' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Joining...</span>
                    </div>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What you'll get:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Early access to new features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Beta testing opportunities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Special launch pricing</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default WaitlistModal