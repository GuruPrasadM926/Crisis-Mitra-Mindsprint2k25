import { useState } from 'react'
import './Dashboard.css'

function Dashboard({ userName = 'User', onLogout, onNeedyClick }) {
    const [selectedRole, setSelectedRole] = useState(null)

    const handleNeedyClick = () => {
        setSelectedRole('needy')
        if (onNeedyClick) {
            onNeedyClick()
        }
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>SEVA HUB</h1>
                    <div className="profile-top">
                        <div className="profile-icon-small">👤</div>
                        <span className="user-name-small">{userName}</span>
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
                                onClick={() => setSelectedRole('volunteer')}
                                title="Volunteer"
                            >
                                <span className="role-icon">🤝</span>
                                <span className="role-text">Volunteer</span>
                            </button>

                            <button
                                className={`role-button needy ${selectedRole === 'needy' ? 'active' : ''}`}
                                onClick={handleNeedyClick}
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
