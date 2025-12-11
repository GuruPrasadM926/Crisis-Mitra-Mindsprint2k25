// Utility functions for age calculation and validation

export const calculateAge = (dob) => {
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
}

export const isValidAge = (dob, minAge = 18) => {
    const age = calculateAge(dob)
    return age !== null && age >= minAge
}

export const getMaxDOB = () => {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 18)
    return today.toISOString().split('T')[0]
}

export const getMinDOB = () => {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 100)
    return today.toISOString().split('T')[0]
}
