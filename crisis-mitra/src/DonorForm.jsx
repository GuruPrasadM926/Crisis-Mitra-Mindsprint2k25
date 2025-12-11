import { useState } from 'react'
import './DonorForm.css'

function DonorForm({ userName = 'User', phone = '', age = '', onBack, onProfileClick, onSubmit }) {
    const [formData, setFormData] = useState({
        name: userName,
        phone: phone,
        age: age,
        bloodType: '',
        chronicDiseases: '', // 'yes' or 'no'
        chronicDiseasesList: [],
        recentIllness: '', // 'yes' or 'no'
        recentIllnessList: [],
        vaccines: '', // 'yes' or 'no'
        vaccinesDays: '',
        alcoholDrugs: '', // 'yes' or 'no'
        alcoholDrugsDays: '',
        guardianName: '',
        guardianRelationship: '',
        guardianPhone: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const chronicDiseaseOptions = ['Diabetes', 'BP (High Blood Pressure)', 'Cancer', 'HIV', 'Asthma', 'Heart Disease', 'Other']
    const recentIllnessOptions = ['Fever', 'COVID-19', 'Flu', 'Cold', 'Jaundice', 'Malaria', 'Other']
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    const relationships = ['Mother', 'Father', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Other']

    const handleChange = (e) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCheckboxListChange = (e, fieldName) => {
        const { value, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [fieldName]: checked
                ? [...prev[fieldName], value]
                : prev[fieldName].filter(item => item !== value)
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation
        if (!formData.name || !formData.phone || !formData.age || !formData.bloodType || !formData.guardianName || !formData.guardianRelationship || !formData.guardianPhone ||
            formData.chronicDiseases === '' || formData.recentIllness === '' || formData.vaccines === '' || formData.alcoholDrugs === '') {
            setError('Please fill in all required fields and answer all Yes/No questions')
            setSuccess('')
            return
        }

        // Age validation > 18
        if (parseInt(formData.age) <= 18) {
            setError('You must be at least 18 years old to donate')
            setSuccess('')
            return
        }

        // Vaccines validation
        if (formData.vaccines === 'yes' && !formData.vaccinesDays) {
            setError('Please enter number of days since vaccine')
            setSuccess('')
            return
        }
        if (formData.vaccines === 'yes' && parseInt(formData.vaccinesDays) < 14) {
            setError('You must wait at least 2 weeks (14 days) after vaccination to donate')
            setSuccess('')
            return
        }

        // Alcohol/Drugs/Tobacco validation
        if (formData.alcoholDrugs === 'yes' && !formData.alcoholDrugsDays) {
            setError('Please enter number of days since alcohol/drugs/tobacco consumption')
            setSuccess('')
            return
        }
        if (formData.alcoholDrugs === 'yes' && parseInt(formData.alcoholDrugsDays) < 2) {
            setError('You must wait at least 2 days after alcohol/drugs/tobacco consumption to donate')
            setSuccess('')
            return
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number (10 digits)')
            setSuccess('')
            return
        }

        // Guardian phone validation
        if (!phoneRegex.test(formData.guardianPhone.replace(/\D/g, ''))) {
            setError('Please enter a valid guardian phone number (10 digits)')
            setSuccess('')
            return
        }

        setError('')
        setSuccess('Donor profile created successfully!')
        console.log('Donor form data:', formData)

        // Call onSubmit callback if provided (for alert acceptance flow)
        if (onSubmit) {
            setTimeout(() => {
                onSubmit(formData)
            }, 1500)
            return
        }

        // Reset form
        setTimeout(() => {
            setFormData({
                name: userName,
                phone: phone,
                age: '',
                bloodType: '',
                chronicDiseases: '',
                chronicDiseasesList: [],
                recentIllness: '',
                recentIllnessList: [],
                vaccines: '',
                vaccinesDays: '',
                alcoholDrugs: '',
                alcoholDrugsDays: '',
                guardianName: '',
                guardianRelationship: '',
                guardianPhone: ''
            })
            setSuccess('')
        }, 2000)
    }

    return (
        <div className="donor-container">
            <header className="donor-header">
                <div className="header-content">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h1>SEVA HUB</h1>
                    <div className="header-actions">
                        <button
                            className="profile-btn"
                            onClick={onProfileClick}
                            title="View Profile"
                        >
                            <div className="profile-icon-small">👤</div>
                            <span className="user-name-small">{userName}</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="donor-main">
                <main className="donor-content">
                    <div className="form-header">
                        <h2>Donor Registration Form</h2>
                        <p>Please provide your health and contact information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="donor-form">
                        {/* Personal Information */}
                        <div className="form-section">
                            <h3>Personal Information</h3>

                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    readOnly
                                    className="input-readonly"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    readOnly
                                    className="input-readonly"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="age">Age *</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Enter your age"
                                        min="18"
                                        readOnly={formData.age !== ''}
                                        className={formData.age !== '' ? 'input-readonly' : ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bloodType">Blood Type *</label>
                                    <select
                                        id="bloodType"
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select blood type</option>
                                        {bloodTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Health Information */}
                        <div className="form-section">
                            <h3>Health Information</h3>

                            <div className="form-group radio-group">
                                <label>Do you have any chronic diseases?</label>
                                <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="chronicDiseases"
                                            value="yes"
                                            checked={formData.chronicDiseases === 'yes'}
                                            onChange={handleChange}
                                        />
                                        Yes
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="chronicDiseases"
                                            value="no"
                                            checked={formData.chronicDiseases === 'no'}
                                            onChange={handleChange}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            {formData.chronicDiseases === 'yes' && (
                                <div className="checkbox-list">
                                    <p className="checkbox-label">Select all that apply:</p>
                                    {chronicDiseaseOptions.map(disease => (
                                        <div key={disease} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`disease-${disease}`}
                                                value={disease}
                                                checked={formData.chronicDiseasesList.includes(disease)}
                                                onChange={(e) => handleCheckboxListChange(e, 'chronicDiseasesList')}
                                            />
                                            <label htmlFor={`disease-${disease}`}>{disease}</label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="form-group radio-group">
                                <label>Have you had any recent illness?</label>
                                <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="recentIllness"
                                            value="yes"
                                            checked={formData.recentIllness === 'yes'}
                                            onChange={handleChange}
                                        />
                                        Yes
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="recentIllness"
                                            value="no"
                                            checked={formData.recentIllness === 'no'}
                                            onChange={handleChange}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            {formData.recentIllness === 'yes' && (
                                <div className="checkbox-list">
                                    <p className="checkbox-label">Select all that apply:</p>
                                    {recentIllnessOptions.map(illness => (
                                        <div key={illness} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`illness-${illness}`}
                                                value={illness}
                                                checked={formData.recentIllnessList.includes(illness)}
                                                onChange={(e) => handleCheckboxListChange(e, 'recentIllnessList')}
                                            />
                                            <label htmlFor={`illness-${illness}`}>{illness}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vaccination & Lifestyle */}
                        <div className="form-section">
                            <h3>Vaccination & Lifestyle</h3>

                            <div className="form-group radio-group">
                                <label>Have you taken any vaccines recently?</label>
                                <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="vaccines"
                                            value="yes"
                                            checked={formData.vaccines === 'yes'}
                                            onChange={handleChange}
                                        />
                                        Yes
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="vaccines"
                                            value="no"
                                            checked={formData.vaccines === 'no'}
                                            onChange={handleChange}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            {formData.vaccines === 'yes' && (
                                <div className="form-group">
                                    <label htmlFor="vaccinesDays">Days since vaccination *</label>
                                    <input
                                        type="number"
                                        id="vaccinesDays"
                                        name="vaccinesDays"
                                        value={formData.vaccinesDays}
                                        onChange={handleChange}
                                        placeholder="Enter number of days"
                                        min="0"
                                    />
                                    <small className="info-text">Must be at least 14 days</small>
                                </div>
                            )}

                            <div className="form-group radio-group">
                                <label>Have you consumed alcohol, drugs, or tobacco recently?</label>
                                <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="alcoholDrugs"
                                            value="yes"
                                            checked={formData.alcoholDrugs === 'yes'}
                                            onChange={handleChange}
                                        />
                                        Yes
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                                        <input
                                            type="radio"
                                            name="alcoholDrugs"
                                            value="no"
                                            checked={formData.alcoholDrugs === 'no'}
                                            onChange={handleChange}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            {formData.alcoholDrugs === 'yes' && (
                                <div className="form-group">
                                    <label htmlFor="alcoholDrugsDays">Days since consumption *</label>
                                    <input
                                        type="number"
                                        id="alcoholDrugsDays"
                                        name="alcoholDrugsDays"
                                        value={formData.alcoholDrugsDays}
                                        onChange={handleChange}
                                        placeholder="Enter number of days"
                                        min="0"
                                    />
                                    <small className="info-text">Must be at least 2 days</small>
                                </div>
                            )}
                        </div>

                        {/* Guardian Information */}
                        <div className="form-section">
                            <h3>Guardian Information</h3>

                            <div className="form-group">
                                <label htmlFor="guardianName">Guardian Name *</label>
                                <input
                                    type="text"
                                    id="guardianName"
                                    name="guardianName"
                                    value={formData.guardianName}
                                    onChange={handleChange}
                                    placeholder="Enter guardian name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="guardianRelationship">Relationship *</label>
                                    <select
                                        id="guardianRelationship"
                                        name="guardianRelationship"
                                        value={formData.guardianRelationship}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select relationship</option>
                                        {relationships.map(rel => (
                                            <option key={rel} value={rel}>{rel}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="guardianPhone">Guardian Phone *</label>
                                    <input
                                        type="tel"
                                        id="guardianPhone"
                                        name="guardianPhone"
                                        value={formData.guardianPhone}
                                        onChange={handleChange}
                                        placeholder="Enter guardian phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <button type="submit" className="submit-btn">Submit Donor Registration</button>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default DonorForm
