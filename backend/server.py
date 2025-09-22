from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
import random
import string
from ryder_cup_players import RYDER_CUP_PLAYERS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

def generate_join_code():
    """Generate a unique 6-character join code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

async def ensure_unique_join_code(db):
    """Ensure the generated join code is unique"""
    while True:
        code = generate_join_code()
        existing = await db.tournaments.find_one({"join_code": code})
        if not existing:
            return code

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Friends of PIFA API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, tournament_id: str):
        await websocket.accept()
        if tournament_id not in self.active_connections:
            self.active_connections[tournament_id] = []
        self.active_connections[tournament_id].append(websocket)

    def disconnect(self, websocket: WebSocket, tournament_id: str):
        if tournament_id in self.active_connections:
            self.active_connections[tournament_id].remove(websocket)

    async def broadcast_to_tournament(self, tournament_id: str, message: dict):
        if tournament_id in self.active_connections:
            for connection in self.active_connections[tournament_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    pass

manager = ConnectionManager()

# Enums
class TournamentStatus(str, Enum):
    PENDING = "pending"
    AUCTION_ACTIVE = "auction_active"
    TOURNAMENT_ACTIVE = "tournament_active"
    COMPLETED = "completed"

class CompetitionType(str, Enum):
    CHAMPIONS_LEAGUE = "champions_league"
    EUROPA_LEAGUE = "europa_league"
    RYDER_CUP = "ryder_cup"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str
    email: str

class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    competition: CompetitionType
    logo_url: Optional[str] = None

class Tournament(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    admin_id: str
    competition_type: CompetitionType
    status: TournamentStatus = TournamentStatus.PENDING
    budget_per_user: int = 500_000_000  # £500m in pence
    teams_per_user: int
    minimum_bid: int = 1_000_000  # £1m in pence
    auction_start_time: Optional[datetime] = None
    entry_fee: int = 0  # in pence
    prize_pool: int = 0  # in pence
    current_team_id: Optional[str] = None
    bid_end_time: Optional[datetime] = None
    participants: List[str] = []
    teams: List[str] = []
    join_code: str = Field(default="")  # 6-character join code
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TournamentCreate(BaseModel):
    name: str
    competition_type: CompetitionType
    teams_per_user: int
    minimum_bid: int = 1_000_000
    entry_fee: int = 0
    auction_start_time: Optional[datetime] = None

class Bid(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tournament_id: str
    user_id: str
    team_id: str
    amount: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Squad(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tournament_id: str
    user_id: str
    teams: List[str] = []
    total_spent: int = 0
    current_points: int = 0

class Match(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    team_id: str
    opponent: str
    goals_scored: int
    goals_conceded: int
    result: str  # "win", "draw", "loss"
    match_date: datetime
    competition: CompetitionType

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tournament_id: str
    user_id: str
    username: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatMessageCreate(BaseModel):
    message: str

# Sample teams data for Champions League and Europa League 2025/2026
CHAMPIONS_LEAGUE_TEAMS = [
    {"name": "Real Madrid", "country": "Spain"},
    {"name": "Manchester City", "country": "England"},
    {"name": "Bayern Munich", "country": "Germany"},
    {"name": "Paris Saint-Germain", "country": "France"},
    {"name": "Liverpool", "country": "England"},
    {"name": "Chelsea", "country": "England"},
    {"name": "Barcelona", "country": "Spain"},
    {"name": "Juventus", "country": "Italy"},
    {"name": "AC Milan", "country": "Italy"},
    {"name": "Inter Milan", "country": "Italy"},
    {"name": "Atletico Madrid", "country": "Spain"},
    {"name": "Borussia Dortmund", "country": "Germany"},
    {"name": "Arsenal", "country": "England"},
    {"name": "Manchester United", "country": "England"},
    {"name": "Tottenham", "country": "England"},
    {"name": "Napoli", "country": "Italy"},
    {"name": "AS Roma", "country": "Italy"},
    {"name": "Sevilla", "country": "Spain"},
    {"name": "Ajax", "country": "Netherlands"},
    {"name": "Porto", "country": "Portugal"},
    {"name": "Benfica", "country": "Portugal"},
    {"name": "RB Leipzig", "country": "Germany"},
    {"name": "Bayer Leverkusen", "country": "Germany"},
    {"name": "Atalanta", "country": "Italy"},
    {"name": "Sporting CP", "country": "Portugal"},
    {"name": "PSV Eindhoven", "country": "Netherlands"},
    {"name": "Club Brugge", "country": "Belgium"},
    {"name": "Celtic", "country": "Scotland"},
    {"name": "Shakhtar Donetsk", "country": "Ukraine"},
    {"name": "Red Star Belgrade", "country": "Serbia"},
    {"name": "Young Boys", "country": "Switzerland"},
    {"name": "Salzburg", "country": "Austria"}
]

EUROPA_LEAGUE_TEAMS = [
    {"name": "Villarreal", "country": "Spain"},
    {"name": "West Ham United", "country": "England"},
    {"name": "Leicester City", "country": "England"},
    {"name": "Real Sociedad", "country": "Spain"},
    {"name": "Real Betis", "country": "Spain"},
    {"name": "Eintracht Frankfurt", "country": "Germany"},
    {"name": "Lyon", "country": "France"},
    {"name": "Marseille", "country": "France"},
    {"name": "AS Monaco", "country": "France"},
    {"name": "Lazio", "country": "Italy"},
    {"name": "Fiorentina", "country": "Italy"},
    {"name": "Brighton", "country": "England"},
    {"name": "Newcastle United", "country": "England"},
    {"name": "Aston Villa", "country": "England"},
    {"name": "Rangers", "country": "Scotland"},
    {"name": "Galatasaray", "country": "Turkey"},
    {"name": "Fenerbahce", "country": "Turkey"},
    {"name": "Olympiacos", "country": "Greece"},
    {"name": "PAOK", "country": "Greece"},
    {"name": "Braga", "country": "Portugal"},
    {"name": "Vitoria Guimaraes", "country": "Portugal"},
    {"name": "Union Berlin", "country": "Germany"},
    {"name": "Freiburg", "country": "Germany"},
    {"name": "Slavia Prague", "country": "Czech Republic"},
    {"name": "Sparta Prague", "country": "Czech Republic"},
    {"name": "Dynamo Kiev", "country": "Ukraine"},
    {"name": "Maccabi Tel Aviv", "country": "Israel"},
    {"name": "Qarabag", "country": "Azerbaijan"},
    {"name": "Sheriff Tiraspol", "country": "Moldova"},
    {"name": "Ludogorets", "country": "Bulgaria"},
    {"name": "Molde", "country": "Norway"},
    {"name": "HJK Helsinki", "country": "Finland"}
]

# Initialize teams in database
async def initialize_teams():
    teams_collection = db.teams
    
    # Clear existing teams
    await teams_collection.delete_many({})
    
    # Add Champions League teams
    for team_data in CHAMPIONS_LEAGUE_TEAMS:
        team = Team(
            name=team_data["name"],
            country=team_data["country"],
            competition=CompetitionType.CHAMPIONS_LEAGUE
        )
        await teams_collection.insert_one(team.dict())
    
    # Add Europa League teams
    for team_data in EUROPA_LEAGUE_TEAMS:
        team = Team(
            name=team_data["name"],
            country=team_data["country"],
            competition=CompetitionType.EUROPA_LEAGUE
        )
        await teams_collection.insert_one(team.dict())

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Friends of PIFA API"}

# User routes
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        return User(**existing_user)
    
    user_obj = User(**user.dict())
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# Teams routes
@api_router.get("/teams", response_model=List[Team])
async def get_teams(competition: Optional[CompetitionType] = None):
    query = {}
    if competition:
        query["competition"] = competition
    teams = await db.teams.find(query).to_list(1000)
    return [Team(**team) for team in teams]

@api_router.post("/initialize-ryder-cup")
async def initialize_ryder_cup_players():
    """Initialize Ryder Cup players in the database"""
    
    # Check if players already exist
    existing_players = await db.teams.find({"competition": "ryder_cup"}).to_list(1000)
    if existing_players:
        return {
            "message": "Ryder Cup players already initialized", 
            "existing_count": len(existing_players)
        }
    
    # Insert all Ryder Cup players
    players_to_insert = []
    for player_data in RYDER_CUP_PLAYERS:
        player = Team(
            id=str(uuid.uuid4()),
            name=player_data["name"],
            country=player_data["country"],
            competition=player_data["competition"],
            # Store golf-specific data in a flexible way
            world_ranking=player_data.get("world_ranking"),
            team=player_data.get("team"),  # Europe or USA
            major_wins=player_data.get("major_wins", 0),
            ryder_cup_appearances=player_data.get("ryder_cup_appearances", 0)
        )
        players_to_insert.append(player.dict())
    
    await db.teams.insert_many(players_to_insert)
    
    return {
        "message": "Ryder Cup players initialized successfully",
        "players_added": len(players_to_insert)
    }

# Tournament routes
@api_router.post("/tournaments", response_model=Tournament)
async def create_tournament(tournament: TournamentCreate, admin_id: str):
    # Get teams based on competition type
    teams = await db.teams.find({"competition": tournament.competition_type}).to_list(1000)
    team_ids = [team["id"] for team in teams]
    
    # Generate unique join code
    join_code = await ensure_unique_join_code(db)
    
    tournament_obj = Tournament(
        **tournament.dict(),
        admin_id=admin_id,
        participants=[admin_id],
        teams=team_ids,
        join_code=join_code
    )
    await db.tournaments.insert_one(tournament_obj.dict())
    
    # Create squad for admin user
    admin_squad = Squad(tournament_id=tournament_obj.id, user_id=admin_id)
    await db.squads.insert_one(admin_squad.dict())
    
    return tournament_obj

@api_router.get("/tournaments", response_model=List[Tournament])
async def get_tournaments():
    tournaments = await db.tournaments.find().to_list(1000)
    return [Tournament(**tournament) for tournament in tournaments]

@api_router.get("/tournaments/{tournament_id}", response_model=Tournament)
async def get_tournament(tournament_id: str):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return Tournament(**tournament)

@api_router.post("/tournaments/{tournament_id}/join")
async def join_tournament(tournament_id: str, user_id: str):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    tournament_obj = Tournament(**tournament)
    if user_id in tournament_obj.participants:
        raise HTTPException(status_code=400, detail="Already joined")
    
    if len(tournament_obj.participants) >= 8:
        raise HTTPException(status_code=400, detail="Tournament full")
    
    tournament_obj.participants.append(user_id)
    tournament_obj.prize_pool += tournament_obj.entry_fee
    
    await db.tournaments.update_one(
        {"id": tournament_id},
        {"$set": tournament_obj.dict()}
    )
    
    # Create squad for user
    squad = Squad(tournament_id=tournament_id, user_id=user_id)
    await db.squads.insert_one(squad.dict())
    
    return {"message": "Joined tournament successfully"}

@api_router.post("/tournaments/join-by-code")
async def join_tournament_by_code(join_code: str, user_id: str):
    """Join tournament using a join code"""
    tournament = await db.tournaments.find_one({"join_code": join_code.upper()})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found with that join code")
    
    tournament_obj = Tournament(**tournament)
    if user_id in tournament_obj.participants:
        raise HTTPException(status_code=400, detail="Already joined")
    
    if len(tournament_obj.participants) >= 8:
        raise HTTPException(status_code=400, detail="Tournament full")
    
    tournament_obj.participants.append(user_id)
    tournament_obj.prize_pool += tournament_obj.entry_fee
    
    await db.tournaments.update_one(
        {"id": tournament_obj.id},
        {"$set": tournament_obj.dict()}
    )
    
    # Create squad for user
    squad = Squad(tournament_id=tournament_obj.id, user_id=user_id)
    await db.squads.insert_one(squad.dict())
    
    return {"message": "Joined tournament successfully", "tournament": tournament_obj}

@api_router.post("/tournaments/{tournament_id}/start-auction")
async def start_auction(tournament_id: str, admin_id: str):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    tournament_obj = Tournament(**tournament)
    if tournament_obj.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Only admin can start auction")
    
    if len(tournament_obj.participants) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 participants")
    
    # Randomly shuffle teams for auction
    random.shuffle(tournament_obj.teams)
    tournament_obj.status = TournamentStatus.AUCTION_ACTIVE
    tournament_obj.current_team_id = tournament_obj.teams[0] if tournament_obj.teams else None
    tournament_obj.bid_end_time = datetime.utcnow() + timedelta(minutes=2)  # 2 minutes per team
    
    await db.tournaments.update_one(
        {"id": tournament_id},
        {"$set": tournament_obj.dict()}
    )
    
    # Broadcast auction start
    await manager.broadcast_to_tournament(tournament_id, {
        "type": "auction_started",
        "current_team_id": tournament_obj.current_team_id,
        "bid_end_time": tournament_obj.bid_end_time.isoformat()
    })
    
    return {"message": "Auction started"}

# Bidding routes
@api_router.get("/tournaments/{tournament_id}/bids", response_model=List[Bid])
async def get_tournament_bids(tournament_id: str):
    bids = await db.bids.find({"tournament_id": tournament_id}).to_list(1000)
    return [Bid(**bid) for bid in bids]

@api_router.post("/tournaments/{tournament_id}/bid")
async def place_bid(tournament_id: str, user_id: str, amount: int):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    tournament_obj = Tournament(**tournament)
    if tournament_obj.status != TournamentStatus.AUCTION_ACTIVE:
        raise HTTPException(status_code=400, detail="Auction not active")
    
    if datetime.utcnow() > tournament_obj.bid_end_time:
        raise HTTPException(status_code=400, detail="Bidding time expired")
    
    if amount < tournament_obj.minimum_bid:
        raise HTTPException(status_code=400, detail="Bid too low")
    
    # Check user's budget
    squad = await db.squads.find_one({"tournament_id": tournament_id, "user_id": user_id})
    if not squad:
        raise HTTPException(status_code=404, detail="Squad not found")
    
    squad_obj = Squad(**squad)
    remaining_budget = tournament_obj.budget_per_user - squad_obj.total_spent
    remaining_teams = tournament_obj.teams_per_user - len(squad_obj.teams)
    
    if remaining_teams > 1:
        max_bid = remaining_budget - ((remaining_teams - 1) * tournament_obj.minimum_bid)
    else:
        max_bid = remaining_budget
    
    if amount > max_bid:
        raise HTTPException(status_code=400, detail="Insufficient budget")
    
    # Get current highest bid
    current_highest_bid = await db.bids.find_one(
        {"tournament_id": tournament_id, "team_id": tournament_obj.current_team_id},
        sort=[("amount", -1)]
    )
    
    if current_highest_bid and amount <= current_highest_bid["amount"]:
        raise HTTPException(status_code=400, detail="Bid must be higher than current highest")
    
    # Place bid
    bid = Bid(
        tournament_id=tournament_id,
        user_id=user_id,
        team_id=tournament_obj.current_team_id,
        amount=amount
    )
    await db.bids.insert_one(bid.dict())
    
    # Broadcast new bid
    user = await db.users.find_one({"id": user_id})
    await manager.broadcast_to_tournament(tournament_id, {
        "type": "new_bid",
        "team_id": tournament_obj.current_team_id,
        "amount": amount,
        "username": user["username"] if user else "Unknown"
    })
    
    return {"message": "Bid placed successfully"}

# Admin override route (for testing only)
@api_router.patch("/tournaments/{tournament_id}/admin")
async def update_tournament_admin(tournament_id: str, request_data: dict):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    new_admin_id = request_data.get("new_admin_id")
    if not new_admin_id:
        raise HTTPException(status_code=400, detail="new_admin_id required")
    
    # Update tournament admin
    await db.tournaments.update_one(
        {"id": tournament_id},
        {"$set": {"admin_id": new_admin_id}}
    )
    
    return {"message": "Tournament admin updated successfully"}

# Reset auction timer (for testing)
@api_router.post("/tournaments/{tournament_id}/reset-timer")
async def reset_auction_timer(tournament_id: str):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Reset the timer to 2 minutes from now
    new_end_time = datetime.utcnow() + timedelta(minutes=2)
    await db.tournaments.update_one(
        {"id": tournament_id},
        {"$set": {"bid_end_time": new_end_time}}
    )
    
    return {"message": "Auction timer reset", "new_bid_end_time": new_end_time.isoformat()}

@api_router.post("/tournaments/{tournament_id}/advance-team")
async def advance_to_next_team(tournament_id: str):
    """Advance auction to next team - handles timer expiry and unbid teams"""
    tournament_obj = await db.tournaments.find_one({"id": tournament_id})
    if not tournament_obj:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    if tournament_obj.get("status") != "auction_active":
        raise HTTPException(status_code=400, detail="Auction not active")
    
    current_team_id = tournament_obj.get("current_team_id")
    teams_list = tournament_obj.get("teams", [])
    
    if not current_team_id or not teams_list:
        raise HTTPException(status_code=400, detail="No teams to auction")
    
    # Check if current team received any bids
    current_bids = await db.bids.find({"tournament_id": tournament_id, "team_id": current_team_id}).to_list(1000)
    
    # If no bids, move team to end of queue for re-auction later
    if not current_bids:
        # Remove current team from current position and add to end
        if current_team_id in teams_list:
            teams_list.remove(current_team_id)
            teams_list.append(current_team_id)
            print(f"Team {current_team_id} had no bids - moved to end of queue")
    
    # Find next team
    try:
        current_index = teams_list.index(current_team_id) if current_team_id in teams_list else -1
        next_index = (current_index + 1) % len(teams_list)
        next_team_id = teams_list[next_index]
        
        # If we've cycled back to a team that was already auctioned with bids, auction is complete
        if next_index == 0 and current_bids:
            # Check if all teams have been bid on at least once
            all_teams_bid = True
            for team_id in teams_list:
                team_bids = await db.bids.find({"tournament_id": tournament_id, "team_id": team_id}).to_list(1)
                if not team_bids:
                    all_teams_bid = False
                    break
            
            if all_teams_bid:
                # End auction
                await db.tournaments.update_one(
                    {"id": tournament_id},
                    {"$set": {
                        "status": "completed",
                        "current_team_id": None,
                        "bid_end_time": None
                    }}
                )
                return {"message": "Auction completed", "status": "completed"}
        
        # Move to next team
        new_end_time = datetime.utcnow() + timedelta(minutes=2)
        await db.tournaments.update_one(
            {"id": tournament_id},
            {"$set": {
                "current_team_id": next_team_id,
                "bid_end_time": new_end_time,
                "teams": teams_list  # Update teams list in case we moved unbid team to end
            }}
        )
        
        return {
            "message": "Advanced to next team",
            "current_team_id": next_team_id,
            "new_bid_end_time": new_end_time.isoformat(),
            "had_bids": len(current_bids) > 0
        }
        
    except (ValueError, IndexError):
        raise HTTPException(status_code=400, detail="Error advancing to next team")

@api_router.post("/tournaments/{tournament_id}/fix-team-ids")
async def fix_tournament_team_ids(tournament_id: str):
    """Fix tournament team IDs to use actual teams from database"""
    tournament_obj = await db.tournaments.find_one({"id": tournament_id})
    if not tournament_obj:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    # Get actual teams from database
    teams = await db.teams.find({"competition": tournament_obj.get("competition_type", "champions_league")}).to_list(1000)
    valid_team_ids = [team["id"] for team in teams]
    
    if not valid_team_ids:
        raise HTTPException(status_code=400, detail="No teams found in database")
    
    # Update tournament with correct team IDs
    import random
    random.shuffle(valid_team_ids)
    
    # Reset tournament state with valid team IDs
    update_data = {
        "teams": valid_team_ids,
        "current_team_id": valid_team_ids[0] if valid_team_ids else None,
        "status": "auction_active",
        "bid_end_time": datetime.utcnow() + timedelta(minutes=2)
    }
    
    await db.tournaments.update_one(
        {"id": tournament_id},
        {"$set": update_data}
    )
    
    return {
        "message": "Tournament team IDs fixed",
        "teams_count": len(valid_team_ids),
        "current_team_id": valid_team_ids[0] if valid_team_ids else None,
        "new_bid_end_time": update_data["bid_end_time"].isoformat()
    }

# Squad routes
@api_router.get("/tournaments/{tournament_id}/squads", response_model=List[Squad])
async def get_tournament_squads(tournament_id: str):
    squads = await db.squads.find({"tournament_id": tournament_id}).to_list(1000)
    return [Squad(**squad) for squad in squads]

@api_router.get("/tournaments/{tournament_id}/squads/{user_id}", response_model=Squad)
async def get_user_squad(tournament_id: str, user_id: str):
    squad = await db.squads.find_one({"tournament_id": tournament_id, "user_id": user_id})
    if not squad:
        raise HTTPException(status_code=404, detail="Squad not found")
    return Squad(**squad)

# Chat routes
@api_router.post("/tournaments/{tournament_id}/chat")
async def send_chat_message(tournament_id: str, user_id: str, message_data: ChatMessageCreate):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    message = ChatMessage(
        tournament_id=tournament_id,
        user_id=user_id,
        username=user["username"],
        message=message_data.message
    )
    await db.chat_messages.insert_one(message.dict())
    
    # Broadcast message
    await manager.broadcast_to_tournament(tournament_id, {
        "type": "chat_message",
        "username": user["username"],
        "message": message_data.message,
        "timestamp": message.timestamp.isoformat()
    })
    
    return {"message": "Message sent"}

@api_router.get("/tournaments/{tournament_id}/chat", response_model=List[ChatMessage])
async def get_chat_messages(tournament_id: str):
    messages = await db.chat_messages.find(
        {"tournament_id": tournament_id}
    ).sort("timestamp", 1).to_list(1000)
    return [ChatMessage(**message) for message in messages]

# WebSocket endpoint
@app.websocket("/ws/{tournament_id}")
async def websocket_endpoint(websocket: WebSocket, tournament_id: str):
    await manager.connect(websocket, tournament_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, tournament_id)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await initialize_teams()
    logger.info("Teams initialized")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()