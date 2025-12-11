import { useState } from 'react'
import './SignupPage.css'
import { userDB } from './TempDB'
import { calculateAge, getMaxDOB } from './utils'

function DonorSignup({ onSignupSuccess, onLoginClick }) {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', pincode: '', dob: '', password: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.phone || !formData.email || !formData.city || !formData.pincode || !formData.dob || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields')
            setSuccess('')
            return
        }
        const age = calculateAge(formData.dob)
        if (age < 18) { setError('You must be at least 18 years old'); setSuccess(''); return }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters long'); setSuccess(''); return }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setSuccess(''); return }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) { setError('Please enter a valid email address'); setSuccess(''); return }
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) { setError('Please enter a valid phone number (10 digits)'); setSuccess(''); return }
        const pincodeRegex = /^\d{5,6}$/
        if (!pincodeRegex.test(formData.pincode)) { setError('Please enter a valid pincode (5-6 digits)'); setSuccess(''); return }

        setError('')
        setSuccess('Signup successful! Redirecting to login...')
        console.log('Donor signup data:', formData)

        const name = formData.name

        // Save user to database
        const result = userDB.registerUser({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            city: formData.city,
            pincode: formData.pincode,
            dob: formData.dob,
            role: 'donor'
        })

        if (!result.success) {
            setError(result.message)
            setSuccess('')
            return
        }

        setFormData({ name: '', phone: '', email: '', city: '', pincode: '', dob: '', password: '', confirmPassword: '' })

        setTimeout(() => { if (onSignupSuccess) onSignupSuccess(name) }, 1000)
    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>SEVA HUB</h1>
                <p className="subtitle">Donor Sign Up</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pincode">Pincode</label>
                            <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter your pincode" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} max={getMaxDOB()} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password (min 6 characters)" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <a onClick={onLoginClick} style={{ cursor: 'pointer' }}>Login</a></p>
                </div>
            </div>
        </div>
    )
}

export default DonorSignup
