import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Team Logo Component - generates attractive placeholders
const TeamLogo = ({ team, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg', 
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-24 h-24 text-3xl'
  };

  const getTeamColor = (teamName) => {
    // Generate consistent colors based on team name
    const colors = [
      'from-red-500 to-red-700',
      'from-blue-500 to-blue-700', 
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-yellow-500 to-orange-600',
      'from-indigo-500 to-indigo-700',
      'from-pink-500 to-pink-700',
      'from-teal-500 to-teal-700'
    ];
    
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getTeamInitials = (teamName) => {
    return teamName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${getTeamColor(team.name)} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}>
      {getTeamInitials(team.name)}
    </div>
  );
};

// Team Detail Panel Component
const TeamDetailPanel = ({ team, isVisible, onClose, currentBid }) => {
  if (!isVisible || !team) return null;

  // Format currency function
  const formatCurrency = (amount) => {
    return `£${(amount / 1000000).toFixed(0)}m`;
  };

  // Mock team stats - in a real app, this would come from an API
  const getTeamStats = (team) => ({
    founded: team.founded || Math.floor(Math.random() * 50) + 1950,
    league_position: Math.floor(Math.random() * 20) + 1,
    recent_form: ['W', 'W', 'L', 'D', 'W'],
    top_scorer: `Player ${Math.floor(Math.random() * 99) + 1}`,
    goals_scored: Math.floor(Math.random() * 30) + 20,
    goals_conceded: Math.floor(Math.random() * 20) + 5,
    market_value: `€${Math.floor(Math.random() * 500) + 100}M`,
    coach: `Coach ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
  });

  const stats = getTeamStats(team);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <TeamLogo team={team} size="lg" />
              <div>
                <h3 className="text-xl font-bold">{team.name}</h3>
                <p className="text-gray-400">{team.country}</p>
                <p className="text-sm text-blue-400">{team.competition || 'Champions League'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Current Auction Status */}
        {currentBid && (
          <div className="p-4 bg-green-600 bg-opacity-20 border-b border-gray-700">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">Current Highest Bid</div>
              <div className="text-2xl font-bold">{formatCurrency(currentBid.amount)}</div>
              <div className="text-sm text-gray-400">by {currentBid.username}</div>
            </div>
          </div>
        )}

        {/* Team Statistics */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-3">Club Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Founded</div>
                <div className="font-semibold">{stats.founded}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Market Value</div>
                <div className="font-semibold text-green-400">{stats.market_value}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">League Position</div>
                <div className="font-semibold">#{stats.league_position}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Coach</div>
                <div className="font-semibold">{stats.coach}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Performance</h4>
            <div className="space-y-3">
              <div className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Recent Form</span>
                  <div className="flex gap-1">
                    {stats.recent_form.map((result, index) => (
                      <span
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          result === 'W' ? 'bg-green-600' :
                          result === 'L' ? 'bg-red-600' : 'bg-yellow-600'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.goals_scored}</div>
                  <div className="text-xs text-gray-400">Goals Scored</div>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.goals_conceded}</div>
                  <div className="text-xs text-gray-400">Goals Conceded</div>
                </div>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400 mb-1">Top Scorer</div>
                <div className="font-semibold">{stats.top_scorer} ({Math.floor(stats.goals_scored * 0.3)} goals)</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Auction Strategy</h4>
            <div className="bg-blue-600 bg-opacity-20 p-3 rounded">
              <div className="text-sm text-blue-200">
                💡 <strong>Tip:</strong> This team has {stats.recent_form.filter(r => r === 'W').length} wins in their last 5 matches.
                {stats.league_position <= 5 && " They're currently in a European qualification spot!"}
                {stats.goals_scored > 25 && " Strong attacking record this season."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuctionRoom = ({ tournamentId, user }) => {
  const [tournament, setTournament] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentBid, setCurrentBid] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [squads, setSquads] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [teams, setTeams] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [forceRender, setForceRender] = useState(0); // Force re-render trigger
  const [selectedTeam, setSelectedTeam] = useState(null); // NEW: For team highlighting
  const [userSquads, setUserSquads] = useState({}); // NEW: Track user squads for budget display
  const [teamBidHistory, setTeamBidHistory] = useState([]); // NEW: Bid history for current team
  const [showTeamDetail, setShowTeamDetail] = useState(false); // NEW: Show team detail panel
  const [detailTeam, setDetailTeam] = useState(null); // NEW: Team to show in detail panel
  
  const chatContainerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
    connectWebSocket();
    
    return () => {
      if (socket) {
        socket.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [tournamentId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const connectWebSocket = () => {
    try {
      // Simplified WebSocket URL - remove the protocol replacement
      const wsUrl = 'wss://soccer-league-bid.preview.emergentagent.com';
      const ws = new WebSocket(`${wsUrl}/ws/${tournamentId}`);
      
      console.log('Connecting to WebSocket:', `${wsUrl}/ws/${tournamentId}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);
        handleWebSocketMessage(message);
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        // Don't auto-reconnect for now to avoid spam
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
      
      setSocket(ws);
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  };

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'auction_started':
        fetchCurrentTeam();
        break;
      case 'new_bid':
        setCurrentBid({
          amount: message.amount,
          username: message.username
        });
        break;
      case 'team_sold':
        fetchSquads();
        fetchCurrentTeam();
        break;
      case 'chat_message':
        setChatMessages(prev => [...prev, {
          username: message.username,
          message: message.message,
          timestamp: message.timestamp
        }]);
        break;
      case 'auction_ended':
        alert('Auction has ended!');
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const fetchInitialData = async () => {
    try {
      console.log('Fetching initial data for tournament:', tournamentId);
      
      // Fetch tournament and teams in parallel
      const [tournamentRes, teamsRes] = await Promise.all([
        axios.get(`${API}/tournaments/${tournamentId}`),
        axios.get(`${API}/teams`)
      ]);
      
      console.log('Tournament data:', tournamentRes.data);
      console.log('Teams loaded:', teamsRes.data.length);
      
      // Set tournament and teams state first
      setTournament(tournamentRes.data);
      setTeams(teamsRes.data);
      
      // Fetch chat messages
      try {
        const chatRes = await axios.get(`${API}/tournaments/${tournamentId}/chat`);
        setChatMessages(chatRes.data);
      } catch (chatError) {
        console.log('No chat messages yet:', chatError.message);
        setChatMessages([]);
      }
      
      // Fetch participants
      if (tournamentRes.data.participants && tournamentRes.data.participants.length > 0) {
        const participantPromises = tournamentRes.data.participants.map(id => 
          axios.get(`${API}/users/${id}`)
        );
        const participantResponses = await Promise.all(participantPromises);
        setParticipants(participantResponses.map(res => res.data));
      }
      
      // NOW fetch current team using the loaded teams data AND set it directly
      if (tournamentRes.data.status === 'auction_active' && tournamentRes.data.current_team_id) {
        console.log('Auction is active, finding current team directly');
        const currentTeamDirect = teamsRes.data.find(t => t.id === tournamentRes.data.current_team_id);
        console.log('Direct team lookup result:', currentTeamDirect);
        
        if (currentTeamDirect) {
          console.log('Setting current team immediately');
          setCurrentTeam(currentTeamDirect);
          setForceRender(prev => prev + 1);
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      alert('Failed to load auction data. Please try again.');
    }
  };

  const fetchCurrentTeam = async (teamsData = teams) => {
    try {
      console.log('Fetching current team...', {
        tournamentId,
        teamsDataLength: teamsData.length,
        teamsState: teams.length
      });
      const response = await axios.get(`${API}/tournaments/${tournamentId}`);
      const tournament = response.data;
      
      console.log('Tournament current_team_id:', tournament.current_team_id);
      
      if (tournament.current_team_id && teamsData.length > 0) {
        const team = teamsData.find(t => t.id === tournament.current_team_id);
        console.log('Team lookup result:', team);
        
        if (team) {
          console.log('Setting currentTeam state to:', team);
          setCurrentTeam(team);
          
          // Force a re-render to ensure state update takes effect
          setForceRender(prev => prev + 1);
          
          // Force a re-render by updating tournament state too
          setTournament(tournament);
          
          console.log('State update completed');
        } else {
          console.error('Team not found! ID:', tournament.current_team_id);
          console.log('All team IDs:', teamsData.map(t => t.id));
          setCurrentTeam(null);
        }
        
        // Get current highest bid
        try {
          const bidsResponse = await axios.get(`${API}/tournaments/${tournamentId}/bids`);
          const teamBids = bidsResponse.data.filter(bid => bid.team_id === tournament.current_team_id);
          
          // Set bid history for current team
          const sortedBids = teamBids
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5); // Show last 5 bids
          
          const bidHistory = await Promise.all(
            sortedBids.map(async (bid) => {
              const bidder = participants.find(p => p.id === bid.user_id);
              return {
                ...bid,
                username: bidder?.username || 'Unknown',
                timeAgo: formatTimeAgo(bid.timestamp)
              };
            })
          );
          setTeamBidHistory(bidHistory);
          
          if (teamBids.length > 0) {
            const highestBid = teamBids.reduce((max, bid) => bid.amount > max.amount ? bid : max);
            const bidder = participants.find(p => p.id === highestBid.user_id);
            setCurrentBid({
              amount: highestBid.amount,
              username: bidder?.username || 'Unknown'
            });
          } else {
            setCurrentBid(null);
            setTeamBidHistory([]);
          }
        } catch (bidError) {
          console.log('No bids yet:', bidError.message);
          setCurrentBid(null);
          setTeamBidHistory([]);
        }
        
        // Calculate time remaining
        if (tournament.bid_end_time) {
          const endTime = new Date(tournament.bid_end_time);
          const now = new Date();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          
          console.log('Timer calculation:', {
            bid_end_time: tournament.bid_end_time,
            endTime: endTime.toISOString(),
            now: now.toISOString(),
            remaining: remaining
          });
          
          setTimeRemaining(remaining);
          
          // Start countdown timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        console.log('No current team ID or teams not loaded yet');
        setCurrentTeam(null);
      }
    } catch (error) {
      console.error('Failed to fetch current team:', error);
    }
  };

  const fetchSquads = async () => {
    try {
      const response = await axios.get(`${API}/tournaments/${tournamentId}/squads`);
      setSquads(response.data);
      
      // Create user squad mapping for budget tracking
      const squadMap = {};
      response.data.forEach(squad => {
        squadMap[squad.user_id] = {
          total_spent: squad.total_spent || 0,
          teams_count: squad.teams ? squad.teams.length : 0,
          remaining_budget: tournament.budget_per_user - (squad.total_spent || 0)
        };
      });
      setUserSquads(squadMap);
    } catch (error) {
      console.error('Failed to fetch squads:', error);
      setSquads([]);
      setUserSquads({});
    }
  };

  const placeBid = async () => {
    if (!bidAmount || !currentTeam) return;
    
    const amount = parseInt(bidAmount) * 1000000; // Convert to pence
    
    try {
      console.log(`Placing bid: £${bidAmount}m (${amount} pence) for ${currentTeam.name}`);
      const response = await axios.post(`${API}/tournaments/${tournamentId}/bid?user_id=${user.id}&amount=${amount}`);
      console.log('Bid response:', response.data);
      setBidAmount('');
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Bid error:', error.response?.data);
      alert('Bid failed: ' + error.response?.data?.detail);
    }
  };

  const resetTimer = async () => {
    try {
      const response = await axios.post(`${API}/tournaments/${tournamentId}/reset-timer`);
      alert('Timer reset! You now have 5 minutes to bid.');
      window.location.reload();
    } catch (error) {
      alert('Failed to reset timer: ' + error.response?.data?.detail);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    try {
      await axios.post(`${API}/tournaments/${tournamentId}/chat?user_id=${user.id}`, {
        message: chatInput
      });
      setChatInput('');
    } catch (error) {
      console.error('Failed to send chat message:', error);
    }
  };

  const formatCurrency = (amount) => {
    return `£${(amount / 1000000).toFixed(0)}m`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  const placeBidWithAmount = (amount) => {
    setBidAmount(amount.toString());
    placeBid();
  };

  const showTeamDetails = (team) => {
    setDetailTeam(team);
    setShowTeamDetail(true);
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading auction room...</div>
      </div>
    );
  }

  // Show different states based on tournament status
  if (tournament.status !== 'auction_active') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
            <div className="text-xl text-yellow-400 mb-4">
              Auction Status: {tournament.status.replace('_', ' ').toUpperCase()}
            </div>
            {tournament.status === 'pending' && (
              <p className="text-gray-400">Waiting for admin to start the auction...</p>
            )}
            {tournament.status === 'tournament_active' && (
              <p className="text-gray-400">Tournament is in progress. Check back for results!</p>
            )}
            {tournament.status === 'completed' && (
              <p className="text-gray-400">Tournament has ended. View results below.</p>
            )}
            <button
              onClick={() => window.location.href = `/tournament/${tournamentId}`}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              Back to Tournament
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If auction is active but no current team, show waiting state
  if (!currentTeam && tournament?.status === 'auction_active') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h1 className="text-3xl font-bold mb-4">{tournament.name} - Live Auction</h1>
            <div className="text-xl text-green-400 mb-4">Auction is Active!</div>
            <p className="text-gray-400 mb-6">Preparing next team for bidding...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            {/* Debug info */}
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div>Debug: currentTeam = {currentTeam ? currentTeam.name : 'NULL'}</div>
              <div>Tournament status: {tournament?.status}</div>
              <div>Current team ID: {tournament?.current_team_id}</div>
              <div>Teams loaded: {teams.length}</div>
              <div>Force render count: {forceRender}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-600 px-3 py-1 rounded text-xs"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const minimumBid = currentBid ? currentBid.amount + 1000000 : tournament.minimum_bid;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{tournament.name} - Live Auction</h1>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className="text-lg font-mono">
                {formatTime(timeRemaining)}
              </div>
              {timeRemaining === 0 && (
                <button
                  onClick={resetTimer}
                  className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                >
                  Reset Timer (Testing)
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Auction Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Team with Enhanced UX */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Current Team</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    tournament.status === 'auction_active' ? 'bg-green-600 text-white' : 
                    tournament.status === 'pending' ? 'bg-yellow-600 text-white' : 
                    'bg-gray-600 text-white'
                  }`}>
                    {tournament.status === 'auction_active' ? '🎪 Live Auction' :
                     tournament.status === 'pending' ? '🕒 Waiting to Start' :
                     tournament.status === 'tournament_active' ? '⚽ Tournament Active' : 
                     tournament.status}
                  </span>
                </div>
              </div>
              
              <div className={`bg-gray-700 p-6 rounded-lg text-center transition-all duration-300 cursor-pointer hover:bg-gray-650 ${
                selectedTeam?.id === currentTeam?.id ? 'ring-2 ring-blue-500 bg-gray-600' : ''
              }`} onClick={() => showTeamDetails(currentTeam)}>
                {/* Enhanced Team Logo */}
                <div className="flex justify-center mb-4">
                  <TeamLogo team={currentTeam} size="xl" />
                </div>
                
                <h3 className="text-3xl font-bold mb-2">{currentTeam.name}</h3>
                <p className="text-gray-400 mb-2">{currentTeam.country}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {currentTeam.competition || 'Champions League'} • Europe
                </p>
                <p className="text-xs text-blue-400 mb-4 opacity-75">
                  Click for team details
                </p>
                
                {/* Current Bid Display */}
                {currentBid ? (
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-green-400 mb-1">{formatCurrency(currentBid.amount)}</div>
                    <div className="text-sm text-gray-400">Highest bid by <span className="text-blue-400 font-semibold">{currentBid.username}</span></div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-xl text-gray-400 mb-1">No bids yet</div>
                    <div className="text-sm text-gray-500">Starting bid: {formatCurrency(tournament.minimum_bid)}</div>
                  </div>
                )}
                
                {/* Bidding Interface */}
                <div className="space-y-3">
                  {/* Quick Bid Buttons */}
                  <div className="flex gap-2 justify-center mb-3">
                    <button
                      onClick={() => placeBidWithAmount((minimumBid / 1000000) + 5)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      +£5m
                    </button>
                    <button
                      onClick={() => placeBidWithAmount((minimumBid / 1000000) + 10)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      +£10m
                    </button>
                    <button
                      onClick={() => placeBidWithAmount((minimumBid / 1000000) + 20)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      +£20m
                    </button>
                  </div>
                  
                  {/* Custom Bid Input */}
                  <div className="flex gap-2 items-center justify-center">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: £${(minimumBid / 1000000).toFixed(0)}m`}
                      className="flex-1 p-3 bg-gray-600 border border-gray-500 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={minimumBid / 1000000}
                    />
                    <button
                      onClick={placeBid}
                      disabled={!bidAmount || timeRemaining === 0}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Bid £{bidAmount || '0'}m
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bid History */}
              {teamBidHistory.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Recent Bids</h4>
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                    {teamBidHistory.map((bid, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-blue-400 font-medium">{bid.username}</span>
                        <span className="text-green-400 font-bold">{formatCurrency(bid.amount)}</span>
                        <span className="text-gray-500 text-xs">{bid.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Participants Status with Budget Tracking */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Participants & Budgets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {participants.map(participant => {
                  const squad = userSquads[participant.id] || { total_spent: 0, teams_count: 0, remaining_budget: tournament.budget_per_user };
                  const budgetPercentage = ((tournament.budget_per_user - squad.remaining_budget) / tournament.budget_per_user) * 100;
                  
                  return (
                    <div key={participant.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          participant.id === user.id ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-600'
                        }`}>
                          {participant.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {participant.username}
                            {participant.id === user.id && <span className="text-blue-400 ml-1">(You)</span>}
                          </div>
                          <div className="text-xs text-gray-400">
                            {squad.teams_count}/{tournament.teams_per_user || 4} teams
                          </div>
                        </div>
                      </div>
                      
                      {/* Budget Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Budget Used</span>
                          <span>{budgetPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              budgetPercentage > 80 ? 'bg-red-500' : 
                              budgetPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Spent: {formatCurrency(squad.total_spent)}</span>
                        <span className="text-green-400 font-medium">Left: {formatCurrency(squad.remaining_budget)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Chat</h3>
              <div 
                ref={chatContainerRef}
                className="bg-gray-700 p-3 rounded-lg h-64 overflow-y-auto mb-3"
              >
                {chatMessages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <span className="text-blue-400 text-sm font-medium">{msg.username}:</span>
                    <span className="text-sm ml-2">{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-sm"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Enhanced Tournament Statistics */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Tournament Stats</h3>
              <div className="space-y-3">
                <div className="text-center p-3 bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{teams.length}</div>
                  <div className="text-xs text-gray-400">Total Teams</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-lg font-bold text-blue-400">{participants.length}</div>
                    <div className="text-xs text-gray-400">Players</div>
                  </div>
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-lg font-bold text-purple-400">{tournament.teams_per_user || 4}</div>
                    <div className="text-xs text-gray-400">Per Player</div>
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-lg font-bold text-yellow-400">{formatCurrency(tournament.budget_per_user || 500000000)}</div>
                  <div className="text-xs text-gray-400">Budget Each</div>
                </div>
              </div>
            </div>

            {/* Your Status */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Your Status</h3>
              {userSquads[user.id] ? (
                <div className="space-y-3">
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(userSquads[user.id].remaining_budget)}
                    </div>
                    <div className="text-xs text-gray-400">Budget Remaining</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <div className="text-lg font-bold text-blue-400">
                        {userSquads[user.id].teams_count}/{tournament.teams_per_user || 4}
                      </div>
                      <div className="text-xs text-gray-400">Teams</div>
                    </div>
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <div className="text-lg font-bold text-red-400">
                        {formatCurrency(userSquads[user.id].total_spent)}
                      </div>
                      <div className="text-xs text-gray-400">Spent</div>
                    </div>
                  </div>
                  
                  {/* Budget Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Budget Used</span>
                      <span>
                        {((userSquads[user.id].total_spent / (tournament.budget_per_user || 500000000)) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((userSquads[user.id].total_spent / (tournament.budget_per_user || 500000000)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <div className="text-sm">Loading your status...</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Detail Panel */}
        <TeamDetailPanel
          team={detailTeam}
          isVisible={showTeamDetail}
          onClose={() => setShowTeamDetail(false)}
          currentBid={currentBid}
        />
      </div>
    </div>
  );
};

export default AuctionRoom;