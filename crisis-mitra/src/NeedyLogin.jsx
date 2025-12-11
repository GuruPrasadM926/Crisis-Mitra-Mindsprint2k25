import { useState } from 'react'
import './LoginPage.css'
import { userDB } from './TempDB'

function NeedyLogin({ onSignupClick, onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email || !password || !age) {
            setError('Please fill in all fields')
            return
        }

        if (parseInt(age) < 18) {
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
        console.log('Needy login successful for user:', result.user)

        // Use actual stored name from database
        if (onLogin) onLogin(result.user.name)
    }

    return (
        <div className="login-container">
            <div className="login-box">
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

                    <div className="form-group">
                        <label htmlFor="age">Your Age</label>
                        <input
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Enter your age"
                            min="18"
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
