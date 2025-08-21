import React from 'react';

const Header = ({ user, currentPage = 'dashboard' }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚽</span>
              </div>
              <h1 className="text-xl font-bold text-white">Fantasy Soccer Auction</h1>
            </div>
            
            <nav className="hidden md:flex gap-6">
              <a 
                href="/" 
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </a>
              <a 
                href="/create" 
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'create' 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Tournament
              </a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {user?.username || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;