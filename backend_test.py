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
            "Step 6: Start Auction",
            "POST",
            f"tournaments/{tournament_id}/start-auction",
            200,
            params={"admin_id": test_user_id}
        )
        
        if not auction_success:
            print("❌ CRITICAL: Cannot start auction - stopping test")
            return False
            
        print("✅ Auction started successfully")
        
        # Step 7: Try to place a bid (this is where the error should occur)
        bid_success, bid_response = self.run_test(
            "Step 7: Place Bid (Testing for 'Squad not found' error)",
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
            self.test_chat_messages
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

def main():
    import sys
    tester = PIFAAuctionAPITester()
    
    # Check if we should run only the squad bidding test
    if len(sys.argv) > 1 and sys.argv[1] == "--squad-test":
        return tester.run_squad_bidding_test_only()
    else:
        return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())