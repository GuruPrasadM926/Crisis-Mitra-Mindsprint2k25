import { useState, useEffect } from 'react'
import './VolunteerDashboard.css'

function VolunteerDashboard({
    userName = 'User',
    onBack,
    onProfileClick,
    serviceRequests = [],
    upcomingTasks = [],
    completedTasks = [],
    onAcceptTask,
    onCompleteTask
}) {
    const [skills, setSkills] = useState(['First Aid', 'Event Coordination'])
    const [newSkill, setNewSkill] = useState('')

    const [expandedAlert, setExpandedAlert] = useState(null)

    useEffect(() => {
        console.log('VolunteerDashboard - serviceRequests:', serviceRequests)
        console.log('VolunteerDashboard - upcomingTasks:', upcomingTasks)
    }, [serviceRequests, upcomingTasks])

    const addSkill = () => {
        const s = newSkill.trim()
        if (!s) return
        setSkills(prev => [...prev, s])
        setNewSkill('')
    }

    const deleteSkill = (index) => {
        setSkills(prev => prev.filter((_, i) => i !== index))
    }

    // Map serviceRequests to alert format for display
    const alerts = serviceRequests
        .filter(req =>
            !upcomingTasks.some(t => t.id === req.id || String(t.id) === String(req.id)) &&
            !completedTasks.some(t => t.id === req.id || String(t.id) === String(req.id))
        ) // Only show requests not yet accepted AND not completed
        .map(req => ({
            id: req.id,
            text: `${req.name} requesting ${req.service} service on ${req.date}`,
            details: `Location: ${req.place}\nContact: ${req.phone} | ${req.email}\nService Type: ${req.service}${req.bloodType ? `\nBlood Type: ${req.bloodType}` : ''}${req.patientAge ? `\nPatient Age: ${req.patientAge}` : ''}`,
            requestId: req.id,
            acceptedByNeedy: req.acceptedByNeedy,
            rejectedByNeedy: req.rejectedByNeedy,
            rejectionReason: req.rejectionReason
        }))

    return (
        <div className="vdb-container">
            <header className="vdb-header">
                <div className="header-inner">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <div className="vdb-title">SEVA HUB</div>
                    <button
                        className="profile-btn"
                        onClick={onProfileClick}
                        title="View Profile"
                    >
                        <span className="profile-small">👤 {userName}</span>
                    </button>
                </div>
            </header>

            <main className="vdb-main">
                <section className="vdb-left">
                    <div className="card">
                        <h3>Skills</h3>
                        <ul className="skills-list">
                            {skills.map((s, i) => (
                                <li key={i} className="skill-item">
                                    <span>{s}</span>
                                    <button className="delete-skill" onClick={() => deleteSkill(i)} title="Delete skill">🗑️</button>
                                </li>
                            ))}
                        </ul>

                        <div className="add-skill">
                            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" />
                            <button onClick={addSkill}>Add</button>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Upcoming Tasks</h3>
                        <ul>
                            {upcomingTasks.map(t => (
                                <li key={t.id} className="task-item">
                                    <div className="task-content">
                                        <div className="task-title">{t.title || t.service}</div>
                                        <div className="task-detail">
                                            <span className="detail-label">Date:</span>
                                            <span className="detail-value">{t.date || t.createdAt?.split('T')[0]}</span>
                                        </div>
                                        {t.description && (
                                            <div className="task-detail">
                                                <span className="detail-label">Details:</span>
                                                <span className="detail-value">{t.description}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="mark-complete"
                                        onClick={() => onCompleteTask && onCompleteTask(t.id, 'success')}
                                        title="Mark as complete"
                                    >
                                        ✓
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <aside className="vdb-right">
                    <div className="card alerts">
                        <h3>Alerts</h3>
                        {expandedAlert ? (
                            <div className="alert-details">
                                <button className="close-details" onClick={() => setExpandedAlert(null)}>✕</button>
                                <h4>{expandedAlert.text}</h4>
                                <div className="details-content">
                                    <p>{expandedAlert.details}</p>
                                </div>
                                {expandedAlert.acceptedByNeedy && (
                                    <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '6px', marginBottom: '10px', color: '#2e7d32', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}>
                                        ✓ Accepted by Needy
                                    </div>
                                )}
                                {expandedAlert.rejectedByNeedy && (
                                    <div style={{ padding: '10px', backgroundColor: '#ffebee', borderRadius: '6px', marginBottom: '10px', color: '#c92a2a', fontSize: '13px', fontWeight: '600' }}>
                                        <div>✗ Rejected by Needy</div>
                                        <div style={{ fontSize: '12px', marginTop: '5px' }}>Reason: {expandedAlert.rejectionReason}</div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        className="remove-alert"
                                        onClick={() => {
                                            if (expandedAlert.requestId && onAcceptTask) {
                                                onAcceptTask(expandedAlert.requestId)
                                                setExpandedAlert(null)
                                            }
                                        }}
                                        disabled={expandedAlert.rejectedByNeedy}
                                        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: expandedAlert.rejectedByNeedy ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px', opacity: expandedAlert.rejectedByNeedy ? 0.5 : 1 }}
                                    >
                                        ✓ Accept Request
                                    </button>
                                    <button
                                        className="remove-alert"
                                        onClick={() => setExpandedAlert(null)}
                                        style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {alerts.length === 0 && <p className="muted">No new alerts</p>}
                                <ul className="alerts-list">
                                    {alerts.map(a => (
                                        <li key={a.id} className="alert-item">
                                            <span className="alert-text">{a.text}</span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {a.requestId && onAcceptTask ? (
                                                    <button
                                                        className="accept-alert"
                                                        onClick={() => {
                                                            onAcceptTask(a.requestId)
                                                        }}
                                                        title="Accept this request"
                                                        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                                                    >
                                                        ✓ Accept
                                                    </button>
                                                ) : null}
                                                <button
                                                    className="accept-alert"
                                                    onClick={() => setExpandedAlert(a)}
                                                    style={{ backgroundColor: '#2196F3', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    <div className="card">
                        <h3>Completed Tasks</h3>
                        <ul className="completed-tasks-list">
                            {completedTasks.map(t => (
                                <li key={t.id} className="completed-task-item">
                                    <div className="task-info">
                                        <strong>{t.title || t.service}</strong>
                                        <span className="muted">{t.date || t.completedAt?.split('T')[0]}</span>
                                    </div>
                                    {t.serviceStatus && (
                                        <div style={{ marginTop: '8px', fontSize: '12px', padding: '6px', backgroundColor: t.serviceStatus === 'success' ? '#d4edda' : '#f8d7da', color: t.serviceStatus === 'success' ? '#155724' : '#721c24', borderRadius: '4px' }}>
                                            {t.serviceStatus === 'success' ? '✓ Success' : '✗ Failed'}
                                            {t.serviceFeedback && (
                                                <div style={{ marginTop: '4px', fontSize: '11px' }}>
                                                    {t.serviceFeedback}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    )
}

export default VolunteerDashboard