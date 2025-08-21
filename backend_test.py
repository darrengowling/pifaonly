import requests
import sys
import json
from datetime import datetime
import time

class PIFAAuctionAPITester:
    def __init__(self, base_url="https://soccer-league-bid.preview.emergentagent.com"):
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

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Fantasy Soccer API Tests")
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

def main():
    tester = PIFAAuctionAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())