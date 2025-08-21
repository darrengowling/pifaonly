import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WS_URL = BACKEND_URL.replace('https:', 'wss:').replace('http:', 'ws:');

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
      const ws = new WebSocket(`${WS_URL}/ws/${tournamentId}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setSocket(ws);
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
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
      
      // Fetch tournament first
      const tournamentRes = await axios.get(`${API}/tournaments/${tournamentId}`);
      console.log('Tournament data:', tournamentRes.data);
      setTournament(tournamentRes.data);
      
      // Fetch teams
      const teamsRes = await axios.get(`${API}/teams`);
      console.log('Teams loaded:', teamsRes.data.length);
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
      
      // Only fetch current team if auction is active
      if (tournamentRes.data.status === 'auction_active') {
        await fetchCurrentTeam(teamsRes.data);
      }
      
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      alert('Failed to load auction data. Please try again.');
    }
  };

  const fetchCurrentTeam = async () => {
    try {
      const response = await axios.get(`${API}/tournaments/${tournamentId}`);
      const tournament = response.data;
      
      if (tournament.current_team_id) {
        const team = teams.find(t => t.id === tournament.current_team_id);
        setCurrentTeam(team);
        
        // Get current highest bid
        const bidsResponse = await axios.get(`${API}/tournaments/${tournamentId}/bids`);
        const teamBids = bidsResponse.data.filter(bid => bid.team_id === tournament.current_team_id);
        if (teamBids.length > 0) {
          const highestBid = teamBids.reduce((max, bid) => bid.amount > max.amount ? bid : max);
          const bidder = participants.find(p => p.id === highestBid.user_id);
          setCurrentBid({
            amount: highestBid.amount,
            username: bidder?.username || 'Unknown'
          });
        } else {
          setCurrentBid(null);
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
      }
    } catch (error) {
      console.error('Failed to fetch current team:', error);
    }
  };

  const fetchSquads = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll use placeholder data
      setSquads([]);
    } catch (error) {
      console.error('Failed to fetch squads:', error);
    }
  };

  const placeBid = async () => {
    if (!bidAmount || !currentTeam) return;
    
    const amount = parseInt(bidAmount) * 1000000; // Convert to pence
    
    try {
      await axios.post(`${API}/tournaments/${tournamentId}/bid?user_id=${user.id}&amount=${amount}`);
      setBidAmount('');
    } catch (error) {
      alert('Bid failed: ' + error.response?.data?.detail);
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
  if (!currentTeam) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h1 className="text-3xl font-bold mb-4">{tournament.name} - Live Auction</h1>
            <div className="text-xl text-green-400 mb-4">Auction is Active!</div>
            <p className="text-gray-400 mb-6">Preparing next team for bidding...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Auction Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Team */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Current Team</h2>
              <div className="bg-gray-700 p-6 rounded-lg text-center">
                <h3 className="text-3xl font-bold mb-2">{currentTeam.name}</h3>
                <p className="text-gray-400 mb-4">{currentTeam.country}</p>
                
                {currentBid ? (
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(currentBid.amount)}</div>
                    <div className="text-sm text-gray-400">Current highest bid by {currentBid.username}</div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-xl text-gray-400">No bids yet</div>
                  </div>
                )}
                
                <div className="flex gap-2 items-center justify-center">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min: £${(minimumBid / 1000000).toFixed(0)}m`}
                    className="flex-1 p-3 bg-gray-600 border border-gray-500 rounded-lg text-center"
                    min={minimumBid / 1000000}
                  />
                  <button
                    onClick={placeBid}
                    disabled={!bidAmount || timeRemaining === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Bid £{bidAmount || '0'}m
                  </button>
                </div>
              </div>
            </div>

            {/* Participants Status */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {participants.map(participant => (
                  <div key={participant.id} className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="font-bold">{participant.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="font-medium text-sm">{participant.username}</div>
                    <div className="text-xs text-gray-400">£450m left</div> {/* Placeholder */}
                    <div className="text-xs text-gray-400">0/4 teams</div> {/* Placeholder */}
                  </div>
                ))}
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