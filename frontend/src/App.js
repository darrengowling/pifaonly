import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
        // For demo purposes, create a test user
        const username = `User_${Math.floor(Math.random() * 1000)}`;
        const email = `${username.toLowerCase()}@example.com`;
        
        const response = await axios.post(`${API}/users`, { username, email });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      initUser();
    }
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
      </div>
    </AppContext.Provider>
  );
}

// Dashboard Component
const Dashboard = () => {
  const { user, tournaments, setTournaments, API } = useAppContext();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Fantasy Soccer Auction</h1>
        <p className="text-center text-gray-400">Welcome back, {user.username}!</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Create New Tournament</h2>
          <p className="text-gray-400 mb-4">
            Start a new fantasy auction with your friends. Choose from Champions League or Europa League teams.
          </p>
          <button 
            onClick={() => window.location.href = '/create'}
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

  const canJoin = !tournament.participants.includes(user.id) && tournament.status === 'pending';

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
          onClick={() => window.location.href = `/tournament/${tournament.id}`}
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
      window.location.href = `/tournament/${response.data.id}`;
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
              onClick={() => window.location.href = '/'}
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
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);

  const tournamentId = window.location.pathname.split('/')[2];

  useEffect(() => {
    fetchTournamentData();
  }, [tournamentId]);

  const fetchTournamentData = async () => {
    try {
      const [tournamentRes, teamsRes] = await Promise.all([
        axios.get(`${API}/tournaments/${tournamentId}`),
        axios.get(`${API}/teams`)
      ]);
      
      setTournament(tournamentRes.data);
      setTeams(teamsRes.data);

      // Fetch participant details
      const participantPromises = tournamentRes.data.participants.map(id => 
        axios.get(`${API}/users/${id}`)
      );
      const participantResponses = await Promise.all(participantPromises);
      setParticipants(participantResponses.map(res => res.data));
    } catch (error) {
      console.error('Failed to fetch tournament data:', error);
    }
  };

  const startAuction = async () => {
    try {
      await axios.post(`${API}/tournaments/${tournamentId}/start-auction?admin_id=${user.id}`);
      window.location.href = `/auction/${tournamentId}`;
    } catch (error) {
      alert('Failed to start auction: ' + error.response?.data?.detail);
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading tournament...</div>
      </div>
    );
  }

  const isAdmin = tournament.admin_id === user.id;
  const canStartAuction = isAdmin && tournament.status === 'pending' && participants.length >= 4;
  
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

          {canStartAuction && (
            <button
              onClick={startAuction}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors mb-6"
            >
              Start Auction
            </button>
          )}

          {tournament.status === 'auction_active' && (
            <button
              onClick={() => window.location.href = `/auction/${tournamentId}`}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors mb-6"
            >
              Join Live Auction
            </button>
          )}
        </div>

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