import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'

const BlogIndex = () => {
  // Mock blog posts - in production, you'd fetch from CMS or database
  const posts = [
    {
      id: 1,
      title: 'Introducing Friends of PIFA: The Future of Fantasy Football',
      excerpt: 'Why we built a fantasy football platform specifically for friend groups, and how IPL-style auctions change everything.',
      date: '2024-03-15',
      readTime: '5 min read',
      category: 'Product',
      slug: 'introducing-friends-of-pifa',
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80'
    },
    {
      id: 2,
      title: 'The Psychology of Exclusive Team Ownership',
      excerpt: 'How exclusive ownership creates deeper engagement compared to traditional fantasy sports where everyone can pick the same players.',
      date: '2024-03-10',
      readTime: '4 min read',
      category: 'Research',
      slug: 'psychology-exclusive-ownership',
      image: 'https://images.unsplash.com/photo-1599158150601-1417ebbaafdd?w=800&q=80'
    },
    {
      id: 3,
      title: 'Building Real-Time Auctions: Technical Deep Dive',
      excerpt: 'The technical challenges of building live auction experiences and how we solved them with WebSockets and smart state management.',
      date: '2024-03-05',
      readTime: '8 min read',
      category: 'Engineering',
      slug: 'building-realtime-auctions',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80'
    }
  ]

  return (
    <Layout
      title="Blog - Friends of PIFA"
      description="Insights, updates, and stories from the Friends of PIFA team about fantasy football, auctions, and building products for friend groups."
    >
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-purple-700 text-white py-16">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Friends of PIFA Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90"
            >
              Insights, updates, and stories from our team
            </motion.p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto container-padding py-16">
          <div className="space-y-12">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {post.date}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 p-8 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the latest updates about Friends of PIFA delivered to your inbox
            </p>
            <Link
              href="/#waitlist"
              className="btn-primary"
            >
              Join Our Waitlist
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex