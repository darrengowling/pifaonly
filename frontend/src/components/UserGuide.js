import React, { useState } from 'react';

const UserGuide = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('getting-started');

  if (!isOpen) return null;

  const sections = {
    'getting-started': {
      title: '🚀 Getting Started',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900 border border-blue-600 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">App URL</h4>
            <p className="text-blue-200 font-mono text-sm">https://faff-auction.preview.emergentagent.com</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-2">What is Friends of PIFA?</h4>
            <p className="text-gray-300 text-sm">
              Bid against friends for exclusive ownership of real football teams (Champions League & Europa League). 
              Your teams earn points based on real-world performance: 1 point per goal, 3 points per win, 1 point per draw.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Quick Start Steps:</h4>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>The app automatically creates your user account</li>
              <li>Create a tournament OR join an existing one</li>
              <li>Wait for 4+ participants to join</li>
              <li>Admin starts the live auction</li>
              <li>Bid on teams within time limits</li>
              <li>Compete based on real team performance</li>
            </ol>
          </div>
        </div>
      )
    },
    
    'creating-tournament': {
      title: '🏆 Creating Tournaments',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Tournament Admin Role:</h4>
            <p className="text-gray-300 text-sm mb-3">
              As tournament creator, you control when the auction starts and set all the rules.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Tournament Settings:</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><strong>Tournament Name:</strong> Choose something memorable like "PIFA Champions League 2025"</li>
              <li><strong>Competition:</strong> Champions League (32 teams) or Europa League (32 teams)</li>
              <li><strong>Teams per User:</strong> Recommended 4-6 teams each</li>
              <li><strong>Budget:</strong> Everyone gets £500m to spend</li>
              <li><strong>Minimum Bid:</strong> Prevents £1 bids (recommended £1m-£5m)</li>
              <li><strong>Entry Fee:</strong> Optional - creates a prize pool</li>
            </ul>
          </div>

          <div className="bg-green-900 border border-green-600 p-3 rounded-lg">
            <p className="text-green-200 text-sm">
              <strong>💡 Tip:</strong> Share the tournament URL with friends so they can join easily!
            </p>
          </div>
        </div>
      )
    },

    'joining-tournament': {
      title: '👥 Joining Tournaments',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">How to Join:</h4>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Get tournament link from the admin</li>
              <li>Visit the tournament page</li>
              <li>Click the green "Join" button</li>
              <li>Wait for other participants (need 2-8 total)</li>
              <li>Admin will start auction when ready</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Tournament Status:</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><span className="text-yellow-400">🟡 Waiting for Players:</span> Need more participants</li>
              <li><span className="text-green-400">🟢 Auction Live!:</span> Bidding is active</li>
              <li><span className="text-blue-400">🔵 Tournament Active:</span> Auction complete, tracking results</li>
            </ul>
          </div>

          <div className="bg-yellow-900 border border-yellow-600 p-3 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong>⚠️ Note:</strong> Once you join, you're committed! Make sure you can participate in the auction.
            </p>
          </div>
        </div>
      )
    },

    'live-auction': {
      title: '🎪 Live Auction Guide',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Auction Interface:</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><strong>Current Team:</strong> The team up for bidding (e.g., "Manchester City")</li>
              <li><strong>Timer:</strong> Time remaining for current team (usually 2 minutes)</li>
              <li><strong>Current Bid:</strong> Highest bid so far and who placed it</li>
              <li><strong>Your Budget:</strong> Money remaining and teams still needed</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">How to Bid:</h4>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Check the current highest bid</li>
              <li>Enter your bid amount in millions (e.g., "5" = £5m)</li>
              <li>Click "Bid £Xm" to submit</li>
              <li>Watch the timer - bidding closes at 0:00</li>
              <li>Highest bidder wins the team!</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Bidding Rules:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>Must bid higher than current highest bid</li>
              <li>Must respect minimum bid amount</li>
              <li>Can't spend more than your remaining budget</li>
              <li>Must save enough money for remaining teams</li>
            </ul>
          </div>

          <div className="bg-red-900 border border-red-600 p-3 rounded-lg">
            <p className="text-red-200 text-sm">
              <strong>🚨 Important:</strong> You MUST end up with exactly the required number of teams. Plan your budget carefully!
            </p>
          </div>
        </div>
      )
    },

    'chat-strategy': {
      title: '💬 Chat & Strategy',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Using Chat:</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Type messages in the chat box and click "Send"</li>
              <li>All participants see your messages in real-time</li>
              <li>Use chat for banter, strategy, or negotiations</li>
              <li>System automatically announces new bids</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Auction Strategy Tips:</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><strong>Budget Management:</strong> Don't blow your budget on the first few teams</li>
              <li><strong>Team Quality:</strong> Champions League teams vs Europa League teams</li>
              <li><strong>Psychological Warfare:</strong> Bluff about which teams you want</li>
              <li><strong>Late Game:</strong> Players get desperate - prices can drop or spike</li>
              <li><strong>Backup Plans:</strong> Have multiple teams you'd be happy with</li>
            </ul>
          </div>

          <div className="bg-purple-900 border border-purple-600 p-3 rounded-lg">
            <p className="text-purple-200 text-sm">
              <strong>🎭 Pro Tip:</strong> Misdirection is key! Make others think you want teams you don't actually want.
            </p>
          </div>
        </div>
      )
    },

    'troubleshooting': {
      title: '🔧 Troubleshooting',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Common Issues:</h4>
            <div className="space-y-3">
              <div>
                <p className="text-yellow-300 font-medium text-sm">"Loading auction room..."</p>
                <p className="text-gray-300 text-sm">→ Refresh the page or check if auction has started</p>
              </div>
              
              <div>
                <p className="text-yellow-300 font-medium text-sm">Can't place bid</p>
                <p className="text-gray-300 text-sm">→ Check budget, ensure bid is higher than current, verify timer hasn't expired</p>
              </div>
              
              <div>
                <p className="text-yellow-300 font-medium text-sm">Don't see "Start Auction" button</p>
                <p className="text-gray-300 text-sm">→ Only admin can start, need 2+ participants, tournament must be "pending"</p>
              </div>
              
              <div>
                <p className="text-yellow-300 font-medium text-sm">WebSocket shows "Disconnected"</p>
                <p className="text-gray-300 text-sm">→ This is normal and doesn't affect core functionality</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">If Something Breaks:</h4>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Try refreshing the page first</li>
              <li>Check your internet connection</li>
              <li>Try a different browser if needed</li>
              <li>Take a screenshot of any errors</li>
              <li>Report the issue with details</li>
            </ol>
          </div>
        </div>
      )
    },

    'testing-feedback': {
      title: '📝 Testing & Feedback',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">What to Test:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-green-400 font-medium mb-1">✅ Core Features:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>Tournament creation</li>
                  <li>Joining tournaments</li>
                  <li>Live auction bidding</li>
                  <li>Chat functionality</li>
                  <li>Budget tracking</li>
                </ul>
              </div>
              
              <div>
                <p className="text-blue-400 font-medium mb-1">🎯 User Experience:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>Interface clarity</li>
                  <li>Auction excitement</li>
                  <li>Mobile compatibility</li>
                  <li>Loading speeds</li>
                  <li>Error handling</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Feedback Questions:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Is the interface intuitive and easy to navigate?</li>
              <li>• Does the auction feel exciting and engaging?</li>
              <li>• Are there any confusing or unclear parts?</li>
              <li>• Did you encounter any bugs or performance issues?</li>
              <li>• What features would make it even better?</li>
            </ul>
          </div>

          <div className="bg-blue-900 border border-blue-600 p-3 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>🎮 Testing Tip:</strong> Play like you want to win! Realistic competitive behaviour makes for better testing.
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Friends of PIFA - User Guide</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-750 border-r border-gray-600 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                {sections[activeSection].title}
              </h3>
              {sections[activeSection].content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700 px-6 py-3 border-t border-gray-600">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Need help? Check the troubleshooting section or report issues.</span>
            <span>Good luck and have fun! 🎮⚽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;