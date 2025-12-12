import React, { useState } from 'react'
import './NeedyDashboard.css'

function NeedyDashboard({ userName, requests = [], onNewRequest, onPullRequest, onBack, onAcceptVolunteer, onRejectVolunteer, onMarkServiceSuccess, onMarkServiceFailure }) {
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [requestToDelete, setRequestToDelete] = useState(null)
    const [deleteReason, setDeleteReason] = useState('')
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
    const [rejectionMessage, setRejectionMessage] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [ratingFeedback, setRatingFeedback] = useState('')
    const [ratingType, setRatingType] = useState(null) // 'success' or 'failure'

    const deleteReasons = [
        'Not needed anymore',
        'Found alternative solution',
        'Changed plans',
        'Issue resolved',
        'Requesting different service',
        'Other'
    ]

    const rejectionReasons = [
        'Not suitable for the job',
        'Better option available',
        'Changed requirements',
        'Found alternative help',
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

    const handleRejectClick = (requestId, acceptanceId, acceptanceName) => {
        setRejectionMessage(`Are you sure you want to reject ${acceptanceName}?`)
        setRejectionReason('')
        setRejectionModalOpen(true)
        // Store request and acceptance id for use in confirmReject
        setRequestToDelete({ id: requestId, acceptanceId: acceptanceId })
    }

    const confirmReject = () => {
        if (!rejectionReason) {
            alert('Please select a reason for rejection')
            return
        }
        console.log('Confirming rejection:', { requestToDelete, rejectionReason })
        if (onRejectVolunteer && requestToDelete) {
            console.log('Calling onRejectVolunteer with:', requestToDelete.id, requestToDelete.acceptanceId, rejectionReason)
            onRejectVolunteer(requestToDelete.id, requestToDelete.acceptanceId, rejectionReason)
        }
        setRejectionModalOpen(false)
        setRequestToDelete(null)
        setRejectionMessage('')
        setRejectionReason('')
    }

    const handleRatingClick = (type) => {
        setRatingType(type)
        setRatingFeedback('')
        setRatingModalOpen(true)
    }

    const confirmRating = () => {
        if (ratingType === 'success') {
            console.log('Marking service as success for request:', selectedRequest.id, 'Feedback:', ratingFeedback)
            if (onMarkServiceSuccess) {
                onMarkServiceSuccess(selectedRequest.id, ratingFeedback)
            }
        } else if (ratingType === 'failure') {
            console.log('Marking service as failure for request:', selectedRequest.id, 'Feedback:', ratingFeedback)
            if (onMarkServiceFailure) {
                onMarkServiceFailure(selectedRequest.id, ratingFeedback)
            }
        }
        setRatingModalOpen(false)
        setRatingType(null)
        setRatingFeedback('')
        setSelectedRequest(null)
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
                        {selectedRequest ? (
                            <div className="acceptor-card">
                                <h2>Request Acceptances</h2>
                                {selectedRequest.acceptances && selectedRequest.acceptances.length > 0 ? (
                                    <div className="acceptances-list">
                                        {selectedRequest.acceptances.map((acceptance, index) => (
                                            <div key={index} className="acceptance-card">
                                                <div className="acceptance-header">
                                                    <h4>{acceptance.name}</h4>
                                                    <span className={`role-badge ${acceptance.role.toLowerCase()}`}>
                                                        {acceptance.role}
                                                    </span>
                                                </div>
                                                <div className="acceptance-details">
                                                    <div className="detail-group">
                                                        <label>Email</label>
                                                        <div className="detail-value">
                                                            <a href={`mailto:${acceptance.email}`}>
                                                                {acceptance.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="detail-group">
                                                        <label>Phone</label>
                                                        <div className="detail-value">
                                                            <a href={`tel:${acceptance.phone}`}>
                                                                {acceptance.phone}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    {acceptance.bloodType && (
                                                        <div className="detail-group">
                                                            <label>Blood Type</label>
                                                            <div className="detail-value">{acceptance.bloodType}</div>
                                                        </div>
                                                    )}
                                                    {selectedRequest.acceptedBy && selectedRequest.acceptedBy.id === acceptance.id && (
                                                        <div className="detail-group">
                                                            <span className="accepted-badge">✓ Selected Acceptor</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="acceptance-actions">
                                                    {!selectedRequest.acceptedBy || selectedRequest.acceptedBy.id !== acceptance.id ? (
                                                        <button
                                                            className="accept-volunteer-btn"
                                                            onClick={() => onAcceptVolunteer && onAcceptVolunteer(selectedRequest.id, acceptance.id)}
                                                            title="Accept this volunteer/donor"
                                                        >
                                                            ✓ Accept
                                                        </button>
                                                    ) : null}
                                                    <button
                                                        className="reject-volunteer-btn"
                                                        onClick={() => handleRejectClick(selectedRequest.id, acceptance.id, acceptance.name)}
                                                        title="Reject this volunteer/donor"
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-acceptor">
                                        <p>⏳ Waiting for a volunteer to accept</p>
                                        <p className="subtitle">Once someone accepts your request, their details will appear here</p>
                                    </div>
                                )}

                                {/* Service Completion Rating Section */}
                                {selectedRequest.acceptedBy && !selectedRequest.serviceStatus && (
                                    <div className="service-rating-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '2px solid #4CAF50' }}>
                                        <h4 style={{ marginBottom: '10px' }}>Has the service been completed?</h4>
                                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Please rate whether the service was completed successfully or not</p>
                                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                            <button
                                                className="success-rating-btn"
                                                onClick={() => handleRatingClick('success')}
                                                style={{ backgroundColor: '#4CAF50', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                            >
                                                ✓ Service Completed Successfully
                                            </button>
                                            <button
                                                className="failure-rating-btn"
                                                onClick={() => handleRatingClick('failure')}
                                                style={{ backgroundColor: '#f44336', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#da190b'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                                            >
                                                ✕ Service Failed / Incomplete
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.serviceStatus && (
                                    <div className={`service-status-badge ${selectedRequest.serviceStatus}`} style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', backgroundColor: selectedRequest.serviceStatus === 'success' ? '#d4edda' : '#f8d7da', border: `2px solid ${selectedRequest.serviceStatus === 'success' ? '#28a745' : '#f44336'}`, color: selectedRequest.serviceStatus === 'success' ? '#155724' : '#721c24' }}>
                                        <h4>{selectedRequest.serviceStatus === 'success' ? '✓ Service Completed Successfully' : '✕ Service Failed / Incomplete'}</h4>
                                        {selectedRequest.serviceFeedback && (
                                            <p style={{ marginTop: '10px', fontSize: '13px' }}>
                                                <strong>Feedback:</strong> {selectedRequest.serviceFeedback}
                                            </p>
                                        )}
                                        <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                                            Rated on: {new Date(selectedRequest.ratedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                <button className="pull-request-btn" onClick={() => handleDeleteClick(selectedRequest)} style={{ marginTop: '20px' }}>
                                    Cancel Request
                                </button>
                            </div>
                        ) : (
                            <div className="acceptor-card placeholder">
                                <h2>Request Acceptances</h2>
                                <div className="placeholder-content">
                                    <p>👉 Select a request from the list to view who accepted it</p>
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

                    {/* Rejection Modal */}
                    {rejectionModalOpen && (
                        <div className="modal-overlay" onClick={() => setRejectionModalOpen(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>Reject Acceptance</h3>
                                    <button className="modal-close" onClick={() => setRejectionModalOpen(false)}>✕</button>
                                </div>
                                <div className="modal-body">
                                    <p>{rejectionMessage}</p>
                                    <p style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>Please select a reason for rejection:</p>
                                    <div className="reason-options">
                                        {rejectionReasons.map((reason) => (
                                            <label key={reason} className="reason-option">
                                                <input
                                                    type="radio"
                                                    name="rejectionReason"
                                                    value={reason}
                                                    checked={rejectionReason === reason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                />
                                                <span>{reason}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="cancel-btn" onClick={() => setRejectionModalOpen(false)}>
                                        Back
                                    </button>
                                    <button className="confirm-delete-btn" onClick={confirmReject}>
                                        Confirm Rejection
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Rating Modal */}
                    {ratingModalOpen && (
                        <div className="modal-overlay" onClick={() => setRatingModalOpen(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>{ratingType === 'success' ? '✓ Service Completed Successfully' : '✕ Service Failed / Incomplete'}</h3>
                                    <button className="modal-close" onClick={() => setRatingModalOpen(false)}>✕</button>
                                </div>
                                <div className="modal-body">
                                    <p>Please provide any feedback or comments (optional):</p>
                                    <textarea
                                        className="feedback-textarea"
                                        placeholder="Enter your feedback here..."
                                        value={ratingFeedback}
                                        onChange={(e) => setRatingFeedback(e.target.value)}
                                        style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'inherit', fontSize: '14px', marginTop: '10px' }}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button className="cancel-btn" onClick={() => setRatingModalOpen(false)}>
                                        Back
                                    </button>
                                    <button
                                        className={`confirm-rating-btn ${ratingType}`}
                                        onClick={confirmRating}
                                        style={{ backgroundColor: ratingType === 'success' ? '#4CAF50' : '#f44336', color: 'white' }}
                                    >
                                        Confirm {ratingType === 'success' ? 'Success' : 'Failure'}
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
