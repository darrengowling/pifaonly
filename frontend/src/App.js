import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import AuctionRoom from "./AuctionRoom";
import UserGuide from "./components/UserGuide";

// Context for global state
const AppContext = createContext();

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main App component
function App() {
  const [user, setUser] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [currentTournament, setCurrentTournament] = useState(null);
  const [showUserGuide, setShowUserGuide] = useState(false);

  // Initialize user (simulate login)
  useEffect(() => {
    const initUser = async () => {
      try {
        // Check if we have a persistent user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('Found existing user session:', userData);
          setUser(userData);
          return;
        }
        
        // Create a unique user for each session
        console.log('Creating new user session...');
        const timestamp = Date.now();
        const newUserData = {
          username: `User_${timestamp}`,
          email: `user_${timestamp}@pifa.com`
        };
        
        const response = await axios.post(`${API}/users`, newUserData);
        const newUser = response.data;
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        console.log('New user session created:', newUser.username);
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initUser();

    // Listen for custom events to show user guide
    const handleShowGuide = () => setShowUserGuide(true);
    window.addEventListener('showUserGuide', handleShowGuide);

    return () => {
      window.removeEventListener('showUserGuide', handleShowGuide);
    };
  }, []);

  const value = {
    user,
    setUser,
    tournaments,
    setTournaments,
    currentTournament,
    setCurrentTournament,
    API
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      <div className="App bg-gray-900 min-h-screen text-white">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTournament />} />
            <Route path="/tournament/:id" element={<TournamentView />} />
            <Route path="/auction/:id" element={<AuctionRoomWrapper />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>

        {/* Floating Help Button */}
        <button
          onClick={() => setShowUserGuide(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
          title="User Testing Guide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* User Guide Modal */}
        <UserGuide 
          isOpen={showUserGuide} 
          onClose={() => setShowUserGuide(false)} 
        />
      </div>
    </AppContext.Provider>
  );
}

// Dashboard Component
const Dashboard = () => {
  const { user, tournaments, setTournaments, API } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${API}/tournaments`);
      setTournaments(response.data);
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    }
  };

  const showGuide = () => {
    // This will be handled by the parent App component
    const event = new CustomEvent('showUserGuide');
    window.dispatchEvent(event);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-600 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">🎮 Welcome to Friends of PIFA Testing!</h2>
            <p className="text-blue-200 text-sm">
              New here? Check out the <strong>User Testing Guide</strong> (help button ?) for step-by-step instructions on how to create tournaments, join auctions, and test all features.
            </p>
          </div>
          <button
            onClick={showGuide}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
          >
            View Guide
          </button>
        </div>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Friends of PIFA</h1>
        <p className="text-center text-gray-400">Build your squad, compete with friends</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Create New Tournament</h2>
          <p className="text-gray-400 mb-4">
            Start a new football auction with your friends. Choose from Champions League or Europa League teams.
          </p>
          <button 
            onClick={() => navigate('/create')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Tournament
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Active Tournaments</h2>
          <div className="space-y-3">
            {tournaments.length === 0 ? (
              <p className="text-gray-400">No tournaments yet. Create your first one!</p>
            ) : (
              tournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tournament Card Component
const TournamentCard = ({ tournament }) => {
  const { user, API } = useAppContext();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'auction_active': return 'text-green-400';
      case 'tournament_active': return 'text-blue-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Waiting for Players';
      case 'auction_active': return 'Auction Live!';
      case 'tournament_active': return 'Tournament Active';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const joinTournament = async () => {
    try {
      await axios.post(`${API}/tournaments/${tournament.id}/join?user_id=${user.id}`);
      window.location.reload();
    } catch (error) {
      alert('Failed to join tournament: ' + error.response?.data?.detail);
    }
  };

  const canJoin = !tournament.participants.includes(user.id) && 
                  tournament.participants.length < 8 && 
                  tournament.status !== 'completed';

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{tournament.name}</h3>
        <span className={`text-sm ${getStatusColor(tournament.status)}`}>
          {getStatusText(tournament.status)}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-2">
        {tournament.competition_type.replace('_', ' ').toUpperCase()}
      </p>
      <p className="text-sm text-gray-400 mb-3">
        Players: {tournament.participants.length}/8
      </p>
      
      <div className="flex gap-2">
        {canJoin && (
          <button 
            onClick={joinTournament}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm transition-colors"
          >
            Join
          </button>
        )}
        <button 
          onClick={() => navigate(`/tournament/${tournament.id}`)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
};

// Create Tournament Component
const CreateTournament = () => {
  const { user, API } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    competition_type: 'champions_league',
    teams_per_user: 4,
    minimum_bid: 1000000,
    entry_fee: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API}/tournaments?admin_id=${user.id}`,
        formData
      );
      navigate(`/tournament/${response.data.id}`);
    } catch (error) {
      alert('Failed to create tournament: ' + error.response?.data?.detail);
    }
  };

  const formatCurrency = (value) => {
    return `£${(value / 1000000).toFixed(0)}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-gray-800 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Create New Tournament</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tournament Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Champions League 2025/26"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Competition</label>
            <select
              value={formData.competition_type}
              onChange={(e) => setFormData({...formData, competition_type: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="champions_league">Champions League</option>
              <option value="europa_league">Europa League</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teams per User</label>
            <input
              type="number"
              min="2"
              max="10"
              value={formData.teams_per_user}
              onChange={(e) => setFormData({...formData, teams_per_user: parseInt(e.target.value)})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Bid: {formatCurrency(formData.minimum_bid)}
            </label>
            <input
              type="range"
              min="1000000"
              max="10000000"
              step="1000000"
              value={formData.minimum_bid}
              onChange={(e) => setFormData({...formData, minimum_bid: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Entry Fee (£)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.entry_fee / 100}
              onChange={(e) => setFormData({...formData, entry_fee: Math.round(parseFloat(e.target.value) * 100)})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tournament View Component
const TournamentView = () => {
  const { user, API } = useAppContext();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tournamentId = window.location.pathname.split('/')[2];

  useEffect(() => {
    fetchTournamentData();
    
    // Set up auto-refresh every 5 seconds to sync data between devices
    const refreshInterval = setInterval(() => {
      fetchTournamentData();
    }, 5000);
    
    return () => clearInterval(refreshInterval);
  }, [tournamentId]);

  const fetchTournamentData = async () => {
    try {
      setIsRefreshing(true);
      console.log('Fetching fresh tournament data...');
      
      const [tournamentRes, teamsRes] = await Promise.all([
        axios.get(`${API}/tournaments/${tournamentId}?_t=${Date.now()}`), // Add timestamp to prevent caching
        axios.get(`${API}/teams?_t=${Date.now()}`)
      ]);
      
      console.log('Tournament data updated:', {
        participants: tournamentRes.data.participants.length,
        status: tournamentRes.data.status
      });
      
      setTournament(tournamentRes.data);
      setTeams(teamsRes.data);

      // Fetch participant details
      if (tournamentRes.data.participants.length > 0) {
        const participantPromises = tournamentRes.data.participants.map(id => 
          axios.get(`${API}/users/${id}?_t=${Date.now()}`)
        );
        const participantResponses = await Promise.all(participantPromises);
        setParticipants(participantResponses.map(res => res.data));
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error('Failed to fetch tournament data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const startAuction = async () => {
    try {
      await axios.post(`${API}/tournaments/${tournamentId}/start-auction?admin_id=${user.id}`);
      navigate(`/auction/${tournamentId}`);
    } catch (error) {
      alert('Failed to start auction: ' + error.response?.data?.detail);
    }
  };

  const copyTournamentLink = () => {
    const url = window.location.href;
    console.log('Share button clicked, URL:', url);
    
    // Try native sharing first (mobile)
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      console.log('Using native sharing');
      navigator.share({
        title: tournament.name,
        text: `Join my PIFA tournament: ${tournament.name}`,
        url: url,
      }).then(() => {
        console.log('Share successful');
      }).catch((error) => {
        console.log('Share failed, using clipboard fallback:', error);
        copyToClipboard(url);
      });
    } else {
      // Use clipboard for desktop
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    console.log('Copying to clipboard:', text);
    
    if (navigator.clipboard && window.isSecureContext) {
      // Modern clipboard API
      navigator.clipboard.writeText(text).then(() => {
        alert('Tournament link copied to clipboard!\n\nShare this link with your friends to join the tournament.');
        console.log('Copied via clipboard API');
      }).catch((error) => {
        console.log('Clipboard API failed:', error);
        fallbackCopy(text);
      });
    } else {
      // Fallback method
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    console.log('Using fallback copy method');
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        alert('Tournament link copied!\n\nShare this link with your friends to join the tournament.');
        console.log('Fallback copy successful');
      } else {
        showManualCopy(text);
      }
    } catch (error) {
      console.log('Fallback copy failed:', error);
      showManualCopy(text);
    }
  };

  const showManualCopy = (text) => {
    console.log('Showing manual copy prompt');
    const message = `Please copy this tournament link manually:\n\n${text}\n\nShare it with your friends to join the tournament!`;
    alert(message);
    
    // Also log to console for easy copying
    console.log('Manual copy - Tournament URL:', text);
  };

  const joinTournamentFromDetail = async () => {
    try {
      await axios.post(`${API}/tournaments/${tournamentId}/join?user_id=${user.id}`);
      window.location.reload();
    } catch (error) {
      alert('Failed to join tournament: ' + error.response?.data?.detail);
    }
  };

  const canJoinTournament = tournament && 
                            !tournament.participants.includes(user.id) && 
                            tournament.participants.length < 8 && 
                            tournament.status !== 'completed';

  const refreshTournamentData = async () => {
    console.log('Manual refresh triggered');
    await fetchTournamentData();
  };

  const becomeAdminForTesting = async () => {
    if (confirm('Make yourself admin of this tournament for testing?\n\nThis will update the tournament admin to your current user ID.')) {
      try {
        console.log('Attempting to become admin...');
        // This is a testing-only workaround - update tournament admin
        const response = await axios.patch(`${API}/tournaments/${tournamentId}/admin`, {
          new_admin_id: user.id
        });
        alert('You are now the admin! Refreshing page...');
        window.location.reload();
      } catch (error) {
        console.error('Failed to become admin:', error);
        alert('Admin override failed. This tournament may have been created by another session.');
      }
    }
  };

  const resetUserForTesting = async () => {
    if (confirm('Reset user for testing? This will create a new user account and refresh the page.\n\nNote: You will lose admin access to any tournaments you created with the current user.')) {
      try {
        // Clear existing user
        localStorage.removeItem('user');
        
        // Create a new unique user
        const timestamp = Date.now();
        const newUserData = {
          username: `User_${timestamp}`,
          email: `user_${timestamp}@pifa.com`
        };
        
        const response = await axios.post(`${API}/users`, newUserData);
        const newUser = response.data;
        
        // Set new user and refresh
        localStorage.setItem('user', JSON.stringify(newUser));
        window.location.reload();
      } catch (error) {
        console.error('Failed to create new user:', error);
        // Fallback to just clearing and refreshing
        localStorage.removeItem('user');
        window.location.reload();
      }
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading tournament...</div>
      </div>
    );
  }

  const isAdmin = tournament && tournament.admin_id === user.id;
  const canStartAuction = tournament && isAdmin && tournament.status === 'pending' && participants.length >= 2;
  
  console.log('Tournament admin check:', {
    tournament_admin_id: tournament.admin_id,
    current_user_id: user.id,
    isAdmin,
    tournament_status: tournament.status,
    participants_count: participants.length,
    canStartAuction
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-gray-400">
                {tournament.competition_type.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-lg font-semibold text-yellow-400">
                {tournament.status.replace('_', ' ').toUpperCase()}
              </div>
              {isRefreshing && (
                <div className="text-xs text-blue-400 mt-1">Syncing...</div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Budget per User</div>
              <div className="text-2xl font-bold">£{(tournament.budget_per_user / 1000000).toFixed(0)}m</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Teams per User</div>
              <div className="text-2xl font-bold">{tournament.teams_per_user}</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Minimum Bid</div>
              <div className="text-2xl font-bold">£{(tournament.minimum_bid / 1000000).toFixed(0)}m</div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            {canJoinTournament && (
              <button
                onClick={joinTournamentFromDetail}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🎯 Join Tournament
              </button>
            )}

            {canStartAuction && (
              <button
                onClick={startAuction}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🚀 Start Auction
              </button>
            )}

            <button
              onClick={copyTournamentLink}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              title="Copy tournament link to share with friends"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Tournament
            </button>

            <button
              onClick={refreshTournamentData}
              disabled={isRefreshing}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                isRefreshing 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title="Refresh tournament data"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            {tournament.status === 'auction_active' && (
              <button
                onClick={() => navigate(`/auction/${tournamentId}`)}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🎪 Join Live Auction
              </button>
            )}
          </div>
        </div>
        
        {/* Admin Helper for Testing */}
        {tournament.status === 'pending' && !isAdmin && (
          <div className="bg-yellow-600 p-3 rounded-lg mb-4">
            <div className="text-sm">
              <strong>🛠️ Admin Helper:</strong> To start the auction, you need to be the tournament admin.
              The admin is <strong>{tournament.admin_id.substring(0, 8)}...</strong>
            </div>
            <div className="text-xs mt-1">
              Open the original browser where you created this tournament to start the auction.
            </div>
          </div>
        )}
        
        {/* Auction Already Active Helper */}
        {tournament.status === 'auction_active' && (
          <div className="bg-purple-600 p-3 rounded-lg mb-4">
            <div className="text-sm">
              <strong>🎪 Auction is Already Active!</strong> 
              {isAdmin ? " As admin, you can join the live auction." : " You can join the live auction now."}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Participants ({participants.length}/8)</h2>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={participant.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{participant.username}</div>
                    {participant.id === tournament.admin_id && (
                      <div className="text-xs text-blue-400">Admin</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tournament Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Competition:</span>
                <span>{tournament.competition_type.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Fee:</span>
                <span>£{(tournament.entry_fee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prize Pool:</span>
                <span>£{(tournament.prize_pool / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available Teams:</span>
                <span>{tournament.teams.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info for Testing */}
        {tournament && (
          <div className="bg-red-600 p-4 rounded-lg mt-6">
            <h3 className="font-bold mb-2">🚨 TESTING INSTRUCTIONS FOR JOIN BUTTON</h3>
            <p className="text-sm mb-2">
              <strong>To test the join button:</strong>
            </p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>Open this page in an <strong>incognito/private browser window</strong></li>
              <li>You will be a different user and see the join button!</li>
              <li>OR use two different browsers (Chrome + Firefox)</li>
              <li>The join button appears for users who haven't joined yet</li>
            </ol>
            <p className="text-xs mt-2 text-red-200">
              Join button logic: Show if user NOT in participants AND tournament not full AND not completed
            </p>
            <div className="text-xs mt-2 bg-black bg-opacity-30 p-2 rounded">
              <div>👤 Current User: {user.username} ({user.id.substring(0, 8)}...)</div>
              <div>👑 Tournament Admin: {tournament.admin_id.substring(0, 8)}...</div>
              <div>🎪 Status: {tournament.status}</div>
              <div>👥 Participants: {tournament.participants.length}/8</div>
              <div>🏆 Can Start Auction: {isAdmin && tournament.status === 'pending' && participants.length >= 2 ? 'YES' : 'NO'}</div>
            </div>
          </div>
        )}

        {/* Available Teams Section */}
        <div className="bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Available Teams ({tournament.teams.length})</h2>
          <p className="text-gray-400 text-sm mb-4">
            These teams will be available for bidding when the auction starts:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {teams
              .filter(team => tournament.teams.includes(team.id))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(team => (
              <div key={team.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="font-medium text-sm">{team.name}</div>
                <div className="text-xs text-gray-400">{team.country}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Auction Room Wrapper Component
const AuctionRoomWrapper = () => {
  const { user } = useAppContext();
  const tournamentId = window.location.pathname.split('/')[2];
  
  return <AuctionRoom tournamentId={tournamentId} user={user} />;
};

export default App;