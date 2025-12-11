import { useState } from 'react'
import './VolunteerDashboard.css'

function VolunteerDashboard({ userName = 'User', onBack, onProfileClick }) {
    const [skills, setSkills] = useState(['First Aid', 'Event Coordination'])
    const [newSkill, setNewSkill] = useState('')

    const [completedTasks, setCompletedTasks] = useState([
        { id: 1, title: 'Food distribution at shelter', date: '2025-10-12', description: 'Distributed food to 50 people at community shelter' }
    ])
    const [upcomingTasks, setUpcomingTasks] = useState([
        { id: 1, title: 'Community clean-up', date: '2025-12-20', description: 'Clean up the local park and surrounding areas' }
    ])

    const [alerts, setAlerts] = useState([
        { id: 1, text: 'Blood donation camp near you on 2025-12-18', details: 'Blood donation drive at Community Hospital. Time: 10 AM - 4 PM. Contact: +91-9876543210' },
        { id: 2, text: 'Urgent volunteers needed for flood relief', details: 'Help needed for flood relief in nearby areas. Bring supplies and be prepared for outdoor work. Reporting time: 6 AM tomorrow.' }
    ])

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

    const acceptAlert = (alertId) => {
        const alert = alerts.find(a => a.id === alertId)
        
        // Add alert to upcoming tasks
        if (alert) {
            const newTask = {
                id: upcomingTasks.length > 0 ? Math.max(...upcomingTasks.map(t => t.id)) + 1 : 1,
                title: alert.text,
                date: new Date().toISOString().split('T')[0],
                description: alert.details
            }
            setUpcomingTasks(prev => [...prev, newTask])
            // Remove alert after accepting
            setAlerts(prev => prev.filter(a => a.id !== alertId))
            setExpandedAlert(null)
        }
    }

    const removeAlert = (alertId) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId))
        setExpandedAlert(null)
    }

    const markTaskComplete = (taskId) => {
        const task = upcomingTasks.find(t => t.id === taskId)
        if (task) {
            setCompletedTasks(prev => [...prev, task])
            setUpcomingTasks(prev => prev.filter(t => t.id !== taskId))
        }
    }

    return (
        <div className="vdb-container">
            <header className="vdb-header">
                <div className="header-inner">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <div className="vdb-title">SEVA HUB</div>yy
                    <div className="profile-small" onClick={onProfileClick} style={{cursor: 'pointer'}}>👤 {userName}</div>
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
                                        <strong>{t.title}</strong>
                                        <span className="muted">{t.date}</span>
                                        {t.description && <p className="task-description">{t.description}</p>}
                                    </div>
                                    <button className="mark-complete" onClick={() => markTaskComplete(t.id)} title="Mark as complete">✓</button>
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
                                <button className="remove-alert" onClick={() => removeAlert(expandedAlert.id)}>Remove Alert</button>
                            </div>
                        ) : (
                            <>
                                {alerts.length === 0 && <p className="muted">No new alerts</p>}
                                <ul className="alerts-list">
                                    {alerts.map(a => (
                                        <li key={a.id} className="alert-item">
                                            <span className="alert-text">{a.text}</span>
                                            <button className="accept-alert" onClick={() => acceptAlert(a.id)}>Accept</button>
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
                                        <strong>{t.title}</strong>
                                        <span className="muted">{t.date}</span>
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