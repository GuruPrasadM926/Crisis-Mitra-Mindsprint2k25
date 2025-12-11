import { useState } from 'react'
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
    const alerts = [
        { id: 1, text: 'Blood donation camp near you on 2025-12-18', details: 'Blood donation drive at Community Hospital. Time: 10 AM - 4 PM. Contact: +91-9876543210' },
        { id: 2, text: 'Urgent volunteers needed for flood relief', details: 'Help needed for flood relief in nearby areas. Bring supplies and be prepared for outdoor work. Reporting time: 6 AM tomorrow.' },
        ...serviceRequests
            .filter(req => !upcomingTasks.some(t => t.id === req.id)) // Only show requests not yet accepted
            .map(req => ({
                id: req.id,
                text: `${req.name} requesting ${req.service} service on ${req.date}`,
                details: `Location: ${req.place}\nContact: ${req.phone} | ${req.email}\nService Type: ${req.service}${req.bloodType ? `\nBlood Type: ${req.bloodType}` : ''}${req.patientAge ? `\nPatient Age: ${req.patientAge}` : ''}`,
                requestId: req.id
            }))
    ]

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
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {expandedAlert.requestId && onAcceptTask ? (
                                        <button
                                            className="remove-alert"
                                            onClick={() => {
                                                onAcceptTask(expandedAlert.requestId)
                                                setExpandedAlert(null)
                                            }}
                                        >
                                            Accept Request
                                        </button>
                                    ) : null}
                                    <button
                                        className="remove-alert"
                                        onClick={() => setExpandedAlert(null)}
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
                                            <button
                                                className="accept-alert"
                                                onClick={() => setExpandedAlert(a)}
                                            >
                                                View
                                            </button>
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