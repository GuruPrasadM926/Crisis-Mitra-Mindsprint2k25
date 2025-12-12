import { ref, set, get, update, remove, onValue, off } from 'firebase/database'
import { db } from './firebase'

// Firebase Realtime Database wrapper
// All data stored at: /users/{userId}/...

export const FirebaseDB = {
  // ===== USER OPERATIONS =====
  
  // Save user profile (at signup/login)
  async saveUser(userId, userData) {
    try {
      await set(ref(db, `users/${userId}/profile`), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log('✅ User saved to Firebase:', userId)
      return true
    } catch (error) {
      console.error('❌ Error saving user to Firebase:', error)
      return false
    }
  },

  // Get user profile
  async getUser(userId) {
    try {
      const snapshot = await get(ref(db, `users/${userId}/profile`))
      if (snapshot.exists()) {
        console.log('✅ User loaded from Firebase:', userId)
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error('❌ Error getting user from Firebase:', error)
      return null
    }
  },

  // Update user profile
  async updateUser(userId, userData) {
    try {
      await update(ref(db, `users/${userId}/profile`), {
        ...userData,
        updatedAt: new Date().toISOString()
      })
      console.log('✅ User updated in Firebase:', userId)
      return true
    } catch (error) {
      console.error('❌ Error updating user in Firebase:', error)
      return false
    }
  },

  // ===== APP DATA OPERATIONS =====

  // Save all app data (requests, alerts, tasks)
  async saveAppData(userId, appData) {
    try {
      await set(ref(db, `users/${userId}/appData`), {
        serviceRequests: appData.serviceRequests || [],
        incomingAlerts: appData.incomingAlerts || [],
        upcomingAlerts: appData.upcomingAlerts || [],
        completedAlerts: appData.completedAlerts || [],
        volunteerUpcomingTasks: appData.volunteerUpcomingTasks || [],
        volunteerCompletedTasks: appData.volunteerCompletedTasks || [],
        lastSyncAt: new Date().toISOString(),
        syncCount: (appData.syncCount || 0) + 1
      })
      console.log('✅ App data saved to Firebase:', userId)
      return true
    } catch (error) {
      console.error('❌ Error saving app data to Firebase:', error)
      return false
    }
  },

  // Get all app data
  async getAppData(userId) {
    try {
      const snapshot = await get(ref(db, `users/${userId}/appData`))
      if (snapshot.exists()) {
        console.log('✅ App data loaded from Firebase:', userId)
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error('❌ Error getting app data from Firebase:', error)
      return null
    }
  },

  // Update specific part of app data
  async updateAppData(userId, updates) {
    try {
      const updateData = {
        ...updates,
        lastSyncAt: new Date().toISOString()
      }
      await update(ref(db, `users/${userId}/appData`), updateData)
      console.log('✅ App data updated in Firebase:', userId)
      return true
    } catch (error) {
      console.error('❌ Error updating app data in Firebase:', error)
      return false
    }
  },

  // ===== SERVICE REQUESTS OPERATIONS =====

  async saveServiceRequest(userId, requestId, requestData) {
    try {
      await set(ref(db, `users/${userId}/appData/serviceRequests/${requestId}`), {
        ...requestData,
        id: requestId,
        createdAt: new Date().toISOString()
      })
      console.log('✅ Service request saved:', requestId)
      return true
    } catch (error) {
      console.error('❌ Error saving service request:', error)
      return false
    }
  },

  async updateServiceRequest(userId, requestId, updates) {
    try {
      await update(ref(db, `users/${userId}/appData/serviceRequests/${requestId}`), {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      console.log('✅ Service request updated:', requestId)
      return true
    } catch (error) {
      console.error('❌ Error updating service request:', error)
      return false
    }
  },

  async deleteServiceRequest(userId, requestId) {
    try {
      await remove(ref(db, `users/${userId}/appData/serviceRequests/${requestId}`))
      console.log('✅ Service request deleted:', requestId)
      return true
    } catch (error) {
      console.error('❌ Error deleting service request:', error)
      return false
    }
  },

  // ===== ALERTS OPERATIONS =====

  async saveAlert(userId, alertType, alertId, alertData) {
    try {
      await set(ref(db, `users/${userId}/appData/${alertType}/${alertId}`), {
        ...alertData,
        id: alertId,
        createdAt: new Date().toISOString()
      })
      console.log(`✅ Alert saved (${alertType}):`, alertId)
      return true
    } catch (error) {
      console.error(`❌ Error saving alert (${alertType}):`, error)
      return false
    }
  },

  async updateAlert(userId, alertType, alertId, updates) {
    try {
      await update(ref(db, `users/${userId}/appData/${alertType}/${alertId}`), {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      console.log(`✅ Alert updated (${alertType}):`, alertId)
      return true
    } catch (error) {
      console.error(`❌ Error updating alert (${alertType}):`, error)
      return false
    }
  },

  async deleteAlert(userId, alertType, alertId) {
    try {
      await remove(ref(db, `users/${userId}/appData/${alertType}/${alertId}`))
      console.log(`✅ Alert deleted (${alertType}):`, alertId)
      return true
    } catch (error) {
      console.error(`❌ Error deleting alert (${alertType}):`, error)
      return false
    }
  },

  // ===== REAL-TIME SYNC =====

  // Listen to all app data changes in real-time
  listenToAppData(userId, callback) {
    try {
      const dataRef = ref(db, `users/${userId}/appData`)
      onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log('🔄 Real-time data update from Firebase:', userId)
          callback(snapshot.val())
        }
      }, (error) => {
        console.error('❌ Real-time listener error:', error)
      })
      return () => off(dataRef) // Return unsubscribe function
    } catch (error) {
      console.error('❌ Error setting up real-time listener:', error)
      return null
    }
  },

  // Listen to specific alert type changes
  listenToAlerts(userId, alertType, callback) {
    try {
      const alertRef = ref(db, `users/${userId}/appData/${alertType}`)
      onValue(alertRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log(`🔄 Real-time ${alertType} update from Firebase:`, userId)
          callback(snapshot.val())
        }
      }, (error) => {
        console.error(`❌ Real-time ${alertType} listener error:`, error)
      })
      return () => off(alertRef)
    } catch (error) {
      console.error(`❌ Error setting up ${alertType} listener:`, error)
      return null
    }
  },

  // ===== BULK OPERATIONS =====

  // Save entire user data (profile + appData)
  async saveCompleteUserData(userId, profileData, appData) {
    try {
      await set(ref(db, `users/${userId}`), {
        profile: {
          ...profileData,
          updatedAt: new Date().toISOString()
        },
        appData: {
          serviceRequests: appData.serviceRequests || [],
          incomingAlerts: appData.incomingAlerts || [],
          upcomingAlerts: appData.upcomingAlerts || [],
          completedAlerts: appData.completedAlerts || [],
          volunteerUpcomingTasks: appData.volunteerUpcomingTasks || [],
          volunteerCompletedTasks: appData.volunteerCompletedTasks || [],
          lastSyncAt: new Date().toISOString()
        }
      })
      console.log('✅ Complete user data saved to Firebase:', userId)
      return true
    } catch (error) {
      console.error('❌ Error saving complete user data:', error)
      return false
    }
  },

  // Get entire user data
  async getCompleteUserData(userId) {
    try {
      const snapshot = await get(ref(db, `users/${userId}`))
      if (snapshot.exists()) {
        console.log('✅ Complete user data loaded from Firebase:', userId)
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error('❌ Error getting complete user data:', error)
      return null
    }
  }
}

export default FirebaseDB
