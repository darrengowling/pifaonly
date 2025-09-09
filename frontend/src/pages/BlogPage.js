import React from 'react'
import MarketingNavbar from '../components/marketing/MarketingNavbar'

const BlogPage = () => {
  // Mock blog posts
  const posts = [
    {
      id: 1,
      title: 'Introducing Friends of PIFA: The Future of Fantasy Football',
      excerpt: 'Why we built a fantasy football platform specifically for friend groups, and how IPL-style auctions change everything.',
      date: '2024-03-15',
      readTime: '5 min read',
      category: 'Product',
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80'
    },
    {
      id: 2,
      title: 'The Psychology of Exclusive Team Ownership',
      excerpt: 'How exclusive ownership creates deeper engagement compared to traditional fantasy sports where everyone can pick the same players.',
      date: '2024-03-10',
      readTime: '4 min read',
      category: 'Research',
      image: 'https://images.unsplash.com/photo-1599158150601-1417ebbaafdd?w=800&q=80'
    },
    {
      id: 3,
      title: 'Building Real-Time Auctions: Technical Deep Dive',
      excerpt: 'The technical challenges of building live auction experiences and how we solved them with WebSockets and smart state management.',
      date: '2024-03-05',
      readTime: '8 min read',
      category: 'Engineering',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MarketingNavbar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Friends of PIFA Blog
          </h1>
          <p className="text-xl opacity-90">
            Insights, updates, and stories from our team
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-0 overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
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
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
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
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Read more →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Create Your Own Auction?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Experience the excitement of FAFF - Football Auctions for Friends
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/app"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Launch App
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage