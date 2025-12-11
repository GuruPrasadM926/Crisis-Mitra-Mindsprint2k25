import { useState } from 'react'
import './Volunteer.css'

function Volunteer({ userName = 'User', onBack }) {
    const [selected, setSelected] = useState(null)

    return (
        <div className="volunteer-container">
            <header className="volunteer-header">
                <div className="header-content">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h1>SEVA HUB</h1>
                    <div className="profile-top">
                        <div className="profile-icon-small">👤</div>
                        <span className="user-name-small">{userName}</span>
                    </div>
                </div>
            </header>

            <div className="volunteer-main">
                <main className="volunteer-content">
                    <div className="volunteer-header-block">
                        <h2>Choose mode</h2>
                        <p>Select whether you want to act as a volunteer or donor</p>
                    </div>

                    <div className="slider" role="list">
                        <div
                            className={`option ${selected === 'volunteer' ? 'active' : ''}`}
                            onClick={() => setSelected('volunteer')}
                            role="listitem"
                        >
                            <div className="option-icon">🤝</div>
                            <p className="option-text">Volunteer</p>
                        </div>

                        <div
                            className={`option ${selected === 'donor' ? 'active' : ''}`}
                            onClick={() => setSelected('donor')}
                            role="listitem"
                        >
                            <div className="option-icon">🎁</div>
                            <p className="option-text">Donor</p>
                        </div>
                    </div>

                    <div className="selection-info">
                        {selected ? <p>Selected: <strong>{selected}</strong></p> : <p>No selection yet</p>}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Volunteer
