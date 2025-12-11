import { useState } from 'react'
import './LoginPage.css'
import { userDB } from './TempDB'

function NeedyLogin({ onSignupClick, onLogin, onBack }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        // Authenticate user with database
        const result = userDB.authenticateUser(email, password)

        if (!result.success) {
            setError(result.message)
            return
        }

        setError('')
        console.log('Needy login successful for user:', result.user)

        // Use actual stored name from database
        if (onLogin) onLogin(result.user.name, result.user.id)
    }

    return (
        <div className="login-container">
            <div className="login-box">
                {onBack && (
                    <button className="back-btn" onClick={onBack} style={{ marginBottom: '20px' }}>← Back</button>
                )}
                <h1>SEVA HUB</h1>
                <p className="subtitle">Needy Login</p>

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

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn">Login</button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account? <a onClick={onSignupClick} style={{ cursor: 'pointer' }}>Sign up as Needy</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NeedyLogin
