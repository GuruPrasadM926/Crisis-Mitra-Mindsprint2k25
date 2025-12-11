import React, { useState } from 'react'
import './NeedyDashboard.css'

function NeedyDashboard({ userName, requests = [], onNewRequest, onPullRequest, onBack }) {
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [requestToDelete, setRequestToDelete] = useState(null)
    const [deleteReason, setDeleteReason] = useState('')

    const deleteReasons = [
        'Not needed anymore',
        'Found alternative solution',
        'Changed plans',
        'Issue resolved',
        'Requesting different service',
        'Other'
    ]

    const getStatusColor = (status) => {
        if (status === 'Resolved') return 'resolved'
        if (status === 'Pending') return 'pending'
        return 'unresolved'
    }

    const handleDeleteClick = (request) => {
        setRequestToDelete(request)
        setDeleteModalOpen(true)
        setDeleteReason('')
    }

    const confirmDelete = () => {
        if (!deleteReason) {
            alert('Please select a reason for cancellation')
            return
        }
        if (onPullRequest && requestToDelete) {
            onPullRequest(requestToDelete.id)
            setSelectedRequest(null)
        }
        setDeleteModalOpen(false)
        setRequestToDelete(null)
        setDeleteReason('')
    }

    return (
        <div className="needy-dashboard-container">
            <header className="needy-dashboard-header">
                <div className="header-content">
                    <button className="back-btn" onClick={onBack} title="Go back">← Back</button>
                    <div className="header-title">
                        <h1>Needy Dashboard</h1>
                        <p className="greeting">Welcome, <strong>{userName}</strong></p>
                    </div>
                </div>
            </header>

            <main className="needy-dashboard-main">
                {/* Submit New Request Section */}
                <section className="new-request-section">
                    <div className="new-request-card">
                        <h3>Create New Service Request</h3>
                        <p>Need help? Submit a new service request below</p>
                        <button className="new-request-btn" onClick={onNewRequest}>
                            + Submit New Service Request
                        </button>
                    </div>
                </section>

                <div className="dashboard-grid">
                    {/* Requests Status Section */}
                    <section className="requests-section">
                        <div className="section-header">
                            <h2>Your Service Requests</h2>
                            <span className="request-count">{requests.length} Total</span>
                        </div>

                        {requests.length === 0 ? (
                            <div className="empty-state">
                                <p>📋 No service requests submitted yet</p>
                                <p className="subtitle">Submit your first request to get started</p>
                            </div>
                        ) : (
                            <div className="requests-list">
                                {requests.map((req) => (
                                    <div
                                        key={req.id}
                                        className={`request-card ${getStatusColor(req.status)}`}
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        <div className="request-header">
                                            <div className="request-service">
                                                <span className="service-type">{req.service || 'Service'}</span>
                                                <span className="service-date">{req.date}</span>
                                            </div>
                                            <div className={`status-badge ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </div>
                                        </div>
                                        <div className="request-location">
                                            <span className="location-icon">📍</span>
                                            <span>{req.place}</span>
                                        </div>
                                        {req.acceptedBy && (
                                            <div className="accepted-indicator">
                                                <span className="checkmark">✓</span>
                                                <span>Accepted by {req.acceptedBy.name}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Acceptor Details Section */}
                    <aside className="acceptor-section">
                        {selectedRequest && selectedRequest.acceptedBy ? (
                            <div className="acceptor-card">
                                <h2>{selectedRequest.acceptedBy.role === 'Donor' ? 'Donor Information' : 'Volunteer Information'}</h2>
                                <div className="acceptor-details">
                                    <div className="detail-group">
                                        <label>Full Name</label>
                                        <div className="detail-value">{selectedRequest.acceptedBy.name}</div>
                                    </div>
                                    <div className="detail-group">
                                        <label>Email</label>
                                        <div className="detail-value">
                                            <a href={`mailto:${selectedRequest.acceptedBy.email}`}>
                                                {selectedRequest.acceptedBy.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="detail-group">
                                        <label>Phone Number</label>
                                        <div className="detail-value">
                                            <a href={`tel:${selectedRequest.acceptedBy.phone}`}>
                                                {selectedRequest.acceptedBy.phone}
                                            </a>
                                        </div>
                                    </div>
                                    {selectedRequest.acceptedBy.role && (
                                        <div className="detail-group">
                                            <label>Role</label>
                                            <div className="detail-value">{selectedRequest.acceptedBy.role}</div>
                                        </div>
                                    )}
                                    {selectedRequest.acceptedBy.bloodType && (
                                        <div className="detail-group">
                                            <label>Blood Type</label>
                                            <div className="detail-value">{selectedRequest.acceptedBy.bloodType}</div>
                                        </div>
                                    )}
                                    <button className="pull-request-btn" onClick={() => handleDeleteClick(selectedRequest)}>
                                        Cancel Request
                                    </button>
                                </div>
                            </div>
                        ) : selectedRequest ? (
                            <div className="acceptor-card empty">
                                <h2>Request Details</h2>
                                <div className="empty-acceptor">
                                    <p>⏳ Waiting for a volunteer to accept</p>
                                    <p className="subtitle">Once someone accepts your request, their details will appear here</p>
                                    <button className="pull-request-btn" style={{ marginTop: '20px' }} onClick={() => handleDeleteClick(selectedRequest)}>
                                        Cancel Request
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="acceptor-card placeholder">
                                <h2>Volunteer Information</h2>
                                <div className="placeholder-content">
                                    <p>👉 Select a request from the list to view volunteer details</p>
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Delete Modal */}
                    {deleteModalOpen && (
                        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>Cancel Service Request</h3>
                                    <button className="modal-close" onClick={() => setDeleteModalOpen(false)}>✕</button>
                                </div>
                                <div className="modal-body">
                                    <p>Please select a reason for cancelling this request:</p>
                                    <div className="reason-options">
                                        {deleteReasons.map((reason) => (
                                            <label key={reason} className="reason-option">
                                                <input
                                                    type="radio"
                                                    name="deleteReason"
                                                    value={reason}
                                                    checked={deleteReason === reason}
                                                    onChange={(e) => setDeleteReason(e.target.value)}
                                                />
                                                <span>{reason}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="cancel-btn" onClick={() => setDeleteModalOpen(false)}>
                                        Back
                                    </button>
                                    <button className="confirm-delete-btn" onClick={confirmDelete}>
                                        Confirm Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default NeedyDashboard
