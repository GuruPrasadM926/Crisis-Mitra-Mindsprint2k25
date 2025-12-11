import { useState } from 'react'
import './VolunteerDashboard.css'

function VolunteerDashboard({ userName = 'User', onBack }) {
    const [skills, setSkills] = useState(['First Aid', 'Event Coordination'])
    const [newSkill, setNewSkill] = useState('')

    const [completedTasks, setCompletedTasks] = useState([
        { id: 1, title: 'Food distribution at shelter', date: '2025-10-12' }
    ])
    const [upcomingTasks, setUpcomingTasks] = useState([
        { id: 1, title: 'Community clean-up', date: '2025-12-20' }
    ])

    const [alerts, setAlerts] = useState([
        'Blood donation camp near you on 2025-12-18',
        'Urgent volunteers needed for flood relief'
    ])

    const addSkill = () => {
        const s = newSkill.trim()
        if (!s) return
        setSkills(prev => [...prev, s])
        setNewSkill('')
    }

    const dismissAlert = (index) => {
        setAlerts(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="vdb-container">
            <header className="vdb-header">
                <div className="header-inner">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <div className="vdb-title">SEVA HUB</div>
                    <div className="profile-small">👤 {userName}</div>
                </div>
            </header>

            <main className="vdb-main">
                <section className="vdb-left">
                    <div className="card">
                        <h3>Skills</h3>
                        <ul className="skills-list">
                            {skills.map((s, i) => <li key={i}>{s}</li>)}
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
                                <li key={t.id}>{t.title} — <span className="muted">{t.date}</span></li>
                            ))}
                        </ul>
                    </div>
                </section>

                <aside className="vdb-right">
                    <div className="card alerts">
                        <h3>Alerts</h3>
                        {alerts.length === 0 && <p className="muted">No new alerts</p>}
                        <ul>
                            {alerts.map((a, i) => (
                                <li key={i} className="alert-item">
                                    <span>{a}</span>
                                    <button className="dismiss" onClick={() => dismissAlert(i)}>Dismiss</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card">
                        <h3>Completed Tasks</h3>
                        <ul>
                            {completedTasks.map(t => (
                                <li key={t.id}>{t.title} — <span className="muted">{t.date}</span></li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    )
}

export default VolunteerDashboard
