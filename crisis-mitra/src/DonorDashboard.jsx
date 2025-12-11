import React, { useState } from 'react'
import './DonorDashboard.css'

function DonorDashboard({
    userName = 'User',
    userAge = '',
    userBloodType = '',
    onProfileClick,
    onBack,
    incomingAlerts = [],
    upcomingAlerts = [],
    completedAlerts = [],
    onAcceptAlert,
    onCompleteAlert
}) {
    const [selectedUpcoming, setSelectedUpcoming] = useState(null)

    // Sample incoming alerts if none provided
    const defaultIncomingAlerts = [
        { id: 1, bloodType: 'O+', units: 2, hospital: 'City General Hospital', urgency: 'High' },
        { id: 2, bloodType: 'B+', units: 1, hospital: 'Apollo Hospital', urgency: 'Medium' },
        { id: 3, bloodType: userBloodType, units: 3, hospital: 'Medical Centre', urgency: 'Critical' }
    ]

    const alerts = incomingAlerts.length > 0 ? incomingAlerts : defaultIncomingAlerts

    const handleAccept = (alert) => {
        if (onAcceptAlert) {
            onAcceptAlert(alert)
        }
    }

    const handleCompleteAlert = (alertId, status) => {
        if (onCompleteAlert) {
            onCompleteAlert(alertId, status)
        }
    }

    return (
        <div className="donor-dashboard-container">
            {/* Header Section */}
            <header className="donor-dashboard-header">
                <div className="header-top">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h1>SEVA HUB - Donor Dashboard</h1>
                    <button className="profile-btn" onClick={onProfileClick}>Profile</button>
                </div>

                {/* Donor Info Card */}
                <div className="donor-info-card">
                    <div className="donor-info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{userName}</span>
                    </div>
                    <div className="donor-info-item">
                        <span className="info-label">Age:</span>
                        <span className="info-value">{userAge || 'Not provided'}</span>
                    </div>
                    <div className="donor-info-item">
                        <span className="info-label">Blood Type:</span>
                        <span className="info-value blood-type-badge">{userBloodType || 'Not provided'}</span>
                    </div>
                </div>
            </header>

            {/* Main Content - Three Columns */}
            <main className="donor-dashboard-main">
                {/* Column 1: Incoming Alerts */}
                <section className="dashboard-column incoming-alerts-column">
                    <div className="column-header">
                        <h2>🚨 Incoming Alerts</h2>
                        <span className="alert-count">{alerts.length}</span>
                    </div>
                    <div className="alerts-list">
                        {alerts.length === 0 ? (
                            <div className="empty-state">
                                <p>No incoming alerts at this time</p>
                            </div>
                        ) : (
                            alerts.map(alert => (
                                <div key={alert.id} className={`alert-card incoming-alert urgency-${alert.urgency.toLowerCase()}`}>
                                    <div className="alert-header">
                                        <span className="blood-type-label">{alert.bloodType}</span>
                                        <span className="urgency-badge">{alert.urgency}</span>
                                    </div>
                                    <div className="alert-details">
                                        <p><strong>Units Needed:</strong> {alert.units}</p>
                                        <p><strong>Location:</strong> {alert.hospital}</p>
                                    </div>
                                    <button
                                        className="accept-btn"
                                        onClick={() => handleAccept(alert)}
                                    >
                                        ✓ Accept
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Column 2: Upcoming Alerts */}
                <section className="dashboard-column upcoming-alerts-column">
                    <div className="column-header">
                        <h2>📋 Upcoming</h2>
                        <span className="alert-count">{upcomingAlerts.length}</span>
                    </div>
                    <div className="alerts-list">
                        {upcomingAlerts.length === 0 ? (
                            <div className="empty-state">
                                <p>No upcoming alerts</p>
                                <p className="subtitle">Accept an alert to add it here</p>
                            </div>
                        ) : (
                            upcomingAlerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`alert-card upcoming-alert ${selectedUpcoming === alert.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedUpcoming(alert.id)}
                                >
                                    <div className="alert-header">
                                        <span className="blood-type-label">{alert.bloodType}</span>
                                    </div>
                                    <div className="alert-details">
                                        <p><strong>Units:</strong> {alert.units}</p>
                                        <p><strong>Location:</strong> {alert.hospital}</p>
                                        <p><strong>Date:</strong> {new Date(alert.acceptedAt).toLocaleDateString()}</p>
                                    </div>
                                    {selectedUpcoming === alert.id && (
                                        <div className="completion-buttons">
                                            <button
                                                className="complete-btn success"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCompleteAlert(alert.id, 'success')
                                                    setSelectedUpcoming(null)
                                                }}
                                                title="Mark as successfully completed"
                                            >
                                                ✓ Success
                                            </button>
                                            <button
                                                className="complete-btn failure"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleCompleteAlert(alert.id, 'failure')
                                                    setSelectedUpcoming(null)
                                                }}
                                                title="Mark as unsuccessful"
                                            >
                                                ✗ Unsuccessful
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Column 3: Completed Alerts */}
                <section className="dashboard-column completed-alerts-column">
                    <div className="column-header">
                        <h2>✓ Completed</h2>
                        <span className="alert-count">{completedAlerts.length}</span>
                    </div>
                    <div className="alerts-list">
                        {completedAlerts.length === 0 ? (
                            <div className="empty-state">
                                <p>No completed alerts yet</p>
                                <p className="subtitle">Complete an upcoming alert to see it here</p>
                            </div>
                        ) : (
                            completedAlerts.map(alert => (
                                <div key={alert.id} className={`alert-card completed-alert status-${alert.status}`}>
                                    <div className="alert-header">
                                        <span className="blood-type-label">{alert.bloodType}</span>
                                        <span className={`status-badge status-${alert.status}`}>
                                            {alert.status === 'success' ? '✓ Success' : '✗ Unsuccessful'}
                                        </span>
                                    </div>
                                    <div className="alert-details">
                                        <p><strong>Units:</strong> {alert.units}</p>
                                        <p><strong>Location:</strong> {alert.hospital}</p>
                                        <p><strong>Completed:</strong> {new Date(alert.completedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default DonorDashboard
