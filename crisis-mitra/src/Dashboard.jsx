import { useState } from 'react'
import './Dashboard.css'

function Dashboard({ userName = 'User', onLogout, onRoleSelect, onProfileClick }) {
    const [selectedRole, setSelectedRole] = useState(null)

    const handleRoleSelect = (role) => {
        setSelectedRole(role)
        if (onRoleSelect) onRoleSelect(role)
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>SEVA HUB</h1>
                    <div className="header-actions">
                        <button
                            className="profile-btn"
                            onClick={onProfileClick}
                            title="View Profile"
                        >
                            <div className="profile-icon-small">👤</div>
                            <span className="user-name-small">{userName}</span>
                        </button>
                        {(userName && userName !== '' && userName !== 'User') && (
                            <button className="logout-btn" onClick={onLogout}>Logout</button>
                        )}
                    </div>
                </div>
            </header>

            <div className="dashboard-main">
                <main className="dashboard-content">
                    {/* Role Selection Section */}
                    <div className="role-section">
                        <h2 className="role-title">Select Your Role</h2>
                        <div className="role-container">
                            <button
                                className={`role-button volunteer ${selectedRole === 'volunteer' ? 'active' : ''}`}
                                onClick={() => handleRoleSelect('volunteer')}
                                title="Volunteer/Donor"
                            >
                                <span className="role-icon">🤝</span>
                                <span className="role-text">Volunteer/Donor</span>
                            </button>

                            <button
                                className={`role-button needy ${selectedRole === 'needy' ? 'active' : ''}`}
                                onClick={() => handleRoleSelect('needy')}
                                title="Needy"
                            >
                                <span className="role-icon">🆘</span>
                                <span className="role-text">Needy</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
