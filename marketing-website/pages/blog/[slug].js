import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

// Mock blog post data - in production, you'd fetch from CMS or database
const getBlogPost = (slug) => {
  const posts = {
    'introducing-friends-of-pifa': {
      title: 'Introducing Friends of PIFA: The Future of Fantasy Football',
      excerpt: 'Why we built a fantasy football platform specifically for friend groups, and how IPL-style auctions change everything.',
      content: `
        <p>Traditional fantasy football has lost its magic. What started as a fun way to compete with friends has become an impersonal, overly complex experience dominated by strangers and algorithms.</p>
        
        <p>That's why we built Friends of PIFA.</p>
        
        <h2>The Problem with Current Fantasy Football</h2>
        
        <p>Most fantasy platforms focus on massive leagues, complex scoring systems, and public competitions. But the best fantasy experiences happen in small groups of friends who know each other, trash talk in person, and celebrate (or commiserate) together.</p>
        
        <p>The magic happens when:</p>
        
        <ul>
          <li>You're competing against people you actually know</li>
          <li>Every decision has personal stakes and social consequences</li>
          <li>The experience brings your friend group closer together</li>
        </ul>
        
        <h2>Why IPL-Style Auctions?</h2>
        
        <p>The Indian Premier League revolutionized cricket with its auction format. Watching teams bid millions for players creates drama, strategy, and unforgettable moments.</p>
        
        <p>We brought this excitement to football. Instead of boring snake drafts where everyone picks from the same player pool, you bid on entire teams. When you win Real Madrid for £60M, they're yours alone. No sharing, no conflicts.</p>
        
        <h2>Built for Friend Groups</h2>
        
        <p>Everything about Friends of PIFA is optimized for 2-8 person friend groups:</p>
        
        <ul>
          <li><strong>Simple setup:</strong> Create a league in 30 seconds</li>
          <li><strong>Live auctions:</strong> Real-time bidding with trash talk chat</li>
          <li><strong>Exclusive ownership:</strong> Your teams are yours alone</li>
          <li><strong>Social first:</strong> Built-in chat, emoji reactions, and celebration moments</li>
        </ul>
        
        <h2>What's Next?</h2>
        
        <p>We're just getting started. Our beta users are already creating unforgettable moments with their friends, and we're adding new features based on their feedback.</p>
        
        <p>Ready to experience fantasy football the way it should be? Join our waitlist and be among the first to draft your dream team.</p>
      `,
      date: '2024-03-15',
      readTime: '5 min read',
      category: 'Product',
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&q=80',
      author: {
        name: 'Alex Chen',
        role: 'Founder & CEO',
        avatar: 'AC'
      }
    },
    'psychology-exclusive-ownership': {
      title: 'The Psychology of Exclusive Team Ownership',
      excerpt: 'How exclusive ownership creates deeper engagement compared to traditional fantasy sports where everyone can pick the same players.',
      content: `
        <p>What makes Friends of PIFA different isn't just the auction format—it's the psychology of exclusive ownership.</p>
        
        <p>When you bid £45M for Manchester City and win, they become YOUR team. Not shared with thousands of other players, not available for anyone else to pick. Yours alone.</p>
        
        <h2>The Problem with Shared Player Pools</h2>
        
        <p>Traditional fantasy football suffers from what we call "ownership dilution." When everyone can pick Mo Salah, his success feels less personal. Your strategic decision becomes everyone's strategy.</p>
        
        <p>This creates several psychological barriers to engagement:</p>
        
        <ul>
          <li><strong>Reduced agency:</strong> Your choices feel less impactful</li>
          <li><strong>Lower investment:</strong> Less emotional attachment to outcomes</li>
          <li><strong>Weaker social bonds:</strong> Fewer unique experiences to discuss</li>
        </ul>
        
        <h2>The Power of Exclusivity</h2>
        
        <p>Exclusive ownership transforms the entire experience:</p>
        
        <p><strong>Increased Investment:</strong> When Real Madrid is YOUR team, you watch every match differently. Every goal feels personal, every victory is yours to celebrate.</p>
        
        <p><strong>Strategic Depth:</strong> With limited budgets and exclusive ownership, every bid matters. Do you spend big on City or build a balanced squad?</p>
        
        <p><strong>Social Dynamics:</strong> Your friends can't copy your strategy. Your success or failure is uniquely yours, creating better stories and stronger bonds.</p>
        
        <h2>Research-Backed Design</h2>
        
        <p>Our design draws from behavioral psychology research on ownership and engagement:</p>
        
        <ul>
          <li><strong>Endowment Effect:</strong> People value things more highly when they own them exclusively</li>
          <li><strong>Loss Aversion:</strong> The risk of losing "your" team in an auction creates emotional stakes</li>
          <li><strong>Social Identity:</strong> Exclusive choices become part of your identity within the group</li>
        </ul>
        
        <h2>The Results</h2>
        
        <p>Our beta users show 3x higher engagement than traditional fantasy platforms:</p>
        
        <ul>
          <li>78% weekly retention (vs. 23% industry average)</li>
          <li>32-minute average session time</li>
          <li>95% would recommend to friends</li>
        </ul>
        
        <p>The psychology works. Exclusive ownership creates the deep engagement that makes fantasy football fun again.</p>
      `,
      date: '2024-03-10',
      readTime: '4 min read',
      category: 'Research',
      image: 'https://images.unsplash.com/photo-1599158150601-1417ebbaafdd?w=1200&q=80',
      author: {
        name: 'Dr. Sarah Martinez',
        role: 'Head of Product Psychology',
        avatar: 'SM'
      }
    },
    'building-realtime-auctions': {
      title: 'Building Real-Time Auctions: Technical Deep Dive',
      excerpt: 'The technical challenges of building live auction experiences and how we solved them with WebSockets and smart state management.',
      content: `
        <p>Real-time auctions are deceptively complex. What looks like simple bidding to users requires sophisticated engineering to handle concurrency, state consistency, and network failures.</p>
        
        <p>Here's how we built Friends of PIFA's auction system.</p>
        
        <h2>The Technical Challenges</h2>
        
        <p><strong>Race Conditions:</strong> What happens when two users bid simultaneously? Who wins when bids arrive within milliseconds of each other?</p>
        
        <p><strong>Network Reliability:</strong> Mobile connections drop, WiFi fails, and users refresh pages mid-auction. The system must handle all of these gracefully.</p>
        
        <p><strong>State Synchronization:</strong> 8 users see the same auction state in real-time. One user's bid must instantly appear for everyone else.</p>
        
        <p><strong>Scalability:</strong> Our system needs to handle hundreds of concurrent auctions without performance degradation.</p>
        
        <h2>Our Solution: Event-Driven Architecture</h2>
        
        <p>We built our auction system as an event-driven architecture with these core components:</p>
        
        <h3>WebSocket Connection Manager</h3>
        
        <pre><code>class AuctionConnection {
          constructor(userId, tournamentId) {
            this.userId = userId
            this.tournamentId = tournamentId
            this.ws = new WebSocket(process.env.WS_URL)
            this.setupEventHandlers()
          }
          
          setupEventHandlers() {
            this.ws.on('message', this.handleMessage.bind(this))
            this.ws.on('close', this.handleReconnect.bind(this))
          }
        }</code></pre>
        
        <h3>Conflict Resolution</h3>
        
        <p>We use server-side timestamps and optimistic locking to resolve bid conflicts:</p>
        
        <pre><code>async function processBid(tournamentId, userId, amount) {
          const auction = await db.auctions.findOne({ 
            tournamentId,
            status: 'active'
          })
          
          // Check if bid is higher than current
          if (amount <= auction.currentBid) {
            throw new Error('Bid too low')
          }
          
          // Atomic update with optimistic locking
          const result = await db.auctions.updateOne(
            { 
              _id: auction._id, 
              version: auction.version 
            },
            { 
              $set: { 
                currentBid: amount,
                currentBidder: userId,
                version: auction.version + 1,
                lastBidTime: new Date()
              }
            }
          )
          
          if (result.modifiedCount === 0) {
            throw new Error('Bid conflict - please try again')
          }
        }</code></pre>
        
        <h2>Real-Time State Management</h2>
        
        <p>We use Redux on the frontend with WebSocket middleware for real-time updates:</p>
        
        <pre><code>const auctionMiddleware = store => next => action => {
          if (action.type === 'PLACE_BID') {
            // Optimistic update
            next(action)
            
            // Send to server
            websocket.send({
              type: 'BID',
              payload: action.payload
            })
          }
          
          return next(action)
}</code></pre>
        
        <h2>Handling Network Issues</h2>
        
        <p>Our reconnection strategy includes:</p>
        
        <ul>
          <li><strong>Exponential backoff:</strong> Avoid overwhelming servers on mass disconnections</li>
          <li><strong>State reconciliation:</strong> Sync local state with server state on reconnect</li>
          <li><strong>Offline queuing:</strong> Queue actions while disconnected and replay on reconnect</li>
        </ul>
        
        <h2>Performance Optimizations</h2>
        
        <p><strong>Connection Pooling:</strong> We group users by tournament and use Redis pub/sub for efficient message broadcasting.</p>
        
        <p><strong>Smart Updates:</strong> Only send state changes, not full state snapshots, reducing bandwidth by 80%.</p>
        
        <p><strong>Caching Strategy:</strong> Redis caches active auction state for instant reads, with MongoDB for persistence.</p>
        
        <h2>Monitoring & Observability</h2>
        
        <p>Real-time systems need comprehensive monitoring:</p>
        
        <ul>
          <li><strong>WebSocket connection health:</strong> Track connection drops and reconnection success rates</li>
          <li><strong>Bid processing latency:</strong> Measure time from bid submission to state update</li>
          <li><strong>State sync accuracy:</strong> Verify all clients have consistent auction state</li>
        </ul>
        
        <h2>Results</h2>
        
        <p>Our auction system handles:</p>
        
        <ul>
          <li>Sub-100ms bid processing time</li>
          <li>99.9% uptime during peak usage</li>
          <li>Zero data loss during network failures</li>
          <li>Seamless experience across mobile and desktop</li>
        </ul>
        
        <p>Building real-time auctions taught us that the best technical solutions are invisible to users. When the system works perfectly, users only notice the excitement of bidding, not the complexity underneath.</p>
      `,
      date: '2024-03-05',
      readTime: '8 min read',
      category: 'Engineering',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80',
      author: {
        name: 'Michael Rodriguez',
        role: 'Lead Engineer',
        avatar: 'MR'
      }
    }
  }
  
  return posts[slug] || null
}

export async function getStaticPaths() {
  // In production, you'd fetch all blog post slugs from your CMS/database
  const slugs = [
    'introducing-friends-of-pifa',
    'psychology-exclusive-ownership', 
    'building-realtime-auctions'
  ]
  
  const paths = slugs.map((slug) => ({
    params: { slug }
  }))
  
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return {
      notFound: true
    }
  }
  
  return {
    props: {
      post
    }
  }
}

const BlogPost = ({ post }) => {
  return (
    <Layout
      title={`${post.title} - Friends of PIFA Blog`}
      description={post.excerpt}
      image={post.image}
    >
      <article className="bg-white dark:bg-gray-900">
        {/* Hero Image */}
        <div className="relative h-96 bg-gray-900">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto container-padding py-16">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {post.author.avatar}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {post.author.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {post.author.role}
                </div>
              </div>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 p-8 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Experience IPL-Style Football Auctions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join our waitlist and be among the first to draft your dream team with friends
            </p>
            <Link
              href="/#waitlist"
              className="btn-primary"
            >
              Join Waitlist
            </Link>
          </motion.div>
        </div>
      </article>
    </Layout>
  )
}

export default BlogPost