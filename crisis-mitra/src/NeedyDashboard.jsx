import React, { useState } from 'react'
import './NeedyDashboard.css'

function NeedyDashboard({ userName, requests = [], onNewRequest, onPullRequest }) {
    return (
        <div className="needy-dashboard-container">
            <header className="needy-dashboard-header">
                <h1>Welcome, {userName}</h1>
            </header>
            <main className="needy-dashboard-main">
                <section className="new-request-section">
                    <button className="new-request-btn" onClick={onNewRequest}>
                        Submit New Service Request
                    </button>
                </section>
                <section className="request-status-section">
                    <h2>Your Requests</h2>
                    {requests.length === 0 ? (
                        <p>No requests submitted yet.</p>
                    ) : (
                        <ul className="request-list">
                            {requests.map((req) => (
                                <li key={req.id} className="request-item">
                                    <div className="request-info">
                                        <span className="request-status">Status: {req.status}</span>
                                        {req.acceptedBy && (
                                            <div className="accepted-bio">
                                                <strong>Accepted by:</strong>
                                                <div className="bio-details">
                                                    <span>Name: {req.acceptedBy.name}</span>
                                                    <span>Phone: {req.acceptedBy.phone}</span>
                                                    <span>Role: {req.acceptedBy.role}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button className="pull-request-btn" onClick={() => onPullRequest(req.id)}>
                                        Pull Down Request
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    )
}

export default NeedyDashboard
