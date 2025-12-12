# Firebase Setup Instructions

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it: `SEVA-HUB`
4. Click "Create project"

## Step 2: Set Up Realtime Database
1. In Firebase Console, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose region: `asia-south1` (India)
4. Start in **Test mode** (for development)
5. Click "Enable"

## Step 3: Get Your Firebase Credentials
1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", click "Web app" or create one
3. Copy the Firebase config object
4. Update `/src/firebaseConfig.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  appId: "YOUR_APP_ID"
}
```

## Step 4: Set Database Rules (For Testing)
In Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    }
  }
}
```

⚠️ **Warning**: These rules are for development only! For production, add proper authentication.

## Step 5: Test the Application
1. Run: `npm run dev`
2. Try signing up with any role
3. Check Firebase Console → Realtime Database to see stored users
4. Login should now work!

## What's Connected to Firebase?

✅ All 6 signup pages:
- VolunteerSignup
- DonorSignup
- NeedySignup
- LoginPage
- VolunteerLogin
- DonorLogin
- NeedyLogin

✅ All user data stored:
- Name, Email, Phone
- City, Pincode, DOB
- Password (encrypted recommended for production)
- Blood Type (for donors)
- Age, Role
- All volunteer skills

## How It Works

1. **Signup**: Data saved to Firebase `users/` collection
2. **Login**: Credentials matched against Firebase database
3. **Updates**: Profile changes sync to Firebase in real-time
4. **No local storage**: All data persists in cloud

## If You Get "Database Not Found" Error

The firebaseConfig.js needs your actual Firebase credentials. Without them, the app will fall back to empty arrays, but signup/login will still work locally for testing purposes.

## Production Checklist

Before going live:
- [ ] Update Firebase rules for authentication
- [ ] Add password hashing (bcrypt or similar)
- [ ] Enable Firestore backups
- [ ] Set up Firebase security rules properly
- [ ] Remove test mode restrictions
- [ ] Add rate limiting for login attempts
