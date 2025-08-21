# Friends of PIFA - User Testing Guide 🎮⚽

Welcome to the Friends of PIFA app! This guide will help you navigate and test all features easily.

## 📋 Quick Start Checklist

- [ ] Access the app
- [ ] Create or join a tournament
- [ ] Participate in live auction
- [ ] Test chat functionality
- [ ] Provide feedback

---

## 🎯 App Overview

**What is it?** A fantasy soccer auction where friends bid against each other for exclusive ownership of real soccer teams (Champions League & Europa League), then compete based on real-world team performance.

**How it works:**
1. **Admin creates tournament** → Sets budget, rules, entry fees
2. **Friends join tournament** → 4-8 participants per tournament  
3. **Live auction begins** → Bid on teams with time limits
4. **Competition starts** → Your teams earn points based on real matches

---

## 🚀 Getting Started

### Step 1: Access the App
1. Open your browser and go to: **https://soccer-league-bid.preview.emergentagent.com**
2. The app will automatically create a user account for you (you'll see "Welcome back, User_XXX!")
3. You'll land on the **Dashboard** showing available tournaments

### Step 2A: Creating a Tournament (Admin Role)

**If you want to be the tournament admin:**

1. Click **"Create Tournament"** button on the dashboard
2. Fill out the tournament form:
   - **Tournament Name**: e.g., "Friends CL 2025/26"
   - **Competition**: Choose Champions League OR Europa League
   - **Teams per User**: Recommended 4-6 teams each
   - **Minimum Bid**: Use slider (£1m - £10m)
   - **Entry Fee**: Optional (£0 for testing)
3. Click **"Create Tournament"**
4. Share the tournament URL with friends
5. Wait for 4+ friends to join before starting auction

### Step 2B: Joining a Tournament (Participant Role)

**If someone else created the tournament:**

1. Get tournament link from your friend
2. Click the tournament link or find it on the dashboard
3. Click **"Join"** button
4. Wait for admin to start the auction

---

## 🏆 Tournament Dashboard

Once in a tournament, you'll see:

- **Tournament Info**: Budget (£500m), teams needed, competition type
- **Participants**: Who has joined (1/8 max)
- **Status**: 
  - 🟡 "Waiting for Players" = Need more participants
  - 🟢 "Auction Live!" = Bidding is active
  - 🔵 "Tournament Active" = Auction complete, competition running

**Admin Controls:**
- **Start Auction**: Appears when 4+ participants joined
- Only the tournament creator can start auctions

---

## 🎪 Live Auction Room

### What You'll See:

**Main Area:**
- **Current Team**: e.g., "Manchester City" from England
- **Current Bid**: Shows highest bid and bidder name
- **Timer**: Time remaining for current team (usually 2 minutes)
- **Bid Input**: Enter your bid amount in millions (£)

**Participants Panel:**
- All participants with their remaining budgets
- Teams owned count (0/4 initially)
- Total spent so far

**Chat Panel:**
- Send messages to all participants
- Trash talk encouraged! 😉

### How to Bid:

1. **Check Current Bid**: See what you need to beat
2. **Enter Amount**: Type bid in millions (e.g., "5" = £5m)
3. **Click "Bid £Xm"**: Submit your bid
4. **Watch Timer**: Bidding closes when timer hits 0:00
5. **Budget Check**: App prevents overbidding

**Bidding Rules:**
- Must bid higher than current highest bid
- Minimum bid enforced (set by admin)
- Must reserve enough budget for remaining teams
- Example: If you need 4 teams and have £100m left, max bid is £97m (saving £1m each for 3 more teams)

---

## 💬 Using Chat

- **Send Messages**: Type in chat box and click "Send"
- **Strategy**: Coordinate, negotiate, or bluff!
- **Banter**: Keep it fun and friendly
- **Updates**: System announces new bids automatically

---

## 📊 Your Status Panel

**Budget Left**: Your remaining money
**Teams**: How many teams you own (X/4)
**Total Spent**: Money used so far

**Important**: You MUST end up with the exact number of teams specified (usually 4). The app prevents you from spending too much too early.

---

## 🔧 Testing Scenarios

### Scenario 1: Basic Tournament Flow
1. One person creates tournament
2. 3+ others join
3. Admin starts auction
4. Everyone bids on a few teams
5. Test chat functionality
6. Complete auction

### Scenario 2: Edge Cases to Test
- Try bidding more than you can afford
- Test what happens when timer runs out
- Try joining full tournament (8 participants)  
- Test leaving and rejoining auction room

### Scenario 3: Multiple Tournaments
- Create tournaments with different settings
- Test Champions League vs Europa League
- Try different team counts (4 vs 6 teams per user)

---

## 🚨 Troubleshooting

### Common Issues:

**"Loading auction room..."**
- Refresh the page
- Check if auction has actually started
- Make sure you have stable internet

**Can't place bid:**
- Check if you have enough budget
- Ensure bid is higher than current highest
- Verify timer hasn't expired

**Don't see "Start Auction" button:**
- Only tournament admin can start auctions
- Need minimum 4 participants
- Tournament must be in "pending" status

**WebSocket shows "Disconnected":**
- This is normal and doesn't affect functionality
- Core bidding works without WebSocket

---

## 📱 Navigation Tips

- **Dashboard**: Click app logo to return home
- **Tournament Details**: Click "View" on any tournament
- **Live Auction**: Available when tournament status is "Auction Live!"
- **Back Button**: Use browser back or in-app navigation

---

## 🧪 What to Test & Report

### Functionality Testing:
- [ ] Tournament creation works
- [ ] Joining tournaments works  
- [ ] Auction room loads properly
- [ ] Bidding system works
- [ ] Timer counts down correctly
- [ ] Chat messages send/receive
- [ ] Budget calculations correct
- [ ] User interface is intuitive

### User Experience Testing:
- [ ] Easy to understand rules
- [ ] Clear what to do next
- [ ] Auction feels exciting
- [ ] No confusing elements
- [ ] Mobile/desktop compatibility

### Feedback Questions:
1. **Is the interface intuitive?** Can you figure out what to do without explanation?
2. **Is bidding exciting?** Does the auction feel engaging?
3. **Any confusing parts?** What needs better explanation?
4. **Performance issues?** Any lag, crashes, or loading problems?
5. **Missing features?** What would make it better?

---

## 🎮 Pro Tips for Testing

1. **Use Real Strategy**: Bid like you want to win - makes testing more realistic
2. **Test Edge Cases**: Try to break things (high bids, rapid clicking, etc.)
3. **Communicate**: Use chat actively to test real-time features
4. **Different Devices**: Test on mobile, tablet, desktop if possible
5. **Take Screenshots**: Capture any weird behavior or bugs

---

## 📞 Support & Feedback

**Found a bug?** Note:
- What you were doing when it happened
- What you expected vs what actually happened  
- Your browser and device type
- Screenshot if possible

**Suggestions?** Think about:
- What features would make auctions more fun?
- How to make the interface clearer?
- What's missing from the experience?

---

## 🏁 After Testing

Once you've tested the core functionality:

1. **Share feedback** with the app creator
2. **Rate the experience** - is it ready for real use?
3. **Suggest improvements** - what would make it amazing?
4. **Plan real tournaments** - ready to compete for real prizes?

---

**Have fun testing! May the best bidder win! 🏆⚽**