import { useState } from 'react'
import './LoginPage.css'
import { userDB } from './TempDB'
import { calculateAge, getMaxDOB } from './utils'

function VolunteerLogin({ onSignupClick, onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [dob, setDob] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email || !password || !dob) {
            setError('Please fill in all fields')
            return
        }

        const age = calculateAge(dob)
        if (age < 18) {
            setError('You must be at least 18 years old to login')
            return
        }

        // Authenticate user with database
        const result = userDB.authenticateUser(email, password)

        if (!result.success) {
            setError(result.message)
            return
        }

        setError('')
        console.log('Volunteer login successful for user:', result.user)

        // Use actual stored name and phone from database
        const phone = result.user.phone || '9999999999'
        if (onLogin) onLogin(result.user.name, phone, result.user.id)
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>SEVA HUB</h1>
                <p className="subtitle">Volunteer Login</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={getMaxDOB()}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn">Login</button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account? <a onClick={onSignupClick} style={{ cursor: 'pointer' }}>Sign up as Volunteer</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VolunteerLogin
