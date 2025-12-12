
# 🔥 Firebase Integration Setup Guide - Crisis Mitra

## Your Firebase Project: **seva-hub** ✅

Everything is ready! Just follow these 3 simple steps to activate Firebase sync.

---

## Quick Setup (3 Minutes)

### Step 1: Create `.env.local` file
In `crisis-mitra/` folder, create `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSyBKh2HYvjLgLOkcOnpvS5lKC5miDx9GdhE
VITE_FIREBASE_AUTH_DOMAIN=seva-hub.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://seva-hub-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=seva-hub
VITE_FIREBASE_STORAGE_BUCKET=seva-hub.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=378301066908
VITE_FIREBASE_APP_ID=1:378301066908:web:80776e1a5926488e200759
```

### Step 2: Update Security Rules
Go to: **https://console.firebase.google.com/** → seva-hub → Realtime Database → Rules

Paste:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```
Click "Publish"

### Step 3: Restart App
```bash
npm run dev
```

Watch console for: `✅ Firebase is configured and enabled`

---

## ✅ Done!

Your data now syncs to the cloud automatically. Check Firebase Console to see your data in real-time!
