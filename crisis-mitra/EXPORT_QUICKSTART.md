# 🎯 Developer Export - Quick Start

## What's New?

You now have a **real-time data export system** for developers:

✅ **Automatic background syncing** - All app data syncs to persistent files  
✅ **CSV & JSON exports** - Download data in both formats  
✅ **API endpoints** - Access data via HTTP (no UI required)  
✅ **Real-time updates** - Files update instantly when data changes  

---

## 🚀 Start Using It

### 1. Start Both Services
```bash
npm run dev
```

This starts:
- React app on `http://localhost:5174`
- Export API on `http://localhost:3001`

### 2. Download Data

**Option A: Browser**
- Go to `http://localhost:3001/api/export/csv` (downloads CSV)
- Go to `http://localhost:3001/api/export/json` (downloads JSON)

**Option B: Command Line**
```bash
curl http://localhost:3001/api/export/csv > data.csv
curl http://localhost:3001/api/export/json > data.json
```

**Option C: Python**
```python
import requests

# Get CSV
csv_data = requests.get('http://localhost:3001/api/export/csv').text
print(csv_data)

# Get JSON
json_data = requests.get('http://localhost:3001/api/export/json').json()
print(json_data)
```

### 3. Check File Status
```bash
curl http://localhost:3001/api/export/files | jq .
```

---

## 📊 Key Features

| Feature | Description |
|---------|-------------|
| **Real-time Sync** | Data updates instantly in CSV/JSON files |
| **Persistent Files** | Files saved to `exported-data/` folder |
| **8 Data Sections** | Users, Requests, Alerts, Tasks, etc. |
| **No Manual Export** | Automatic background sync (no button clicks) |
| **Developer API** | HTTP endpoints for programmatic access |
| **Status Display** | Check last update time with `/api/health` |

---

## 📍 Where Are Files Saved?

```
crisis-mitra/exported-data/
  ├── SevaHub_Data.csv
  └── SevaHub_Data.json
```

Both files **auto-update** when you make changes in the app.

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/export/csv` | Download CSV file |
| GET | `/api/export/json` | Download JSON file |
| GET | `/api/export/files` | List files & metadata |
| GET | `/api/health` | Check server status |
| POST | `/api/sync-data` | Manual sync trigger |

**Base URL:** `http://localhost:3001`

---

## ⚡ Common Tasks

### View file update times
```bash
curl http://localhost:3001/api/export/files
```

### Check if server is running
```bash
curl http://localhost:3001/api/health
```

### Open CSV in Excel (Mac)
```bash
curl http://localhost:3001/api/export/csv | open -f -a Excel
```

### Stream data to Python script
```bash
curl http://localhost:3001/api/export/json | python3 my_script.py
```

---

## 🔍 Troubleshooting

**Q: Backend not starting?**  
A: Try a different port:
```bash
PORT=3002 npm run dev:server
```

**Q: Files not updating?**  
A: Check server console - should show `✅ Data synced to backend`

**Q: Can't access API?**  
A: Verify backend is running:
```bash
curl http://localhost:3001/api/health
```

---

## 📖 Full Documentation

See **DEVELOPER_EXPORT_GUIDE.md** for:
- Complete API reference
- Code examples (Python, JavaScript, Bash)
- Configuration options
- Security notes
- CSV format specifications

---

## 🎁 What Gets Exported?

**8 Data Sections in CSV:**
1. All Registered Users
2. Current Logged-in User
3. Service Requests (with status)
4. Incoming Blood/Organ Alerts
5. Upcoming Donor Tasks
6. Completed Donor Tasks
7. Volunteer Upcoming Tasks
8. Volunteer Completed Tasks

**JSON Export includes:**
- All 8 sections
- Full object structures
- Timestamps for all updates
- Last sync time

---

## ✨ Example: Track Donation Requests

**Get all service requests as JSON:**
```bash
curl http://localhost:3001/api/export/json | jq '.appData.serviceRequests'
```

**Filter by status:**
```bash
curl http://localhost:3001/api/export/json | jq '.appData.serviceRequests[] | select(.status=="pending")'
```

**Count total requests:**
```bash
curl http://localhost:3001/api/export/json | jq '.appData.serviceRequests | length'
```

---

## 🎯 That's It!

You're ready to use the real-time developer export system. Make changes in the app, and they automatically sync to persistent CSV/JSON files that you can access via API.

**Happy developing! 🚀**
