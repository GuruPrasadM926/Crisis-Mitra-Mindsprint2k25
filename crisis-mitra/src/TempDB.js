// TempDB.jsx - Temporary Database for user registration and authentication
// Uses localStorage to persist data

class UserDatabase {
    constructor() {
        this.storageKey = 'sevaHubUsers'
        this.loadUsers()
    }

    loadUsers() {
        const stored = localStorage.getItem(this.storageKey)
        this.users = stored ? JSON.parse(stored) : []
    }

    saveUsers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.users))
    }

    // Register a new user
    registerUser(userData) {
        // Check if user already exists
        if (this.users.some(user => user.email === userData.email)) {
            return { success: false, message: 'User with this email already exists' }
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            city: userData.city || '',
            pincode: userData.pincode || '',
            dob: userData.dob || '',
            role: userData.role || 'general',
            profilePhoto: null,
            volunteerSkills: [],
            donorInfo: userData.donorInfo || null,
            history: [],
            registeredAt: new Date().toISOString()
        }

        this.users.push(newUser)
        this.saveUsers()
        return { success: true, message: 'User registered successfully', user: newUser }
    }

    // Authenticate user (login)
    authenticateUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password)

        if (!user) {
            return { success: false, message: 'Invalid email or password' }
        }

        return { success: true, message: 'Login successful', user }
    }

    // Get user by email
    getUserByEmail(email) {
        return this.users.find(u => u.email === email)
    }

    // Get user by ID
    getUserById(id) {
        return this.users.find(u => u.id === id)
    }

    // Update user profile
    updateUser(id, userData) {
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) {
            return { success: false, message: 'User not found' }
        }

        this.users[index] = { ...this.users[index], ...userData }
        this.saveUsers()
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
    }
}

// Export singleton instance
export const userDB = new UserDatabase()

// Also export the class for testing
export default UserDatabase
