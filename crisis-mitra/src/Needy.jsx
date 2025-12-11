import { useState } from 'react'
import './Needy.css'

function Needy({ userName = 'User', onBack }) {
    const [formData, setFormData] = useState({
        name: userName,
        phone: '',
        email: '',
        service: '',
        date: '',
        place: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const serviceOptions = ['Blood', 'Organ', 'Event Management', 'Social Service']

    // Get today's date
    const today = new Date()
    const minDate = today.toISOString().split('T')[0]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation
        if (!formData.name || !formData.phone || !formData.email || !formData.service || !formData.date || !formData.place) {
            setError('Please fill in all fields')
            setSuccess('')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            setSuccess('')
            return
        }

        // Phone validation (10 digits)
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number (10 digits)')
            setSuccess('')
            return
        }

        // Date validation
        const selectedDate = new Date(formData.date)
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        if (selectedDate < todayDate) {
            setError('Please select a future date')
            setSuccess('')
            return
        }

        setError('')
        setSuccess('Request submitted successfully!')
        console.log('Needy form data:', formData)

        // Reset form
        setTimeout(() => {
            setFormData({
                name: userName,
                phone: '',
                email: '',
                service: '',
                date: '',
                place: ''
            })
            setSuccess('')
        }, 2000)
    }

    return (
        <div className="needy-container">
            <header className="needy-header">
                <div className="header-content">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h1>SEVA HUB</h1>
                    <div className="profile-top">
                        <div className="profile-icon-small">👤</div>
                        <span className="user-name-small">{userName}</span>
                    </div>
                </div>
            </header>

            <div className="needy-main">
                <main className="needy-content">
                    <div className="form-header">
                        <h2>Service Request Form</h2>
                        <p>Please fill in the details to request assistance</p>
                    </div>

                    <form onSubmit={handleSubmit} className="needy-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="service">Type of Service</label>
                            <select
                                id="service"
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                            >
                                <option value="">Select a service</option>
                                {serviceOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date of Service</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={minDate}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="place">Place of Service</label>
                            <input
                                type="text"
                                id="place"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                placeholder="Enter the location where service is needed"
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <button type="submit" className="submit-btn">Submit Request</button>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default Needy
