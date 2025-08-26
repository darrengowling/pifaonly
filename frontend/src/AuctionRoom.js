import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
              
              <div className={`bg-gray-700 p-6 rounded-lg text-center transition-all duration-300 ${
                selectedTeam?.id === currentTeam?.id ? 'ring-2 ring-blue-500 bg-gray-600' : ''
              }`}>
                {/* Team Logo Placeholder */}
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {currentTeam.name.charAt(0)}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold mb-2">{currentTeam.name}</h3>
                <p className="text-gray-400 mb-2">{currentTeam.country}</p>
                <p className="text-sm text-gray-500 mb-4">Champions League • Europe</p>
                
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
                            {squad.teams_count}/{tournament.teams_per_user} teams
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

            {/* Quick Stats */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Your Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget Left:</span>
                  <span className="font-medium">£500m</span> {/* Placeholder */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Teams:</span>
                  <span className="font-medium">0/{tournament.teams_per_user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Spent:</span>
                  <span className="font-medium">£0m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;