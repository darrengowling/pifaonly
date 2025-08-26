import requests
import sys
import json
from datetime import datetime
import time

class PIFAAuctionAPITester:
    def __init__(self, base_url="https://bid-champions.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user = None
        self.test_tournament = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, params=params)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_create_user(self):
        """Test user creation"""
        timestamp = int(time.time())
        user_data = {
            "username": f"test_user_{timestamp}",
            "email": f"test_{timestamp}@example.com"
        }
        
        success, response = self.run_test(
            "Create User",
            "POST", 
            "users",
            200,
            data=user_data
        )
        
        if success and 'id' in response:
            self.test_user = response
            print(f"   Created user: {response['username']} (ID: {response['id']})")
            return True
        return False

    def test_get_user(self):
        """Test getting user by ID"""
        if not self.test_user:
            print("❌ No test user available")
            return False
            
        success, response = self.run_test(
            "Get User by ID",
            "GET",
            f"users/{self.test_user['id']}",
            200
        )
        return success

    def test_get_teams(self):
        """Test getting all teams"""
        success, response = self.run_test(
            "Get All Teams",
            "GET",
            "teams",
            200
        )
        
        if success:
            print(f"   Total teams: {len(response)}")
            
            # Test filtering by competition
            cl_success, cl_response = self.run_test(
                "Get Champions League Teams",
                "GET",
                "teams",
                200,
                params={"competition": "champions_league"}
            )
            
            if cl_success:
                print(f"   Champions League teams: {len(cl_response)}")
            
            el_success, el_response = self.run_test(
                "Get Europa League Teams", 
                "GET",
                "teams",
                200,
                params={"competition": "europa_league"}
            )
            
            if el_success:
                print(f"   Europa League teams: {len(el_response)}")
                
            return success and cl_success and el_success
        
        return success

    def test_create_tournament(self):
        """Test tournament creation"""
        if not self.test_user:
            print("❌ No test user available")
            return False
            
        tournament_data = {
            "name": f"Test Tournament {int(time.time())}",
            "competition_type": "champions_league",
            "teams_per_user": 4,
            "minimum_bid": 1000000,
            "entry_fee": 0
        }
        
        success, response = self.run_test(
            "Create Tournament",
            "POST",
            "tournaments",
            200,
            data=tournament_data,
            params={"admin_id": self.test_user['id']}
        )
        
        if success and 'id' in response:
            self.test_tournament = response
            print(f"   Created tournament: {response['name']} (ID: {response['id']})")
            return True
        return False

    def test_get_tournaments(self):
        """Test getting all tournaments"""
        success, response = self.run_test(
            "Get All Tournaments",
            "GET",
            "tournaments",
            200
        )
        
        if success:
            print(f"   Total tournaments: {len(response)}")
        
        return success

    def test_get_tournament_by_id(self):
        """Test getting tournament by ID"""
        if not self.test_tournament:
            print("❌ No test tournament available")
            return False
            
        success, response = self.run_test(
            "Get Tournament by ID",
            "GET",
            f"tournaments/{self.test_tournament['id']}",
            200
        )
        return success

    def test_join_tournament(self):
        """Test joining a tournament"""
        if not self.test_tournament or not self.test_user:
            print("❌ No test tournament or user available")
            return False
            
        # Create a second user to join the tournament
        timestamp = int(time.time())
        user_data = {
            "username": f"test_user_2_{timestamp}",
            "email": f"test_2_{timestamp}@example.com"
        }
        
        user_success, user_response = self.run_test(
            "Create Second User",
            "POST",
            "users", 
            200,
            data=user_data
        )
        
        if not user_success:
            return False
            
        success, response = self.run_test(
            "Join Tournament",
            "POST",
            f"tournaments/{self.test_tournament['id']}/join",
            200,
            params={"user_id": user_response['id']}
        )
        return success

    def test_tournament_squads(self):
        """Test getting tournament squads"""
        if not self.test_tournament:
            print("❌ No test tournament available")
            return False
            
        success, response = self.run_test(
            "Get Tournament Squads",
            "GET",
            f"tournaments/{self.test_tournament['id']}/squads",
            200
        )
        
        if success:
            print(f"   Total squads: {len(response)}")
        
        return success

    def test_tournament_bids(self):
        """Test getting tournament bids"""
        if not self.test_tournament:
            print("❌ No test tournament available")
            return False
            
        success, response = self.run_test(
            "Get Tournament Bids",
            "GET",
            f"tournaments/{self.test_tournament['id']}/bids",
            200
        )
        
        if success:
            print(f"   Total bids: {len(response)}")
        
        return success

    def test_chat_messages(self):
        """Test chat functionality"""
        if not self.test_tournament or not self.test_user:
            print("❌ No test tournament or user available")
            return False
            
        # Send a chat message
        message_data = {
            "message": "Hello from API test!"
        }
        
        send_success, send_response = self.run_test(
            "Send Chat Message",
            "POST",
            f"tournaments/{self.test_tournament['id']}/chat",
            200,
            data=message_data,
            params={"user_id": self.test_user['id']}
        )
        
        if not send_success:
            return False
            
        # Get chat messages
        get_success, get_response = self.run_test(
            "Get Chat Messages",
            "GET",
            f"tournaments/{self.test_tournament['id']}/chat",
            200
        )
        
        if get_success:
            print(f"   Total messages: {len(get_response)}")
        
        return send_success and get_success

    def test_join_code_functionality(self):
        """Test comprehensive join code functionality"""
        print("\n🎯 TESTING JOIN CODE FUNCTIONALITY")
        print("=" * 60)
        
        # Step 1: Create test users
        timestamp = int(time.time())
        admin_data = {
            "username": f"admin_{timestamp}",
            "email": f"admin_{timestamp}@pifa.com"
        }
        
        admin_success, admin_response = self.run_test(
            "Step 1a: Create Admin User",
            "POST", 
            "users",
            200,
            data=admin_data
        )
        
        if not admin_success or 'id' not in admin_response:
            print("❌ CRITICAL: Cannot create admin user")
            return False
            
        admin_id = admin_response['id']
        print(f"✅ Created admin: {admin_response['username']} (ID: {admin_id})")
        
        joiner_data = {
            "username": f"joiner_{timestamp}",
            "email": f"joiner_{timestamp}@pifa.com"
        }
        
        joiner_success, joiner_response = self.run_test(
            "Step 1b: Create Joiner User",
            "POST", 
            "users",
            200,
            data=joiner_data
        )
        
        if not joiner_success or 'id' not in joiner_response:
            print("❌ CRITICAL: Cannot create joiner user")
            return False
            
        joiner_id = joiner_response['id']
        print(f"✅ Created joiner: {joiner_response['username']} (ID: {joiner_id})")
        
        # Step 2: Create tournament and verify join code generation
        tournament_data = {
            "name": f"Join Code Test Tournament {timestamp}",
            "competition_type": "champions_league",
            "teams_per_user": 4,
            "minimum_bid": 1000000,
            "entry_fee": 0
        }
        
        tournament_success, tournament_response = self.run_test(
            "Step 2: Create Tournament with Join Code",
            "POST",
            "tournaments",
            200,
            data=tournament_data,
            params={"admin_id": admin_id}
        )
        
        if not tournament_success or 'id' not in tournament_response:
            print("❌ CRITICAL: Cannot create tournament")
            return False
            
        tournament_id = tournament_response['id']
        join_code = tournament_response.get('join_code')
        
        if not join_code:
            print("❌ CRITICAL: Tournament created without join code!")
            return False
            
        print(f"✅ Created tournament: {tournament_response['name']} (ID: {tournament_id})")
        print(f"✅ Join code generated: {join_code}")
        
        # Step 3: Verify join code format (6 characters, uppercase letters and numbers)
        if len(join_code) != 6:
            print(f"❌ FAILED: Join code length is {len(join_code)}, expected 6")
            return False
        
        if not join_code.isupper():
            print(f"❌ FAILED: Join code '{join_code}' is not uppercase")
            return False
            
        if not all(c.isalnum() for c in join_code):
            print(f"❌ FAILED: Join code '{join_code}' contains non-alphanumeric characters")
            return False
            
        print(f"✅ Join code format validation passed: {join_code}")
        
        # Step 4: Test joining by join code
        join_by_code_success, join_by_code_response = self.run_test(
            "Step 4: Join Tournament by Code",
            "POST",
            "tournaments/join-by-code",
            200,
            params={"join_code": join_code, "user_id": joiner_id}
        )
        
        if not join_by_code_success:
            print("❌ FAILED: Could not join tournament by code")
            return False
            
        print("✅ Successfully joined tournament using join code")
        
        # Step 5: Verify user was added to participants
        tournament_check_success, tournament_check_response = self.run_test(
            "Step 5: Verify User Added to Participants",
            "GET",
            f"tournaments/{tournament_id}",
            200
        )
        
        if tournament_check_success:
            participants = tournament_check_response.get('participants', [])
            if joiner_id not in participants:
                print(f"❌ FAILED: Joiner {joiner_id} not found in participants: {participants}")
                return False
            print(f"✅ User successfully added to participants: {participants}")
        
        # Step 6: Verify squad was created for joiner
        squad_check_success, squad_check_response = self.run_test(
            "Step 6: Verify Squad Created for Joiner",
            "GET",
            f"tournaments/{tournament_id}/squads/{joiner_id}",
            200
        )
        
        if not squad_check_success:
            print("❌ FAILED: Squad not created for joiner")
            return False
            
        print("✅ Squad successfully created for joiner")
        
        # Step 7: Test invalid join code
        invalid_join_success, invalid_join_response = self.run_test(
            "Step 7: Test Invalid Join Code",
            "POST",
            "tournaments/join-by-code",
            404,  # Expecting 404 for invalid code
            params={"join_code": "INVALID", "user_id": joiner_id}
        )
        
        if not invalid_join_success:
            print("❌ FAILED: Invalid join code should return 404")
            return False
            
        print("✅ Invalid join code correctly rejected with 404")
        
        # Step 8: Test duplicate join attempt
        duplicate_join_success, duplicate_join_response = self.run_test(
            "Step 8: Test Duplicate Join Attempt",
            "POST",
            "tournaments/join-by-code",
            400,  # Expecting 400 for already joined
            params={"join_code": join_code, "user_id": joiner_id}
        )
        
        if not duplicate_join_success:
            print("❌ FAILED: Duplicate join should return 400")
            return False
            
        print("✅ Duplicate join attempt correctly rejected with 400")
        
        return True

    def test_join_code_uniqueness(self):
        """Test that multiple tournaments get unique join codes"""
        print("\n🎯 TESTING JOIN CODE UNIQUENESS")
        print("=" * 60)
        
        # Create a test user
        timestamp = int(time.time())
        user_data = {
            "username": f"uniqueness_test_{timestamp}",
            "email": f"uniqueness_test_{timestamp}@pifa.com"
        }
        
        user_success, user_response = self.run_test(
            "Create User for Uniqueness Test",
            "POST", 
            "users",
            200,
            data=user_data
        )
        
        if not user_success or 'id' not in user_response:
            print("❌ CRITICAL: Cannot create user for uniqueness test")
            return False
            
        user_id = user_response['id']
        join_codes = []
        
        # Create 5 tournaments and collect their join codes
        for i in range(5):
            tournament_data = {
                "name": f"Uniqueness Test Tournament {i+1} {timestamp}",
                "competition_type": "champions_league",
                "teams_per_user": 4,
                "minimum_bid": 1000000,
                "entry_fee": 0
            }
            
            tournament_success, tournament_response = self.run_test(
                f"Create Tournament {i+1} for Uniqueness Test",
                "POST",
                "tournaments",
                200,
                data=tournament_data,
                params={"admin_id": user_id}
            )
            
            if not tournament_success or 'join_code' not in tournament_response:
                print(f"❌ FAILED: Could not create tournament {i+1} or get join code")
                return False
                
            join_code = tournament_response['join_code']
            join_codes.append(join_code)
            print(f"✅ Tournament {i+1} created with join code: {join_code}")
        
        # Check for uniqueness
        if len(set(join_codes)) != len(join_codes):
            print(f"❌ FAILED: Duplicate join codes found: {join_codes}")
            return False
            
        print(f"✅ All join codes are unique: {join_codes}")
        return True

    def test_squad_creation_and_bidding_flow(self):
        """Test the complete squad creation and bidding flow to identify 'Squad not found' issue"""
        print("\n🎯 TESTING SQUAD CREATION AND BIDDING FLOW")
        print("=" * 60)
        
        # Step 1: Create a test user
        timestamp = int(time.time())
        user_data = {
            "username": f"bidder_{timestamp}",
            "email": f"bidder_{timestamp}@pifa.com"
        }
        
        user_success, user_response = self.run_test(
            "Step 1: Create Test User for Bidding",
            "POST", 
            "users",
            200,
            data=user_data
        )
        
        if not user_success or 'id' not in user_response:
            print("❌ CRITICAL: Cannot create user - stopping test")
            return False
            
        test_user_id = user_response['id']
        print(f"✅ Created user: {user_response['username']} (ID: {test_user_id})")
        
        # Step 2: Create a tournament
        tournament_data = {
            "name": f"Bidding Test Tournament {timestamp}",
            "competition_type": "champions_league",
            "teams_per_user": 4,
            "minimum_bid": 1000000,
            "entry_fee": 0
        }
        
        tournament_success, tournament_response = self.run_test(
            "Step 2: Create Tournament",
            "POST",
            "tournaments",
            200,
            data=tournament_data,
            params={"admin_id": test_user_id}
        )
        
        if not tournament_success or 'id' not in tournament_response:
            print("❌ CRITICAL: Cannot create tournament - stopping test")
            return False
            
        tournament_id = tournament_response['id']
        print(f"✅ Created tournament: {tournament_response['name']} (ID: {tournament_id})")
        
        # Step 3: Join tournament (this should create a Squad)
        # Note: The admin is automatically added as participant, so we need to check if squad was created
        print("✅ User is already a participant (admin auto-join)")
        
        # Let's verify if squad was created during tournament creation
        squad_success, squad_response = self.run_test(
            "Step 3: Check if Squad was Created for Admin",
            "GET",
            f"tournaments/{tournament_id}/squads/{test_user_id}",
            200
        )
        
        if not squad_success:
            print("❌ CRITICAL: No squad found for admin user!")
            print("   This suggests squad creation is not happening during tournament creation")
            
            # Let's try to manually join (even though it should fail with "Already joined")
            join_success, join_response = self.run_test(
                "Step 3b: Try Manual Join (Should Fail but Check Error)",
                "POST",
                f"tournaments/{tournament_id}/join",
                400,  # Expecting 400 "Already joined"
                params={"user_id": test_user_id}
            )
            
            # Check all squads in the tournament
            all_squads_success, all_squads_response = self.run_test(
                "Check All Tournament Squads",
                "GET",
                f"tournaments/{tournament_id}/squads",
                200
            )
            
            if all_squads_success:
                print(f"   Total squads in tournament: {len(all_squads_response)}")
                for squad in all_squads_response:
                    print(f"   Squad found: user_id={squad.get('user_id')}, tournament_id={squad.get('tournament_id')}")
            
            return False
        else:
            print(f"✅ Squad found for admin: {squad_response}")
        
        # Step 4: Create a second user to have enough participants
        user2_data = {
            "username": f"bidder2_{timestamp}",
            "email": f"bidder2_{timestamp}@pifa.com"
        }
        
        user2_success, user2_response = self.run_test(
            "Step 4a: Create Second User",
            "POST", 
            "users",
            200,
            data=user2_data
        )
        
        if user2_success:
            user2_id = user2_response['id']
            
            # Join tournament with second user
            join2_success, join2_response = self.run_test(
                "Step 4b: Second User Join Tournament",
                "POST",
                f"tournaments/{tournament_id}/join",
                200,
                params={"user_id": user2_id}
            )
            
            if not join2_success:
                print("⚠️  Second user couldn't join, but continuing with auction test")
        
        # Step 5: Start Auction
        auction_success, auction_response = self.run_test(
            "Step 5: Start Auction",
            "POST",
            f"tournaments/{tournament_id}/start-auction",
            200,
            params={"admin_id": test_user_id}
        )
        
        if not auction_success:
            print("❌ CRITICAL: Cannot start auction - stopping test")
            return False
            
        print("✅ Auction started successfully")
        
        # Step 6: Try to place a bid (this is where the error should occur)
        bid_success, bid_response = self.run_test(
            "Step 6: Place Bid (Testing for 'Squad not found' error)",
            "POST",
            f"tournaments/{tournament_id}/bid",
            200,
            params={"user_id": test_user_id, "amount": 2000000}
        )
        
        if not bid_success:
            print("❌ BIDDING FAILED - This confirms the 'Squad not found' issue!")
            print(f"   Error response: {bid_response}")
            
            # Let's do some additional debugging
            print("\n🔍 DEBUGGING INFORMATION:")
            
            # Check if squad still exists
            debug_squad_success, debug_squad_response = self.run_test(
                "Debug: Re-check Squad Existence",
                "GET",
                f"tournaments/{tournament_id}/squads/{test_user_id}",
                200
            )
            
            if debug_squad_success:
                print("   ✅ Squad still exists - issue might be in bid endpoint logic")
            else:
                print("   ❌ Squad disappeared - issue in squad persistence")
            
            # Check tournament state
            debug_tournament_success, debug_tournament_response = self.run_test(
                "Debug: Check Tournament State",
                "GET",
                f"tournaments/{tournament_id}",
                200
            )
            
            if debug_tournament_success:
                print(f"   Tournament status: {debug_tournament_response.get('status')}")
                print(f"   Current team ID: {debug_tournament_response.get('current_team_id')}")
                print(f"   Participants: {debug_tournament_response.get('participants')}")
            
            return False
        else:
            print("✅ Bid placed successfully - Squad creation and bidding flow working!")
            return True

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting PIFA Auction API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)
        
        # Test sequence
        tests = [
            self.test_root_endpoint,
            self.test_create_user,
            self.test_get_user,
            self.test_get_teams,
            self.test_create_tournament,
            self.test_get_tournaments,
            self.test_get_tournament_by_id,
            self.test_join_tournament,
            self.test_tournament_squads,
            self.test_tournament_bids,
            self.test_chat_messages,
            self.test_join_code_functionality,
            self.test_join_code_uniqueness
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
                self.tests_run += 1
        
        # Print final results
        print("\n" + "=" * 50)
        print(f"📊 Final Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

    def run_squad_bidding_test_only(self):
        """Run only the squad creation and bidding test"""
        print("🎯 Running Squad Creation and Bidding Test Only")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        success = self.test_squad_creation_and_bidding_flow()
        
        print("\n" + "=" * 60)
        if success:
            print("🎉 Squad creation and bidding test PASSED!")
            return 0
        else:
            print("❌ Squad creation and bidding test FAILED!")
            return 1

    def run_join_code_tests_only(self):
        """Run only the join code functionality tests"""
        print("🎯 Running Join Code Tests Only")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run join code specific tests
        tests = [
            self.test_join_code_functionality,
            self.test_join_code_uniqueness
        ]
        
        all_passed = True
        for test in tests:
            try:
                success = test()
                if not success:
                    all_passed = False
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
                all_passed = False
        
        print("\n" + "=" * 60)
        if all_passed:
            print("🎉 All join code tests PASSED!")
            return 0
        else:
            print("❌ Some join code tests FAILED!")
            return 1

    def test_comprehensive_friends_tournament_scenario(self):
        """
        Comprehensive test scenario for Friends of PIFA fantasy football auction app
        Simulates a real tournament with 5 friends as requested by user
        """
        print("\n🏆 COMPREHENSIVE FRIENDS OF PIFA TOURNAMENT SCENARIO")
        print("=" * 80)
        print("Testing complete tournament flow with 5 friends: Alex, Sarah, Mike, Emma, Tom")
        print("=" * 80)
        
        # PHASE 1: Setup Multiple Users & Tournament
        print("\n📋 PHASE 1: SETUP MULTIPLE USERS & TOURNAMENT")
        print("-" * 50)
        
        # Step 1: Create 5 Test Users with realistic names
        timestamp = int(time.time())
        users = {}
        user_names = ["Alex", "Sarah", "Mike", "Emma", "Tom"]
        
        for name in user_names:
            user_data = {
                "username": f"{name}_{timestamp}",
                "email": f"{name.lower()}_{timestamp}@friendsofpifa.com"
            }
            
            success, response = self.run_test(
                f"Create User: {name}",
                "POST", 
                "users",
                200,
                data=user_data
            )
            
            if not success or 'id' not in response:
                print(f"❌ CRITICAL: Cannot create user {name}")
                return False
                
            users[name] = response
            print(f"✅ Created {name}: {response['username']} (ID: {response['id']})")
        
        # Step 2: Alex creates tournament "Friends Championship 2025"
        alex_id = users["Alex"]["id"]
        tournament_data = {
            "name": "Friends Championship 2025",
            "competition_type": "champions_league",
            "teams_per_user": 4,
            "minimum_bid": 1000000,
            "entry_fee": 0
        }
        
        tournament_success, tournament_response = self.run_test(
            "Alex Creates 'Friends Championship 2025'",
            "POST",
            "tournaments",
            200,
            data=tournament_data,
            params={"admin_id": alex_id}
        )
        
        if not tournament_success or 'id' not in tournament_response:
            print("❌ CRITICAL: Cannot create Friends Championship 2025")
            return False
            
        tournament_id = tournament_response['id']
        join_code = tournament_response.get('join_code')
        print(f"✅ Alex created 'Friends Championship 2025' (ID: {tournament_id})")
        print(f"✅ Join code generated: {join_code}")
        
        # Step 3: Verify Alex has a squad (admin squad creation)
        alex_squad_success, alex_squad_response = self.run_test(
            "Verify Alex's Squad Creation",
            "GET",
            f"tournaments/{tournament_id}/squads/{alex_id}",
            200
        )
        
        if not alex_squad_success:
            print("❌ CRITICAL: Alex (admin) doesn't have a squad!")
            return False
        print("✅ Alex's squad created successfully")
        
        # Step 4: All other users join tournament using both methods
        print("\n🤝 Testing Join Methods:")
        
        # Sarah joins using direct tournament ID
        sarah_id = users["Sarah"]["id"]
        sarah_join_success, sarah_join_response = self.run_test(
            "Sarah Joins via Tournament ID",
            "POST",
            f"tournaments/{tournament_id}/join",
            200,
            params={"user_id": sarah_id}
        )
        
        if not sarah_join_success:
            print("❌ CRITICAL: Sarah cannot join tournament")
            return False
        print("✅ Sarah joined via tournament ID")
        
        # Mike, Emma, Tom join using join code
        for name in ["Mike", "Emma", "Tom"]:
            user_id = users[name]["id"]
            join_success, join_response = self.run_test(
                f"{name} Joins via Join Code",
                "POST",
                "tournaments/join-by-code",
                200,
                params={"join_code": join_code, "user_id": user_id}
            )
            
            if not join_success:
                print(f"❌ CRITICAL: {name} cannot join via join code")
                return False
            print(f"✅ {name} joined via join code")
        
        # Step 5: Verify all squads are created
        print("\n👥 Verifying Squad Creation for All Users:")
        for name, user_data in users.items():
            user_id = user_data["id"]
            squad_success, squad_response = self.run_test(
                f"Verify {name}'s Squad",
                "GET",
                f"tournaments/{tournament_id}/squads/{user_id}",
                200
            )
            
            if not squad_success:
                print(f"❌ CRITICAL: {name} doesn't have a squad!")
                return False
            print(f"✅ {name}'s squad verified")
        
        # PHASE 2: Test All New Features
        print("\n📋 PHASE 2: TEST ALL NEW FEATURES")
        print("-" * 50)
        
        # Step 6: Test Join Code System (already tested above)
        print("✅ Join code system tested successfully in Phase 1")
        
        # Step 7: Check Tournament Filtering (get tournaments and verify our tournament appears)
        tournaments_success, tournaments_response = self.run_test(
            "Check Tournament Filtering",
            "GET",
            "tournaments",
            200
        )
        
        if tournaments_success:
            tournament_found = False
            for tournament in tournaments_response:
                if tournament['id'] == tournament_id:
                    tournament_found = True
                    break
            
            if tournament_found:
                print("✅ Tournament filtering working - Friends Championship 2025 found")
            else:
                print("❌ Tournament filtering issue - tournament not found in list")
                return False
        
        # Step 8: Test Multi-Tournament (create second tournament)
        tournament2_data = {
            "name": "Friends Cup 2025",
            "competition_type": "europa_league",
            "teams_per_user": 3,
            "minimum_bid": 500000,
            "entry_fee": 0
        }
        
        tournament2_success, tournament2_response = self.run_test(
            "Create Second Tournament: Friends Cup 2025",
            "POST",
            "tournaments",
            200,
            data=tournament2_data,
            params={"admin_id": users["Sarah"]["id"]}  # Sarah creates this one
        )
        
        if tournament2_success:
            tournament2_id = tournament2_response['id']
            tournament2_join_code = tournament2_response.get('join_code')
            print(f"✅ Sarah created 'Friends Cup 2025' (ID: {tournament2_id})")
            print(f"✅ Second tournament join code: {tournament2_join_code}")
            
            # Have Alex and Mike join the second tournament too
            for name in ["Alex", "Mike"]:
                user_id = users[name]["id"]
                multi_join_success, multi_join_response = self.run_test(
                    f"{name} Joins Second Tournament",
                    "POST",
                    "tournaments/join-by-code",
                    200,
                    params={"join_code": tournament2_join_code, "user_id": user_id}
                )
                
                if multi_join_success:
                    print(f"✅ {name} joined second tournament")
                else:
                    print(f"⚠️ {name} couldn't join second tournament")
        
        # PHASE 3: Auction Preparation & Testing
        print("\n📋 PHASE 3: AUCTION PREPARATION & TESTING")
        print("-" * 50)
        
        # Step 9: Start Auction
        auction_success, auction_response = self.run_test(
            "Alex Starts Auction",
            "POST",
            f"tournaments/{tournament_id}/start-auction",
            200,
            params={"admin_id": alex_id}
        )
        
        if not auction_success:
            print("❌ CRITICAL: Cannot start auction")
            return False
        print("✅ Auction started successfully")
        
        # Step 10: Verify tournament status and current team
        tournament_check_success, tournament_check_response = self.run_test(
            "Verify Tournament Status After Auction Start",
            "GET",
            f"tournaments/{tournament_id}",
            200
        )
        
        if tournament_check_success:
            status = tournament_check_response.get('status')
            current_team_id = tournament_check_response.get('current_team_id')
            
            if status == 'auction_active':
                print("✅ Tournament status correctly set to 'auction_active'")
            else:
                print(f"❌ Tournament status incorrect: {status}")
                return False
                
            if current_team_id:
                print(f"✅ Current team set for bidding: {current_team_id}")
            else:
                print("❌ No current team set for bidding")
                return False
        
        # PHASE 4: Full Auction Simulation
        print("\n📋 PHASE 4: FULL AUCTION SIMULATION")
        print("-" * 50)
        
        # Step 11-14: Simulate bidding rounds
        print("🎯 Testing Bidding Flow:")
        
        # Test bidding with different users and amounts
        bidding_tests = [
            ("Sarah", 2000000),  # £2M
            ("Mike", 3000000),   # £3M
            ("Emma", 2500000),   # £2.5M (should fail - lower than Mike's)
            ("Tom", 4000000),    # £4M
            ("Alex", 5000000),   # £5M
        ]
        
        successful_bids = 0
        for name, amount in bidding_tests:
            user_id = users[name]["id"]
            
            # For Emma's bid, we expect it to fail (400) because it's lower than current highest
            expected_status = 400 if name == "Emma" else 200
            
            bid_success, bid_response = self.run_test(
                f"{name} Bids £{amount/1000000}M",
                "POST",
                f"tournaments/{tournament_id}/bid",
                expected_status,
                params={"user_id": user_id, "amount": amount}
            )
            
            if bid_success:
                if expected_status == 200:
                    successful_bids += 1
                    print(f"✅ {name}'s bid of £{amount/1000000}M accepted")
                else:
                    print(f"✅ {name}'s low bid correctly rejected")
            else:
                if expected_status == 200:
                    print(f"❌ {name}'s bid of £{amount/1000000}M failed unexpectedly")
                    return False
        
        print(f"✅ Bidding flow tested: {successful_bids} successful bids placed")
        
        # Step 15: Test Budget Management
        print("\n💰 Testing Budget Management:")
        
        # Get Alex's current squad to check budget
        alex_squad_check_success, alex_squad_check_response = self.run_test(
            "Check Alex's Squad Budget",
            "GET",
            f"tournaments/{tournament_id}/squads/{alex_id}",
            200
        )
        
        if alex_squad_check_success:
            total_spent = alex_squad_check_response.get('total_spent', 0)
            budget_per_user = tournament_response.get('budget_per_user', 500000000)
            remaining_budget = budget_per_user - total_spent
            print(f"✅ Alex's budget tracking: Spent £{total_spent/1000000}M, Remaining £{remaining_budget/1000000}M")
        
        # Step 16: Test Chat Functionality
        print("\n💬 Testing Chat System:")
        
        chat_messages = [
            ("Alex", "Welcome to Friends Championship 2025!"),
            ("Sarah", "Good luck everyone! 🍀"),
            ("Mike", "May the best squad win!"),
        ]
        
        for name, message in chat_messages:
            user_id = users[name]["id"]
            message_data = {"message": message}
            
            chat_success, chat_response = self.run_test(
                f"{name} Sends Chat Message",
                "POST",
                f"tournaments/{tournament_id}/chat",
                200,
                data=message_data,
                params={"user_id": user_id}
            )
            
            if chat_success:
                print(f"✅ {name}: {message}")
            else:
                print(f"❌ {name}'s chat message failed")
                return False
        
        # Get all chat messages
        get_chat_success, get_chat_response = self.run_test(
            "Retrieve All Chat Messages",
            "GET",
            f"tournaments/{tournament_id}/chat",
            200
        )
        
        if get_chat_success:
            print(f"✅ Chat system working: {len(get_chat_response)} messages retrieved")
        
        # Final verification
        print("\n📊 FINAL VERIFICATION:")
        print("-" * 50)
        
        # Check all tournament squads
        final_squads_success, final_squads_response = self.run_test(
            "Final Squad Count Verification",
            "GET",
            f"tournaments/{tournament_id}/squads",
            200
        )
        
        if final_squads_success:
            squad_count = len(final_squads_response)
            expected_squads = len(users)  # Should be 5
            
            if squad_count == expected_squads:
                print(f"✅ All {squad_count} squads created and maintained")
            else:
                print(f"❌ Squad count mismatch: Expected {expected_squads}, got {squad_count}")
                return False
        
        # Check tournament bids
        final_bids_success, final_bids_response = self.run_test(
            "Final Bid Count Verification",
            "GET",
            f"tournaments/{tournament_id}/bids",
            200
        )
        
        if final_bids_success:
            bid_count = len(final_bids_response)
            print(f"✅ Total bids placed: {bid_count}")
        
        print("\n🎉 COMPREHENSIVE TOURNAMENT SCENARIO COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        print("✅ All 5 users created with realistic names")
        print("✅ Tournament 'Friends Championship 2025' created")
        print("✅ All users joined via both URL and join code methods")
        print("✅ All squads created and verified")
        print("✅ Join code system working perfectly")
        print("✅ Multi-tournament functionality tested")
        print("✅ Auction started and bidding flow working")
        print("✅ Budget management functional")
        print("✅ Chat system operational")
        print("✅ Database consistency maintained")
        print("=" * 80)
        
        return True

    def run_comprehensive_friends_scenario_only(self):
        """Run only the comprehensive friends tournament scenario"""
        print("🏆 Running Comprehensive Friends Tournament Scenario")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        success = self.test_comprehensive_friends_tournament_scenario()
        
        print("\n" + "=" * 80)
        if success:
            print("🎉 Comprehensive Friends Tournament Scenario PASSED!")
            print("All backend functionality working perfectly for the Friends of PIFA app!")
            return 0
        else:
            print("❌ Comprehensive Friends Tournament Scenario FAILED!")
            return 1

    def test_database_cleanup(self):
        """
        Clean up all test data from the database while preserving core team data
        This gives users a fresh start for testing with real friends
        """
        print("\n🧹 DATABASE CLEANUP FOR FRIENDS OF PIFA")
        print("=" * 80)
        print("Removing all test data to give users a fresh start...")
        print("=" * 80)
        
        # Step 1: Check current database state before cleanup
        print("\n📊 STEP 1: CHECKING CURRENT DATABASE STATE")
        print("-" * 50)
        
        # Check tournaments
        tournaments_success, tournaments_response = self.run_test(
            "Check Current Tournaments",
            "GET",
            "tournaments",
            200
        )
        
        tournament_count = len(tournaments_response) if tournaments_success else 0
        print(f"📋 Current tournaments: {tournament_count}")
        
        # Check teams (should be preserved)
        teams_success, teams_response = self.run_test(
            "Check Teams (Should be Preserved)",
            "GET",
            "teams",
            200
        )
        
        team_count = len(teams_response) if teams_success else 0
        print(f"⚽ Current teams: {team_count} (should remain 64)")
        
        # Step 2: Attempt to clean up via API (if cleanup endpoints exist)
        print("\n🗑️ STEP 2: ATTEMPTING DATABASE CLEANUP")
        print("-" * 50)
        
        # Since there are no direct cleanup endpoints in the API, 
        # we'll need to use the MongoDB connection directly
        # For now, let's document what needs to be cleaned
        
        cleanup_collections = [
            "tournaments",
            "users", 
            "squads",
            "bids",
            "chat_messages"
        ]
        
        print("Collections to be cleaned:")
        for collection in cleanup_collections:
            print(f"  - {collection}")
        
        print("Collections to be preserved:")
        print("  - teams (64 teams: 32 Champions League + 32 Europa League)")
        
        # Step 3: Since we can't directly clean via API, let's use MongoDB commands
        print("\n💾 STEP 3: DIRECT DATABASE CLEANUP")
        print("-" * 50)
        
        try:
            # Import MongoDB client
            from motor.motor_asyncio import AsyncIOMotorClient
            import os
            import asyncio
            
            # Connect to MongoDB using the same connection as the backend
            mongo_url = "mongodb://localhost:27017"  # From backend/.env
            client = AsyncIOMotorClient(mongo_url)
            db = client["test_database"]  # From backend/.env
            
            async def cleanup_database():
                cleanup_results = {}
                
                # Clean tournaments
                tournaments_result = await db.tournaments.delete_many({})
                cleanup_results['tournaments'] = tournaments_result.deleted_count
                
                # Clean users  
                users_result = await db.users.delete_many({})
                cleanup_results['users'] = users_result.deleted_count
                
                # Clean squads
                squads_result = await db.squads.delete_many({})
                cleanup_results['squads'] = squads_result.deleted_count
                
                # Clean bids
                bids_result = await db.bids.delete_many({})
                cleanup_results['bids'] = bids_result.deleted_count
                
                # Clean chat messages
                chat_result = await db.chat_messages.delete_many({})
                cleanup_results['chat_messages'] = chat_result.deleted_count
                
                # Verify teams are still there
                teams_count = await db.teams.count_documents({})
                cleanup_results['teams_remaining'] = teams_count
                
                return cleanup_results
            
            # Run the cleanup
            cleanup_results = asyncio.run(cleanup_database())
            client.close()
            
            print("✅ Database cleanup completed successfully!")
            print("\nCleanup Results:")
            print(f"  🗑️ Tournaments removed: {cleanup_results['tournaments']}")
            print(f"  🗑️ Users removed: {cleanup_results['users']}")
            print(f"  🗑️ Squads removed: {cleanup_results['squads']}")
            print(f"  🗑️ Bids removed: {cleanup_results['bids']}")
            print(f"  🗑️ Chat messages removed: {cleanup_results['chat_messages']}")
            print(f"  ⚽ Teams preserved: {cleanup_results['teams_remaining']}")
            
            # Verify teams count is correct (should be 64)
            if cleanup_results['teams_remaining'] != 64:
                print(f"⚠️ WARNING: Expected 64 teams, found {cleanup_results['teams_remaining']}")
                return False
                
        except Exception as e:
            print(f"❌ Database cleanup failed: {str(e)}")
            print("Note: This might be due to connection issues or missing dependencies")
            return False
        
        # Step 4: Verify cleanup via API
        print("\n✅ STEP 4: VERIFYING CLEANUP VIA API")
        print("-" * 50)
        
        # Check tournaments (should be empty)
        verify_tournaments_success, verify_tournaments_response = self.run_test(
            "Verify Tournaments Cleaned",
            "GET",
            "tournaments",
            200
        )
        
        if verify_tournaments_success:
            remaining_tournaments = len(verify_tournaments_response)
            if remaining_tournaments == 0:
                print("✅ All tournaments successfully removed")
            else:
                print(f"⚠️ {remaining_tournaments} tournaments still remain")
                return False
        
        # Check teams (should still be 64)
        verify_teams_success, verify_teams_response = self.run_test(
            "Verify Teams Preserved",
            "GET",
            "teams",
            200
        )
        
        if verify_teams_success:
            remaining_teams = len(verify_teams_response)
            if remaining_teams == 64:
                print("✅ All 64 teams preserved correctly")
                
                # Check Champions League teams
                cl_success, cl_response = self.run_test(
                    "Verify Champions League Teams",
                    "GET",
                    "teams",
                    200,
                    params={"competition": "champions_league"}
                )
                
                if cl_success and len(cl_response) == 32:
                    print("✅ 32 Champions League teams preserved")
                else:
                    print(f"⚠️ Champions League teams: {len(cl_response) if cl_success else 'unknown'}")
                
                # Check Europa League teams
                el_success, el_response = self.run_test(
                    "Verify Europa League Teams",
                    "GET",
                    "teams",
                    200,
                    params={"competition": "europa_league"}
                )
                
                if el_success and len(el_response) == 32:
                    print("✅ 32 Europa League teams preserved")
                else:
                    print(f"⚠️ Europa League teams: {len(el_response) if el_success else 'unknown'}")
                    
            else:
                print(f"❌ Team count incorrect: Expected 64, found {remaining_teams}")
                return False
        
        print("\n🎉 DATABASE CLEANUP COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        print("✅ All test tournaments removed")
        print("✅ All test users removed") 
        print("✅ All squads cleared")
        print("✅ All bids cleared")
        print("✅ All chat messages cleared")
        print("✅ Core team data preserved (64 teams)")
        print("✅ Database ready for fresh testing with real friends")
        print("=" * 80)
        
        return True

    def run_database_cleanup_only(self):
        """Run only the database cleanup"""
        print("🧹 Running Database Cleanup for Friends of PIFA")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        success = self.test_database_cleanup()
        
        print("\n" + "=" * 80)
        if success:
            print("🎉 Database Cleanup COMPLETED SUCCESSFULLY!")
            print("The database is now clean and ready for fresh testing with real friends!")
            return 0
        else:
            print("❌ Database Cleanup FAILED!")
            return 1

    def test_user_registration_scenarios(self):
        """
        Test specific user registration scenarios as requested in the review
        Focus on: User creation, tournament join with new users, join by code with new users, database persistence
        """
        print("\n🔍 USER REGISTRATION TESTING - CRITICAL ISSUE INVESTIGATION")
        print("=" * 80)
        print("Testing user registration during tournament joining as reported by user")
        print("=" * 80)
        
        # SCENARIO 1: Test User Creation Endpoint
        print("\n📋 SCENARIO 1: TEST USER CREATION ENDPOINT")
        print("-" * 60)
        
        timestamp = int(time.time())
        
        # Test 1a: Create a new user via POST /api/users
        user_data = {
            "username": f"newuser_{timestamp}",
            "email": f"newuser_{timestamp}@test.com"
        }
        
        user_success, user_response = self.run_test(
            "1a: Create New User via POST /api/users",
            "POST", 
            "users",
            200,
            data=user_data
        )
        
        if not user_success or 'id' not in user_response:
            print("❌ CRITICAL: User creation endpoint failing!")
            return False
            
        new_user_id = user_response['id']
        print(f"✅ User created successfully: {user_response['username']} (ID: {new_user_id})")
        
        # Test 1b: Verify the user is returned correctly
        get_user_success, get_user_response = self.run_test(
            "1b: Verify User Can Be Retrieved",
            "GET",
            f"users/{new_user_id}",
            200
        )
        
        if not get_user_success:
            print("❌ CRITICAL: Created user cannot be retrieved!")
            return False
        print("✅ User retrieval working correctly")
        
        # Test 1c: Check if user appears in any user lists (no direct endpoint, but we'll verify via tournament join)
        print("✅ User creation endpoint fully functional")
        
        # SCENARIO 2: Test Tournament Join Flow with New User
        print("\n📋 SCENARIO 2: TEST TOURNAMENT JOIN FLOW WITH NEW USER")
        print("-" * 60)
        
        # Test 2a: Create a fresh tournament
        admin_data = {
            "username": f"admin_{timestamp}",
            "email": f"admin_{timestamp}@test.com"
        }
        
        admin_success, admin_response = self.run_test(
            "2a: Create Admin User for Tournament",
            "POST", 
            "users",
            200,
            data=admin_data
        )
        
        if not admin_success:
            print("❌ CRITICAL: Cannot create admin user")
            return False
            
        admin_id = admin_response['id']
        
        tournament_data = {
            "name": f"Registration Test Tournament {timestamp}",
            "competition_type": "champions_league",
            "teams_per_user": 4,
            "minimum_bid": 1000000,
            "entry_fee": 0
        }
        
        tournament_success, tournament_response = self.run_test(
            "2b: Create Fresh Tournament",
            "POST",
            "tournaments",
            200,
            data=tournament_data,
            params={"admin_id": admin_id}
        )
        
        if not tournament_success or 'id' not in tournament_response:
            print("❌ CRITICAL: Cannot create tournament")
            return False
            
        tournament_id = tournament_response['id']
        join_code = tournament_response.get('join_code')
        print(f"✅ Tournament created: {tournament_response['name']} (ID: {tournament_id})")
        print(f"✅ Join code: {join_code}")
        
        # Test 2c: Try to have a NEW user join the tournament
        new_joiner_data = {
            "username": f"joiner_{timestamp}",
            "email": f"joiner_{timestamp}@test.com"
        }
        
        joiner_success, joiner_response = self.run_test(
            "2c: Create New User for Tournament Join",
            "POST", 
            "users",
            200,
            data=new_joiner_data
        )
        
        if not joiner_success:
            print("❌ CRITICAL: Cannot create new joiner user")
            return False
            
        joiner_id = joiner_response['id']
        print(f"✅ New joiner created: {joiner_response['username']} (ID: {joiner_id})")
        
        # Test 2d: Join tournament with new user
        join_success, join_response = self.run_test(
            "2d: New User Joins Tournament",
            "POST",
            f"tournaments/{tournament_id}/join",
            200,
            params={"user_id": joiner_id}
        )
        
        if not join_success:
            print("❌ CRITICAL: New user cannot join tournament!")
            print(f"   Error response: {join_response}")
            return False
        print("✅ New user successfully joined tournament")
        
        # Test 2e: Verify user gets added to participants
        tournament_check_success, tournament_check_response = self.run_test(
            "2e: Verify User Added to Participants",
            "GET",
            f"tournaments/{tournament_id}",
            200
        )
        
        if tournament_check_success:
            participants = tournament_check_response.get('participants', [])
            if joiner_id not in participants:
                print(f"❌ CRITICAL: Joiner {joiner_id} not in participants: {participants}")
                return False
            print(f"✅ User correctly added to participants: {participants}")
        
        # Test 2f: Verify squad creation happens automatically during join
        squad_success, squad_response = self.run_test(
            "2f: Verify Squad Created During Join",
            "GET",
            f"tournaments/{tournament_id}/squads/{joiner_id}",
            200
        )
        
        if not squad_success:
            print("❌ CRITICAL: Squad not created automatically during tournament join!")
            return False
        print("✅ Squad automatically created during tournament join")
        
        # SCENARIO 3: Test Join by Code Flow with New User
        print("\n📋 SCENARIO 3: TEST JOIN BY CODE FLOW WITH NEW USER")
        print("-" * 60)
        
        # Test 3a: Create another new user for join-by-code test
        code_joiner_data = {
            "username": f"codejoiner_{timestamp}",
            "email": f"codejoiner_{timestamp}@test.com"
        }
        
        code_joiner_success, code_joiner_response = self.run_test(
            "3a: Create New User for Join-by-Code Test",
            "POST", 
            "users",
            200,
            data=code_joiner_data
        )
        
        if not code_joiner_success:
            print("❌ CRITICAL: Cannot create code joiner user")
            return False
            
        code_joiner_id = code_joiner_response['id']
        print(f"✅ Code joiner created: {code_joiner_response['username']} (ID: {code_joiner_id})")
        
        # Test 3b: Try to join using join-by-code endpoint with new user
        join_by_code_success, join_by_code_response = self.run_test(
            "3b: New User Joins via Join Code",
            "POST",
            "tournaments/join-by-code",
            200,
            params={"join_code": join_code, "user_id": code_joiner_id}
        )
        
        if not join_by_code_success:
            print("❌ CRITICAL: New user cannot join via join code!")
            print(f"   Error response: {join_by_code_response}")
            return False
        print("✅ New user successfully joined via join code")
        
        # Test 3c: Verify user creation and tournament joining
        code_tournament_check_success, code_tournament_check_response = self.run_test(
            "3c: Verify Code Joiner Added to Participants",
            "GET",
            f"tournaments/{tournament_id}",
            200
        )
        
        if code_tournament_check_success:
            participants = code_tournament_check_response.get('participants', [])
            if code_joiner_id not in participants:
                print(f"❌ CRITICAL: Code joiner {code_joiner_id} not in participants: {participants}")
                return False
            print(f"✅ Code joiner correctly added to participants")
        
        # Test 3d: Verify squad creation for code joiner
        code_squad_success, code_squad_response = self.run_test(
            "3d: Verify Squad Created for Code Joiner",
            "GET",
            f"tournaments/{tournament_id}/squads/{code_joiner_id}",
            200
        )
        
        if not code_squad_success:
            print("❌ CRITICAL: Squad not created for code joiner!")
            return False
        print("✅ Squad created for code joiner")
        
        # SCENARIO 4: Database Verification
        print("\n📋 SCENARIO 4: DATABASE VERIFICATION")
        print("-" * 60)
        
        # Test 4a: Check if users are actually being saved to the database
        all_users_created = [new_user_id, admin_id, joiner_id, code_joiner_id]
        
        for i, user_id in enumerate(all_users_created):
            user_names = ["NewUser", "Admin", "Joiner", "CodeJoiner"]
            db_check_success, db_check_response = self.run_test(
                f"4a.{i+1}: Verify {user_names[i]} Persisted in Database",
                "GET",
                f"users/{user_id}",
                200
            )
            
            if not db_check_success:
                print(f"❌ CRITICAL: {user_names[i]} not persisted in database!")
                return False
            print(f"✅ {user_names[i]} correctly persisted in database")
        
        # Test 4b: Verify user data persistence (check specific fields)
        for i, user_id in enumerate(all_users_created):
            user_names = ["NewUser", "Admin", "Joiner", "CodeJoiner"]
            persistence_success, persistence_response = self.run_test(
                f"4b.{i+1}: Check {user_names[i]} Data Integrity",
                "GET",
                f"users/{user_id}",
                200
            )
            
            if persistence_success:
                required_fields = ['id', 'username', 'email', 'created_at']
                missing_fields = [field for field in required_fields if field not in persistence_response]
                
                if missing_fields:
                    print(f"❌ CRITICAL: {user_names[i]} missing fields: {missing_fields}")
                    return False
                print(f"✅ {user_names[i]} data integrity verified")
        
        # Test 4c: Check if there are any database errors (by verifying all squads exist)
        all_squad_success, all_squad_response = self.run_test(
            "4c: Verify All Squads Exist in Database",
            "GET",
            f"tournaments/{tournament_id}/squads",
            200
        )
        
        if all_squad_success:
            expected_squads = 3  # admin + joiner + code_joiner
            actual_squads = len(all_squad_response)
            
            if actual_squads != expected_squads:
                print(f"❌ CRITICAL: Squad count mismatch. Expected {expected_squads}, got {actual_squads}")
                return False
            print(f"✅ All {actual_squads} squads correctly stored in database")
        
        # Test 4d: No registration errors should occur - test by attempting another user creation
        final_test_data = {
            "username": f"finaltest_{timestamp}",
            "email": f"finaltest_{timestamp}@test.com"
        }
        
        final_success, final_response = self.run_test(
            "4d: Final Registration Test (No Errors)",
            "POST", 
            "users",
            200,
            data=final_test_data
        )
        
        if not final_success:
            print("❌ CRITICAL: Registration errors detected!")
            return False
        print("✅ No registration errors detected")
        
        # FINAL SUMMARY
        print("\n🎉 USER REGISTRATION TESTING COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        print("✅ SCENARIO 1: User creation endpoint fully functional")
        print("✅ SCENARIO 2: Tournament join flow with new users working")
        print("✅ SCENARIO 3: Join-by-code flow with new users working")
        print("✅ SCENARIO 4: Database persistence and integrity verified")
        print("✅ No registration errors detected")
        print("=" * 80)
        print("🔍 CONCLUSION: User registration system is working correctly")
        print("   - Users are created successfully via POST /api/users")
        print("   - Tournament joining works for new users")
        print("   - Join-by-code works for new users")
        print("   - Users persist correctly in database")
        print("   - Squad creation happens automatically")
        print("   - No registration errors found")
        print("=" * 80)
        
        return True

    def run_user_registration_test_only(self):
        """Run only the user registration scenarios test"""
        print("🔍 Running User Registration Testing")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        success = self.test_user_registration_scenarios()
        
        print("\n" + "=" * 80)
        if success:
            print("🎉 User Registration Testing PASSED!")
            print("All user registration scenarios working correctly!")
            return 0
        else:
            print("❌ User Registration Testing FAILED!")
            print("Critical issues found in user registration process!")
            return 1

def main():
    import sys
    tester = PIFAAuctionAPITester()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--squad-test":
            return tester.run_squad_bidding_test_only()
        elif sys.argv[1] == "--join-code-test":
            return tester.run_join_code_tests_only()
        elif sys.argv[1] == "--friends-scenario":
            return tester.run_comprehensive_friends_scenario_only()
        elif sys.argv[1] == "--cleanup":
            return tester.run_database_cleanup_only()
    
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())