import { useState, useEffect } from 'react'
import './UserProfile.css'
import { userDB } from './TempDB'
import { calculateAge } from './utils'

function UserProfile({ userId, userName, onBack, onLogout }) {
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        name: '',
        phone: '',
        email: ''
    })
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Load user data when component mounts or userId changes
    useEffect(() => {
        const userData = userDB.getUserById(userId)
        setUser(userData)
        if (userData) {
            setProfilePhoto(userData.profilePhoto || null)
            setEditData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || ''
            })
        }
    }, [userId])

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePhoto(reader.result)
                userDB.updateUser(userId, { profilePhoto: reader.result })
                setSuccess('Profile photo updated!')
                setTimeout(() => setSuccess(''), 3000)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemovePhoto = () => {
        setProfilePhoto(null)
        userDB.updateUser(userId, { profilePhoto: null })
        setSuccess('Profile photo removed!')
        setTimeout(() => setSuccess(''), 3000)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
    }

    const handleSaveChanges = () => {
        if (!editData.name || !editData.phone || !editData.email) {
            setError('Please fill in all fields')
            return
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(editData.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number (10 digits)')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editData.email)) {
            setError('Please enter a valid email address')
            return
        }

        const result = userDB.updateUser(userId, {
            name: editData.name,
            phone: editData.phone,
            email: editData.email
        })

        if (result.success) {
            setUser(result.user)
            setIsEditing(false)
            setError('')
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } else {
            setError(result.message)
        }
    }

    const age = user?.dob ? calculateAge(user.dob) : 'N/A'

    return (
        <div className="profile-container">
            <div className="profile-header">
                <button className="back-btn" onClick={onBack}>← Back</button>
                <h1>My Profile</h1>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>

            <div className="profile-card">
                {/* Profile Photo Section */}
                <div className="photo-section">
                    <div className="profile-photo">
                        {profilePhoto ? (
                            <img src={profilePhoto} alt="Profile" />
                        ) : (
                            <div className="photo-placeholder">👤</div>
                        )}
                    </div>
                    <div className="photo-actions">
                        <label className="upload-btn">
                            + Add Photo
                            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                        </label>
                        {profilePhoto && (
                            <button className="remove-btn" onClick={handleRemovePhoto}>
                                Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="profile-info">
                    {!isEditing ? (
                        <div className="info-display">
                            <div className="info-row">
                                <label>Name:</label>
                                <span>{user?.name || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <label>Phone:</label>
                                <span>{user?.phone || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <label>Email:</label>
                                <span>{user?.email || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <label>Age:</label>
                                <span>{age}</span>
                            </div>
                            <div className="info-row">
                                <label>Date of Birth:</label>
                                <span>{user?.dob || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <label>City:</label>
                                <span>{user?.city || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <label>Pincode:</label>
                                <span>{user?.pincode || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <label>Role:</label>
                                <span className="role-badge">{user?.role?.toUpperCase() || 'N/A'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="info-edit">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleEditChange}
                                />
                            </div>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {!isEditing ? (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            ✎ Edit Profile
                        </button>
                    ) : (
                        <div className="button-group">
                            <button className="save-btn" onClick={handleSaveChanges}>
                                Save Changes
                            </button>
                            <button className="cancel-btn" onClick={() => {
                                setIsEditing(false)
                                setEditData({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
                            }}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Skills & History Sections */}
            {user?.role === 'volunteer' && (
                <div className="additional-info">
                    <div className="info-section">
                        <h3>Volunteer Skills</h3>
                        <div className="skills-list">
                            {user?.volunteerSkills && user.volunteerSkills.length > 0 ? (
                                user.volunteerSkills.map((skill, idx) => (
                                    <span key={idx} className="skill-badge">{skill}</span>
                                ))
                            ) : (
                                <p className="no-data">No skills added yet</p>
                            )}
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Volunteering History</h3>
                        <div className="history-list">
                            {user?.history && user.history.length > 0 ? (
                                user.history.map((item, idx) => (
                                    <div key={idx} className="history-item">
                                        <span className="date">{item.date}</span>
                                        <span className="activity">{item.activity}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No history yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {user?.role === 'donor' && (
                <div className="additional-info">
                    <div className="info-section">
                        <h3>Donor Information</h3>
                        {user?.donorInfo ? (
                            <div className="donor-details">
                                <div className="detail-row">
                                    <span>Blood Type:</span>
                                    <span>{user.donorInfo.bloodType || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Last Donation:</span>
                                    <span>{user.donorInfo.lastDonation || 'N/A'}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="no-data">No donor information added</p>
                        )}
                    </div>

                    <div className="info-section">
                        <h3>Donation History</h3>
                        <div className="history-list">
                            {user?.history && user.history.length > 0 ? (
                                user.history.map((item, idx) => (
                                    <div key={idx} className="history-item">
                                        <span className="date">{item.date}</span>
                                        <span className="activity">{item.activity}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No donation history</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserProfile
