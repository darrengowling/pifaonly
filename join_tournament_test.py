import requests
import json
import time
from datetime import datetime

class JoinTournamentTester:
    def __init__(self, base_url="https://fantasy-auction-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.test_results = []
        
    def log_result(self, test_name, success, details=""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        return success
    
    def make_request(self, method, endpoint, data=None, params=None):
        """Make API request"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params)
            
            return response.status_code, response.json() if response.text else {}
        except Exception as e:
            return 500, {"error": str(e)}
    
    def test_join_tournament_functionality(self):
        """Test complete join tournament functionality as requested"""
        print("🎯 TESTING JOIN TOURNAMENT FUNCTIONALITY")
        print("=" * 60)
        
        timestamp = int(time.time())
        
        # Step 1: Create first user (tournament creator)
        print("\n📝 Step 1: Create Tournament Creator")
        user1_data = {
            "username": f"tournament_creator_{timestamp}",
            "email": f"creator_{timestamp}@pifa.com"
        }
        
        status, user1_response = self.make_request("POST", "users", data=user1_data)
        if not self.log_result("Create Tournament Creator", status == 200, f"User ID: {user1_response.get('id', 'N/A')}"):
            return False
        
        creator_id = user1_response['id']
        
        # Step 2: Create tournament
        print("\n🏆 Step 2: Create Tournament")
        tournament_data = {
            "name": f"Join Test Tournament {timestamp}",
            "competition_type": "champions_league",
            "teams_per_user": 4,
            "minimum_bid": 1000000,
            "entry_fee": 0
        }
        
        status, tournament_response = self.make_request("POST", "tournaments", data=tournament_data, params={"admin_id": creator_id})
        if not self.log_result("Create Tournament", status == 200, f"Tournament ID: {tournament_response.get('id', 'N/A')}"):
            return False
        
        tournament_id = tournament_response['id']
        
        # Verify creator is automatically added to participants
        status, tournament_check = self.make_request("GET", f"tournaments/{tournament_id}")
        creator_in_participants = creator_id in tournament_check.get('participants', [])
        self.log_result("Creator Auto-Added to Participants", creator_in_participants, 
                       f"Participants: {tournament_check.get('participants', [])}")
        
        # Verify squad was created for creator
        status, creator_squad = self.make_request("GET", f"tournaments/{tournament_id}/squads/{creator_id}")
        creator_has_squad = status == 200
        self.log_result("Squad Created for Creator", creator_has_squad, 
                       f"Squad ID: {creator_squad.get('id', 'N/A')}")
        
        # Step 3: Create second user to test join functionality
        print("\n👤 Step 3: Create Second User")
        user2_data = {
            "username": f"joiner_user_{timestamp}",
            "email": f"joiner_{timestamp}@pifa.com"
        }
        
        status, user2_response = self.make_request("POST", "users", data=user2_data)
        if not self.log_result("Create Second User", status == 200, f"User ID: {user2_response.get('id', 'N/A')}"):
            return False
        
        joiner_id = user2_response['id']
        
        # Step 4: Test JOIN API endpoint
        print("\n🔗 Step 4: Test Join Tournament API")
        
        # Get initial participant count
        status, tournament_before = self.make_request("GET", f"tournaments/{tournament_id}")
        initial_count = len(tournament_before.get('participants', []))
        
        # Join tournament
        status, join_response = self.make_request("POST", f"tournaments/{tournament_id}/join", params={"user_id": joiner_id})
        join_success = status == 200
        self.log_result("Join Tournament API Call", join_success, 
                       f"Response: {join_response.get('message', 'N/A')}")
        
        if not join_success:
            return False
        
        # Step 5: Verify Join Logic
        print("\n✅ Step 5: Verify Join Logic")
        
        # Check user added to participants list
        status, tournament_after = self.make_request("GET", f"tournaments/{tournament_id}")
        participants_after = tournament_after.get('participants', [])
        user_in_participants = joiner_id in participants_after
        self.log_result("User Added to Participants List", user_in_participants,
                       f"Participants: {participants_after}")
        
        # Check participant count increased
        final_count = len(participants_after)
        count_increased = final_count == initial_count + 1
        self.log_result("Participant Count Increased", count_increased,
                       f"Before: {initial_count}, After: {final_count}")
        
        # Check squad created for joining user
        status, joiner_squad = self.make_request("GET", f"tournaments/{tournament_id}/squads/{joiner_id}")
        squad_created = status == 200
        self.log_result("Squad Created for Joining User", squad_created,
                       f"Squad ID: {joiner_squad.get('id', 'N/A')}")
        
        # Step 6: Test Multiple Users Joining
        print("\n👥 Step 6: Test Multiple Users Joining")
        
        # Create third user
        user3_data = {
            "username": f"third_user_{timestamp}",
            "email": f"third_{timestamp}@pifa.com"
        }
        
        status, user3_response = self.make_request("POST", "users", data=user3_data)
        if status == 200:
            user3_id = user3_response['id']
            
            # Join with third user
            status, join3_response = self.make_request("POST", f"tournaments/{tournament_id}/join", params={"user_id": user3_id})
            third_join_success = status == 200
            self.log_result("Third User Join Tournament", third_join_success,
                           f"Response: {join3_response.get('message', 'N/A')}")
            
            if third_join_success:
                # Verify third user's squad
                status, user3_squad = self.make_request("GET", f"tournaments/{tournament_id}/squads/{user3_id}")
                self.log_result("Squad Created for Third User", status == 200,
                               f"Squad ID: {user3_squad.get('id', 'N/A')}")
        
        # Step 7: Test Join Button Logic Conditions
        print("\n🔘 Step 7: Test Join Button Logic Conditions")
        
        # Get final tournament state
        status, final_tournament = self.make_request("GET", f"tournaments/{tournament_id}")
        
        # Test condition: User NOT in participants list (create new user)
        user4_data = {
            "username": f"new_user_{timestamp}",
            "email": f"new_{timestamp}@pifa.com"
        }
        status, user4_response = self.make_request("POST", "users", data=user4_data)
        
        if status == 200:
            user4_id = user4_response['id']
            participants = final_tournament.get('participants', [])
            
            # Check join button conditions
            user_not_in_participants = user4_id not in participants
            tournament_not_full = len(participants) < 8
            tournament_not_completed = final_tournament.get('status') != 'completed'
            
            should_show_join_button = user_not_in_participants and tournament_not_full and tournament_not_completed
            
            self.log_result("User NOT in Participants", user_not_in_participants,
                           f"User {user4_id} in {participants}: {user4_id in participants}")
            self.log_result("Tournament Not Full (< 8)", tournament_not_full,
                           f"Participants: {len(participants)}/8")
            self.log_result("Tournament Not Completed", tournament_not_completed,
                           f"Status: {final_tournament.get('status')}")
            self.log_result("Should Show Join Button", should_show_join_button,
                           f"All conditions met: {should_show_join_button}")
        
        # Test duplicate join attempt
        print("\n🚫 Step 8: Test Duplicate Join Prevention")
        status, duplicate_response = self.make_request("POST", f"tournaments/{tournament_id}/join", params={"user_id": joiner_id})
        duplicate_prevented = status == 400
        self.log_result("Duplicate Join Prevented", duplicate_prevented,
                       f"Status: {status}, Response: {duplicate_response.get('detail', 'N/A')}")
        
        return True
    
    def run_test(self):
        """Run the complete join tournament test"""
        print("🚀 STARTING JOIN TOURNAMENT FUNCTIONALITY TEST")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        success = self.test_join_tournament_functionality()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']}")
        
        print(f"\n🎯 OVERALL RESULT: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL JOIN TOURNAMENT TESTS PASSED!")
            print("\n✅ VERIFICATION COMPLETE:")
            print("   • Join API endpoint working correctly")
            print("   • Users properly added to participants list")
            print("   • Squads created for all joining users")
            print("   • Participant count increases correctly")
            print("   • Multiple users can join same tournament")
            print("   • Join button logic conditions verified")
            print("   • Duplicate join attempts prevented")
            return True
        else:
            print(f"❌ {total - passed} TESTS FAILED")
            return False

def main():
    tester = JoinTournamentTester()
    success = tester.run_test()
    return 0 if success else 1

if __name__ == "__main__":
    import sys
    sys.exit(main())