import React from 'react'
import MarketingNavbar from '../components/marketing/MarketingNavbar'
import HeroSection from '../components/marketing/HeroSection'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MarketingNavbar />
      <HeroSection />
      
      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From league creation to championship glory - here's how Friends of PIFA brings 
              auction excitement to football with your friends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'Create Your League',
                description: 'Invite 2-8 friends to join your private football auction league. Set your budget and rules.',
                icon: '👥'
              },
              {
                step: 2,
                title: 'Live Auction Draft',
                description: 'Bid on real Champions League and Europa League teams in real-time. Strategic bidding with £500M budget.',
                icon: '💰'
              },
              {
                step: 3,
                title: 'Build Your Squad',
                description: 'Secure exclusive ownership of 4-8 teams. No sharing - you own your teams completely during the season.',
                icon: '🏆'
              },
              {
                step: 4,
                title: 'Compete & Win',
                description: 'Earn points based on real-world team performance. Goals, wins, and draws determine your league champion.',
                icon: '📊'
              }
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-6">{step.icon}</div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Draft Your Dream Team?
              </h3>
              <p className="text-xl opacity-90 mb-6">
                Join the waitlist and be notified when your league is ready to draft.
              </p>
              <a
                href="/app"
                className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Try the App Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-gray-900 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need for Epic Auctions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built specifically for friend groups who want the thrill of live auctions 
              with the world's best football teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Live Auction System',
                description: 'Real-time bidding with instant updates. See every bid as it happens.',
                icon: '⚡'
              },
              {
                title: 'Exclusive Team Ownership',
                description: 'Own your teams completely. No sharing, no conflicts.',
                icon: '🏆'
              },
              {
                title: 'Small Friend Groups',
                description: 'Designed for 2-8 friends. Intimate leagues where everyone knows each other.',
                icon: '👥'
              },
              {
                title: 'Smart Budget Management',
                description: '£500M budget with intelligent tracking. Strategy matters.',
                icon: '💰'
              },
              {
                title: 'Real-time Chat',
                description: 'Built-in chat for trash talk, strategy, and celebration.',
                icon: '💬'
              },
              {
                title: 'Mobile Optimized',
                description: 'Fully responsive design. Bid on your phone, tablet, or desktop.',
                icon: '📱'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  Friends of PIFA
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-base max-w-md">
                Football Auctions for Friends (FAFF) - exclusive player ownership auctions for small friend groups. 
                Build your dream team and compete with friends!
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('#how-it-works')} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection('#features')} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</button></li>
                <li><a href="/demo" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Demo</a></li>
                <li><a href="/app" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Launch App</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="mailto:hello@friendsofpifa.com" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-400 dark:text-gray-500">
              &copy; 2024 Friends of PIFA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const scrollToSection = (href) => {
  if (href.startsWith('#')) {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export default LandingPage