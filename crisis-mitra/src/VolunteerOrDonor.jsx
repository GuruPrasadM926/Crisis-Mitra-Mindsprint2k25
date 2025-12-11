import { useState } from 'react'
import './VolunteerOrDonor.css'

function VolunteerOrDonor({ userName, onVolunteerSelect, onDonorSelect }) {
    const [selectedRole, setSelectedRole] = useState(null)

    const handleVolunteerClick = () => {
        setSelectedRole('volunteer')
        if (onVolunteerSelect) onVolunteerSelect()
    }

    const handleDonorClick = () => {
        setSelectedRole('donor')
        if (onDonorSelect) onDonorSelect()
    }

    return (
        <div className="vod-container">
            <header className="vod-header">
                <div className="header-content">
                    <h1>SEVA HUB</h1>
                    <div className="profile-top">
                        <div className="profile-icon-small">👤</div>
                        <span className="user-name-small">{userName}</span>
                    </div>
                </div>
            </header>

            <div className="vod-main">
                <main className="vod-content">
                    <div className="form-header">
                        <h2>Select Your Role</h2>
                        <p>Choose whether you want to volunteer or donate</p>
                    </div>

                    <div className="role-selection">
                        <div
                            className={`role-card ${selectedRole === 'volunteer' ? 'selected' : ''}`}
                            onClick={handleVolunteerClick}
                        >
                            <div className="role-icon">🤝</div>
                            <h3>Volunteer</h3>
                            <p>Offer your time and skills to help others</p>
                        </div>

                        <div
                            className={`role-card ${selectedRole === 'donor' ? 'selected' : ''}`}
                            onClick={handleDonorClick}
                        >
                            <div className="role-icon">❤️</div>
                            <h3>Donor</h3>
                            <p>Donate blood or other resources</p>
                        </div>
                    </div>

                    {selectedRole && (
                        <div className="confirmation-message">
                            <p>You selected: <strong>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</strong></p>
                            <p className="proceed-message">Proceed to login to continue</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default VolunteerOrDonor
