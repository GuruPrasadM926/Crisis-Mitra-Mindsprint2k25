// TempDB.js - Database for user registration and authentication
// Uses localStorage with optional Firebase Realtime Database sync
// API works seamlessly for all signup/login pages

import { FirebaseDB } from './FirebaseDB'

class UserDatabase {
    constructor() {
        this.storageKey = 'sevaHubUsers'
        this.firebaseEnabled = false
        this.currentUserId = null
        this.loadUsers()
        this.checkFirebaseConfig()
    }

    // Check if Firebase is configured
    checkFirebaseConfig() {
        try {
            if (import.meta.env.VITE_FIREBASE_API_KEY && 
                import.meta.env.VITE_FIREBASE_API_KEY !== 'AIzaSyDemoKeyChangeThis') {
                this.firebaseEnabled = true
                console.log('✅ Firebase is configured and enabled')
            } else {
                console.log('⚠️ Firebase not configured - using localStorage only')
            }
        } catch (error) {
            console.log('⚠️ Firebase config check failed - using localStorage only')
        }
    }

    loadUsers() {
        try {
            const stored = localStorage.getItem(this.storageKey)
            this.users = stored ? JSON.parse(stored) : []
            console.log('✅ Loaded users from localStorage:', this.users.length)
        } catch (error) {
            console.error('❌ Error loading users:', error)
            this.users = []
        }
    }

    async saveUsers() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.users))
            console.log('✅ Users saved to localStorage')
            
            // Also sync to Firebase if enabled
            if (this.firebaseEnabled && this.currentUserId) {
                try {
                    await FirebaseDB.updateUser(this.currentUserId, { 
                        allUsers: this.users,
                        updatedAt: new Date().toISOString()
                    })
                    console.log('✅ Users synced to Firebase')
                } catch (fbError) {
                    console.warn('⚠️ Firebase sync failed:', fbError.message)
                }
            }
        } catch (error) {
            console.error('❌ Error saving users:', error)
        }
    }

    // Register a new user
    async registerUser(userData) {
        try {
            // Check if user already exists
            if (this.users.some(user => user.email === userData.email)) {
                return { success: false, message: 'User with this email already exists' }
            }

            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                city: userData.city || '',
                pincode: userData.pincode || '',
                dob: userData.dob || '',
                role: userData.role || 'general',
                age: userData.age || '',
                bloodType: userData.bloodType || '',
                profilePhoto: null,
                volunteerSkills: userData.volunteerSkills || [],
                donorInfo: userData.donorInfo || null,
                history: userData.history || [],
                registeredAt: new Date().toISOString()
            }

            this.users.push(newUser)
            this.saveUsers()
            console.log('User registered:', newUser.email)

            return { success: true, message: 'User registered successfully', user: newUser }
        } catch (error) {
            console.error('Error registering user:', error)
            return { success: false, message: 'Registration failed: ' + error.message }
        }
    }

    // Authenticate user (login)
    async authenticateUser(email, password) {
        try {
            this.loadUsers()
            const user = this.users.find(u => u.email === email && u.password === password)

            if (!user) {
                return { success: false, message: 'Invalid email or password' }
            }

            console.log('User authenticated:', email)
            return { success: true, message: 'Login successful', user }
        } catch (error) {
            console.error('Error authenticating user:', error)
            return { success: false, message: 'Authentication failed: ' + error.message }
        }
    }

    // Get user by email
    getUserByEmail(email) {
        this.loadUsers()
        return this.users.find(u => u.email === email) || null
    }

    // Get user by ID
    getUserById(id) {
        this.loadUsers()
        return this.users.find(u => u.id === id) || null
    }

    // Update user profile
    updateUser(id, userData) {
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) {
            return { success: false, message: 'User not found' }
        }

        this.users[index] = { ...this.users[index], ...userData }
        this.saveUsers()
        console.log('User updated:', id)
        return { success: true, message: 'User updated successfully', user: this.users[index] }
    }

    // Add skill to user
    addSkill(id, skill) {
        const user = this.getUserById(id)
        if (!user) return { success: false, message: 'User not found' }
        if (!user.volunteerSkills) user.volunteerSkills = []
        if (!user.volunteerSkills.includes(skill)) {
            user.volunteerSkills.push(skill)
            this.saveUsers()
        }
        return { success: true, message: 'Skill added', user }
    }

    // Remove skill from user
    removeSkill(id, skill) {
        const user = this.getUserById(id)
        if (!user) return { success: false, message: 'User not found' }
        if (user.volunteerSkills) {
            user.volunteerSkills = user.volunteerSkills.filter(s => s !== skill)
            this.saveUsers()
        }
        return { success: true, message: 'Skill removed', user }
    }

    // Get all users (for admin/debugging)
    getAllUsers() {
        return this.users
    }

    // Clear all users (for testing)
    clearAllUsers() {
        this.users = []
        this.saveUsers()
        return { success: true, message: 'All users cleared' }
    }

    // ===== SESSION & APP DATA PERSISTENCE =====

    // Save currently logged-in user
    setAuthUser(user) {
        try {
            localStorage.setItem('sevaHubAuthUser', JSON.stringify(user))
            console.log('Auth user saved:', user?.email)
        } catch (error) {
            console.error('Error saving auth user:', error)
        }
    }

    // Get currently logged-in user
    getAuthUser() {
        try {
            const stored = localStorage.getItem('sevaHubAuthUser')
            return stored ? JSON.parse(stored) : null
        } catch (error) {
            console.error('Error retrieving auth user:', error)
            return null
        }
    }

    // Clear auth user (logout)
    clearAuthUser() {
        try {
            localStorage.removeItem('sevaHubAuthUser')
            console.log('Auth user cleared')
        } catch (error) {
            console.error('Error clearing auth user:', error)
        }
    }

    // Save all app data (alerts, requests, tasks)
    async saveAppData(appData) {
        try {
            localStorage.setItem('sevaHubAppData', JSON.stringify(appData))
            console.log('✅ App data saved to localStorage')
            
            // Also sync to Firebase if enabled and user is logged in
            if (this.firebaseEnabled && this.currentUserId) {
                try {
                    await FirebaseDB.saveAppData(this.currentUserId, appData)
                    console.log('✅ App data synced to Firebase')
                } catch (fbError) {
                    console.warn('⚠️ Firebase app data sync failed:', fbError.message)
                }
            }
        } catch (error) {
            console.error('❌ Error saving app data:', error)
        }
    }

    // Load all app data
    loadAppData() {
        try {
            const stored = localStorage.getItem('sevaHubAppData')
            return stored ? JSON.parse(stored) : null
        } catch (error) {
            console.error('❌ Error loading app data:', error)
            return null
        }
    }

    // Load app data from Firebase (sync down)
    async loadAppDataFromFirebase(userId) {
        try {
            if (!this.firebaseEnabled) {
                console.log('⚠️ Firebase not enabled')
                return null
            }
            const data = await FirebaseDB.getAppData(userId)
            if (data) {
                localStorage.setItem('sevaHubAppData', JSON.stringify(data))
                console.log('✅ App data loaded from Firebase and synced to localStorage')
                return data
            }
            return null
        } catch (error) {
            console.error('❌ Error loading app data from Firebase:', error)
            return null
        }
    }

    // Clear app data
    clearAppData() {
        try {
            localStorage.removeItem('sevaHubAppData')
            console.log('✅ App data cleared')
        } catch (error) {
            console.error('❌ Error clearing app data:', error)
        }
    }

    // ===== FIREBASE SYNC OPERATIONS =====

    // Set current user ID for Firebase sync
    setCurrentUserId(userId) {
        this.currentUserId = userId
        console.log('Current user ID set for Firebase sync:', userId)
    }

    // Get Firebase enabled status
    isFirebaseEnabled() {
        return this.firebaseEnabled
    }

    // Sync current user to Firebase
    async syncUserToFirebase(userId, userData) {
        try {
            if (!this.firebaseEnabled) {
                console.log('⚠️ Firebase not enabled')
                return false
            }
            const success = await FirebaseDB.saveUser(userId, userData)
            if (success) {
                console.log('✅ User synced to Firebase:', userId)
            }
            return success
        } catch (error) {
            console.error('❌ Error syncing user to Firebase:', error)
            return false
        }
    }

    // Sync all data to Firebase
    async syncCompleteDataToFirebase(userId, profileData, appData) {
        try {
            if (!this.firebaseEnabled) {
                console.log('⚠️ Firebase not enabled')
                return false
            }
            const success = await FirebaseDB.saveCompleteUserData(userId, profileData, appData)
            if (success) {
                console.log('✅ Complete user data synced to Firebase:', userId)
            }
            return success
        } catch (error) {
            console.error('❌ Error syncing complete data to Firebase:', error)
            return false
        }
    }
}

// Export singleton instance
export const userDB = new UserDatabase()

// Also export the class for testing
export default UserDatabase
