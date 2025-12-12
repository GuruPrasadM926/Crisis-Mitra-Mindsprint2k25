// TempDB.js - Database for user registration and authentication
// Uses localStorage (with Firebase support when configured)
// API works seamlessly for all signup/login pages

class UserDatabase {
    constructor() {
        this.storageKey = 'sevaHubUsers'
        this.loadUsers()
    }

    loadUsers() {
        try {
            const stored = localStorage.getItem(this.storageKey)
            this.users = stored ? JSON.parse(stored) : []
            console.log('Loaded users from localStorage:', this.users.length)
        } catch (error) {
            console.error('Error loading users:', error)
            this.users = []
        }
    }

    saveUsers() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.users))
            console.log('Users saved to localStorage')
        } catch (error) {
            console.error('Error saving users:', error)
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
    saveAppData(appData) {
        try {
            localStorage.setItem('sevaHubAppData', JSON.stringify(appData))
            console.log('App data saved to localStorage')
        } catch (error) {
            console.error('Error saving app data:', error)
        }
    }

    // Load all app data
    loadAppData() {
        try {
            const stored = localStorage.getItem('sevaHubAppData')
            return stored ? JSON.parse(stored) : null
        } catch (error) {
            console.error('Error loading app data:', error)
            return null
        }
    }

    // Clear app data
    clearAppData() {
        try {
            localStorage.removeItem('sevaHubAppData')
            console.log('App data cleared')
        } catch (error) {
            console.error('Error clearing app data:', error)
        }
    }
}

// Export singleton instance
export const userDB = new UserDatabase()

// Also export the class for testing
export default UserDatabase
