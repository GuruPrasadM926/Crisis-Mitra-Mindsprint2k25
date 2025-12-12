import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Store for data received from frontend
let appData = {
  users: [],
  authUser: null,
  appData: null,
  lastUpdated: null
};

// Directories
const exportDir = path.join(__dirname, 'exported-data');

// Create exported-data directory if it doesn't exist
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// ==================== UTILITY FUNCTIONS ====================

const convertToCSV = (data) => {
  let csv = '';

  // 1. Registered Users
  csv += 'REGISTERED USERS\n';
  csv += 'ID,Name,Email,Phone,City,Pincode,DOB,Blood Type,Role,Age,Created At\n';
  if (data.users && Array.isArray(data.users)) {
    data.users.forEach(user => {
      csv += `"${user.id || ''}","${user.name || ''}","${user.email || ''}","${user.phone || ''}","${user.city || ''}","${user.pincode || ''}","${user.dob || ''}","${user.bloodType || ''}","${user.role || ''}","${user.age || ''}","${user.createdAt || ''}"\n`;
    });
  }
  csv += '\n';

  // 2. Current Logged-in User
  csv += 'CURRENT LOGGED-IN USER\n';
  csv += 'ID,Name,Email,Phone,Age,Blood Type,Role\n';
  if (data.authUser) {
    csv += `"${data.authUser.id || ''}","${data.authUser.name || ''}","${data.authUser.email || ''}","${data.authUser.phone || ''}","${data.authUser.age || ''}","${data.authUser.bloodType || ''}","${data.authUser.role || ''}"\n`;
  }
  csv += '\n';

  // 3. Service Requests
  csv += 'SERVICE REQUESTS\n';
  csv += 'ID,Name,Service,Date,Place,Phone,Email,Status,Blood Type,Accepted By,Accepted By Needy,Rejected By Needy,Rejection Reason,Number of Acceptances\n';
  if (data.appData && data.appData.serviceRequests) {
    data.appData.serviceRequests.forEach(req => {
      const acceptances = req.acceptances ? req.acceptances.map(a => a.volunteerId || a.donorId).join(';') : '';
      csv += `"${req.id || ''}","${req.name || ''}","${req.service || ''}","${req.date || ''}","${req.place || ''}","${req.phone || ''}","${req.email || ''}","${req.status || ''}","${req.bloodType || ''}","${acceptances}","${req.acceptedByNeedy ? 'Yes' : 'No'}","${req.rejectedByNeedy ? 'Yes' : 'No'}","${req.rejectionReason || ''}","${req.acceptances ? req.acceptances.length : 0}"\n`;
    });
  }
  csv += '\n';

  // 4. Incoming Alerts
  csv += 'INCOMING ALERTS (BLOOD/ORGAN)\n';
  csv += 'ID,Blood Type,Units,Hospital,Urgency,Requester,Contact,Accepted By Needy,Rejected By Needy,Rejection Reason,Created At\n';
  if (data.appData && data.appData.incomingAlerts) {
    data.appData.incomingAlerts.forEach(alert => {
      csv += `"${alert.id || ''}","${alert.bloodType || ''}","${alert.units || ''}","${alert.hospital || ''}","${alert.urgency || ''}","${alert.requesterName || ''}","${alert.requesterContact || ''}","${alert.acceptedByNeedy ? 'Yes' : 'No'}","${alert.rejectedByNeedy ? 'Yes' : 'No'}","${alert.rejectionReason || ''}","${alert.createdAt || ''}"\n`;
    });
  }
  csv += '\n';

  // 5. Upcoming Alerts (Donor Tasks)
  csv += 'UPCOMING ALERTS (DONOR TASKS)\n';
  csv += 'ID,Blood Type,Units,Hospital,Urgency,Accepted By,Accepted At\n';
  if (data.appData && data.appData.upcomingAlerts) {
    data.appData.upcomingAlerts.forEach(alert => {
      csv += `"${alert.id || ''}","${alert.bloodType || ''}","${alert.units || ''}","${alert.hospital || ''}","${alert.urgency || ''}","${alert.acceptedBy || ''}","${alert.acceptedAt || ''}"\n`;
    });
  }
  csv += '\n';

  // 6. Completed Alerts (Donor Tasks)
  csv += 'COMPLETED ALERTS (DONOR TASKS)\n';
  csv += 'ID,Blood Type,Units,Hospital,Urgency,Status,Completed At\n';
  if (data.appData && data.appData.completedAlerts) {
    data.appData.completedAlerts.forEach(alert => {
      csv += `"${alert.id || ''}","${alert.bloodType || ''}","${alert.units || ''}","${alert.hospital || ''}","${alert.urgency || ''}","${alert.status || ''}","${alert.completedAt || ''}"\n`;
    });
  }
  csv += '\n';

  // 7. Volunteer Upcoming Tasks
  csv += 'VOLUNTEER UPCOMING TASKS\n';
  csv += 'ID,Service,Date,Place,Volunteer Name,Accepted By,Accepted At\n';
  if (data.appData && data.appData.volunteerUpcomingTasks) {
    data.appData.volunteerUpcomingTasks.forEach(task => {
      csv += `"${task.id || ''}","${task.service || ''}","${task.date || ''}","${task.place || ''}","${task.volunteerName || ''}","${task.acceptedBy || ''}","${task.acceptedAt || ''}"\n`;
    });
  }
  csv += '\n';

  // 8. Volunteer Completed Tasks
  csv += 'VOLUNTEER COMPLETED TASKS\n';
  csv += 'ID,Service,Date,Place,Volunteer Name,Status,Completed At\n';
  if (data.appData && data.appData.volunteerCompletedTasks) {
    data.appData.volunteerCompletedTasks.forEach(task => {
      csv += `"${task.id || ''}","${task.service || ''}","${task.date || ''}","${task.place || ''}","${task.volunteerName || ''}","${task.status || ''}","${task.completedAt || ''}"\n`;
    });
  }

  return csv;
};

// ==================== ROUTES ====================

// Receive data from frontend for background sync
app.post('/api/sync-data', (req, res) => {
  try {
    appData = {
      users: req.body.users || [],
      authUser: req.body.authUser || null,
      appData: req.body.appData || null,
      lastUpdated: new Date().toISOString()
    };

    // Immediately update CSV file
    const csvContent = convertToCSV(appData);
    fs.writeFileSync(path.join(exportDir, 'SevaHub_Data.csv'), csvContent);

    // Immediately update JSON file
    const jsonContent = JSON.stringify(appData, null, 2);
    fs.writeFileSync(path.join(exportDir, 'SevaHub_Data.json'), jsonContent);

    res.json({ 
      success: true, 
      message: 'Data synced successfully',
      lastUpdated: appData.lastUpdated 
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get CSV export endpoint
app.get('/api/export/csv', (req, res) => {
  try {
    const filePath = path.join(exportDir, 'SevaHub_Data.csv');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="SevaHub_Data.csv"');
      res.send(content);
    } else {
      res.status(404).json({ error: 'No data available yet' });
    }
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get JSON export endpoint
app.get('/api/export/json', (req, res) => {
  try {
    const filePath = path.join(exportDir, 'SevaHub_Data.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="SevaHub_Data.json"');
      res.send(content);
    } else {
      res.status(404).json({ error: 'No data available yet' });
    }
  } catch (error) {
    console.error('JSON export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get export files directory listing
app.get('/api/export/files', (req, res) => {
  try {
    const files = fs.readdirSync(exportDir);
    const fileDetails = files.map(file => {
      const filePath = path.join(exportDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        lastModified: stats.mtime.toISOString()
      };
    });
    res.json({ files: fileDetails });
  } catch (error) {
    console.error('Files list error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    lastDataUpdate: appData.lastUpdated,
    exportDir: exportDir
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n✅ Developer Export Server running on http://localhost:${PORT}`);
  console.log(`\n📊 API Endpoints:`);
  console.log(`   POST   http://localhost:${PORT}/api/sync-data         (Frontend sends data for sync)`);
  console.log(`   GET    http://localhost:${PORT}/api/export/csv        (Download latest CSV)`);
  console.log(`   GET    http://localhost:${PORT}/api/export/json       (Download latest JSON)`);
  console.log(`   GET    http://localhost:${PORT}/api/export/files      (List exported files)`);
  console.log(`   GET    http://localhost:${PORT}/api/health           (Health check)`);
  console.log(`\n📁 Persistent export files location: ${exportDir}`);
  console.log(`\n🔄 Files auto-update when frontend data changes\n`);
});
