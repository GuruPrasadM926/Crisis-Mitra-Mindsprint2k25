# 🔧 Developer Export API Guide

## Overview

The app now includes a **real-time data export backend** that continuously syncs all application data to persistent CSV and JSON files. Developers can access this data via API endpoints without needing the app UI.

---

## 🚀 Getting Started

### Start Both Services
```bash
npm run dev
```

This command starts:
- **Vite Dev Server** on `http://localhost:5174` (React app)
- **Express Server** on `http://localhost:3001` (Data export API)

### Alternative: Start Services Separately
```bash
# Terminal 1: Start Express backend only
npm run dev:server

# Terminal 2: Start Vite frontend only
npm run dev:vite
```

---

## 📊 API Endpoints

### 1. **GET** `/api/export/csv`
Download the latest CSV export with all app data.

**URL:** `http://localhost:3001/api/export/csv`

**Response:** CSV file download (SevaHub_Data.csv)

**Includes 8 Sections:**
- Registered Users
- Current Logged-in User
- Service Requests
- Incoming Alerts (Blood/Organ)
- Upcoming Alerts (Donor Tasks)
- Completed Alerts (Donor Tasks)
- Volunteer Upcoming Tasks
- Volunteer Completed Tasks

**Example:**
```bash
curl http://localhost:3001/api/export/csv > data.csv
```

---

### 2. **GET** `/api/export/json`
Download the latest JSON export with all app data.

**URL:** `http://localhost:3001/api/export/json`

**Response:** JSON file download (SevaHub_Data.json)

**Example:**
```bash
curl http://localhost:3001/api/export/json > data.json
```

---

### 3. **POST** `/api/sync-data`
Manually trigger data sync (Called automatically by frontend).

**URL:** `http://localhost:3001/api/sync-data`

**Request Body:**
```json
{
  "users": [],
  "authUser": { ... },
  "appData": {
    "serviceRequests": [],
    "incomingAlerts": [],
    "upcomingAlerts": [],
    "completedAlerts": [],
    "volunteerUpcomingTasks": [],
    "volunteerCompletedTasks": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data synced successfully",
  "lastUpdated": "2025-12-12T10:30:45.123Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/sync-data \
  -H "Content-Type: application/json" \
  -d '{"users": [], "authUser": null, "appData": {}}'
```

---

### 4. **GET** `/api/export/files`
List all exported files with metadata.

**URL:** `http://localhost:3001/api/export/files`

**Response:**
```json
{
  "files": [
    {
      "name": "SevaHub_Data.csv",
      "size": 2048,
      "lastModified": "2025-12-12T10:30:45.123Z"
    },
    {
      "name": "SevaHub_Data.json",
      "size": 4096,
      "lastModified": "2025-12-12T10:30:45.123Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/export/files | jq .
```

---

### 5. **GET** `/api/health`
Check backend health and last sync status.

**URL:** `http://localhost:3001/api/health`

**Response:**
```json
{
  "status": "ok",
  "lastDataUpdate": "2025-12-12T10:30:45.123Z",
  "exportDir": "/workspaces/Crisis-Mitra-Mindsprint2k25/crisis-mitra/exported-data"
}
```

**Example:**
```bash
curl http://localhost:3001/api/health | jq .
```

---

## 📁 File Locations

All exported files are stored in:
```
/workspaces/Crisis-Mitra-Mindsprint2k25/crisis-mitra/exported-data/
```

**Files:**
- `SevaHub_Data.csv` - CSV format with 8 sections
- `SevaHub_Data.json` - JSON format

These files are **auto-updated** whenever app data changes (real-time sync).

---

## 🔄 Real-Time Sync Flow

```
User creates/updates request/alert
            ↓
React State updates
            ↓
useEffect triggers
            ↓
Data saved to localStorage
            ↓
Sync function called
            ↓
POST /api/sync-data
            ↓
Backend receives data
            ↓
CSV file updated (exported-data/SevaHub_Data.csv)
JSON file updated (exported-data/SevaHub_Data.json)
            ↓
Developer can download via API
```

---

## 💻 Usage Examples

### Python Example: Download and Read CSV
```python
import requests
import pandas as pd

# Download CSV
response = requests.get('http://localhost:3001/api/export/csv')
with open('app_data.csv', 'wb') as f:
    f.write(response.content)

# Read with pandas
df = pd.read_csv('app_data.csv')
print(df.head())
```

### JavaScript Example: Fetch JSON
```javascript
const response = await fetch('http://localhost:3001/api/export/json');
const data = await response.json();

console.log('Users:', data.users);
console.log('Service Requests:', data.appData.serviceRequests);
console.log('Last Updated:', data.lastUpdated);
```

### Bash Script: Monitor File Updates
```bash
#!/bin/bash

while true; do
  curl -s http://localhost:3001/api/export/files | jq '.files[0].lastModified'
  sleep 5
done
```

### curl: Direct Download
```bash
# Download CSV
curl http://localhost:3001/api/export/csv -o ~/Downloads/crisis-mitra-data.csv

# Download JSON
curl http://localhost:3001/api/export/json -o ~/Downloads/crisis-mitra-data.json

# Check file size
curl http://localhost:3001/api/export/files | jq '.files'
```

---

## ⚙️ Configuration

### Change Backend Port
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

Or set environment variable:
```bash
PORT=8000 npm run dev:server
```

### Change Export Directory
Edit `server.js`:
```javascript
const exportDir = path.join(__dirname, 'exported-data');
```

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill the process
kill -9 <PID>

# Try different port
PORT=3002 npm run dev:server
```

### CORS errors in browser console?
The backend allows CORS for all origins. If you still see errors:
1. Check that backend is running: `curl http://localhost:3001/api/health`
2. Check browser console for actual errors
3. Try accessing API directly in browser: `http://localhost:3001/api/export/files`

### Files not updating?
1. Check backend console for sync logs
2. Verify app is making changes (create a new request)
3. Check file timestamps: `curl http://localhost:3001/api/export/files | jq '.files[].lastModified'`

### "Cannot reach backend server" warning?
This warning appears if the backend isn't running. The app still works, but sync won't happen:
1. Start backend: `npm run dev:server`
2. Or use `npm run dev` to start both services

---

## 📊 CSV Format

### Section 1: Registered Users
```
ID,Name,Email,Phone,City,Pincode,DOB,Blood Type,Role,Age,Created At
```

### Section 2: Current Logged-in User
```
ID,Name,Email,Phone,Age,Blood Type,Role
```

### Section 3: Service Requests
```
ID,Name,Service,Date,Place,Phone,Email,Status,Blood Type,Accepted By,Accepted By Needy,Rejected By Needy,Rejection Reason,Number of Acceptances
```

### Section 4: Incoming Alerts
```
ID,Blood Type,Units,Hospital,Urgency,Requester,Contact,Accepted By Needy,Rejected By Needy,Rejection Reason,Created At
```

### Sections 5-8
Similar structure for Upcoming Alerts, Completed Alerts, Volunteer Tasks, etc.

---

## 🔐 Security Notes

- **No Authentication Required** (Development mode)
- **No Database Validation** (Direct file access)
- **CORS Enabled** for all origins
- **For Production:** Add authentication, input validation, and database integration

---

## 📝 Logs

Check server console output for:
```
✅ Data synced to backend          (from frontend)
⚠️ Backend sync failed: [status]   (sync error)
⚠️ Cannot reach backend server     (connection error)
```

---

## 🎯 Next Steps

1. ✅ Both Vite and Express running
2. ✅ Make changes in the app
3. ✅ Download data via `/api/export/csv` or `/api/export/json`
4. ✅ Use exported data in external tools (Excel, Python, etc.)

Enjoy your real-time data export! 🚀
