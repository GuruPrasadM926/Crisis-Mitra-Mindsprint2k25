// exportData.js - Export all app data to Excel/CSV format

export const exportAllDataToExcel = () => {
  try {
    // Get all data from localStorage
    const users = JSON.parse(localStorage.getItem('sevaHubUsers') || '[]')
    const authUser = JSON.parse(localStorage.getItem('sevaHubAuthUser') || 'null')
    const appData = JSON.parse(localStorage.getItem('sevaHubAppData') || 'null')

    // Create worksheet data
    let csvContent = ''

    // 1. USERS DATA
    csvContent += '=== REGISTERED USERS ===\n\n'
    if (users.length > 0) {
      csvContent += 'ID,Name,Email,Phone,City,Pincode,DOB,Blood Type,Role,Age,Created At\n'
      users.forEach(user => {
        csvContent += `"${user.id}","${user.name}","${user.email}","${user.phone}","${user.city}","${user.pincode}","${user.dob}","${user.bloodType}","${user.role}","${user.age}","${user.registeredAt}"\n`
      })
    } else {
      csvContent += 'No users found\n'
    }

    csvContent += '\n\n'

    // 2. CURRENT AUTH USER
    csvContent += '=== CURRENT LOGGED-IN USER ===\n\n'
    if (authUser) {
      csvContent += 'ID,Name,Email,Phone,Age,Blood Type,Role\n'
      csvContent += `"${authUser.id}","${authUser.name}","${authUser.email}","${authUser.phone}","${authUser.age}","${authUser.bloodType}","${authUser.role}"\n`
    } else {
      csvContent += 'No user currently logged in\n'
    }

    csvContent += '\n\n'

    // 3. SERVICE REQUESTS
    csvContent += '=== SERVICE REQUESTS ===\n\n'
    if (appData && appData.serviceRequests && appData.serviceRequests.length > 0) {
      csvContent += 'ID,Name,Service,Date,Place,Phone,Email,Status,Blood Type,Accepted By,Accepted By Needy,Rejected By Needy,Rejection Reason,Number of Acceptances\n'
      appData.serviceRequests.forEach(req => {
        const acceptancesCount = req.acceptances ? req.acceptances.length : 0
        csvContent += `"${req.id}","${req.name}","${req.service}","${req.date}","${req.place}","${req.phone}","${req.email}","${req.status}","${req.bloodType || 'N/A'}","${req.acceptedBy?.name || 'N/A'}","${req.acceptedByNeedy ? 'Yes' : 'No'}","${req.rejectedByNeedy ? 'Yes' : 'No'}","${req.rejectionReason || ''}","${acceptancesCount}"\n`
      })
    } else {
      csvContent += 'No service requests\n'
    }

    csvContent += '\n\n'

    // 4. INCOMING ALERTS (BLOOD/ORGAN)
    csvContent += '=== INCOMING ALERTS (Blood/Organ Requests) ===\n\n'
    if (appData && appData.incomingAlerts && appData.incomingAlerts.length > 0) {
      csvContent += 'ID,Blood Type,Units,Hospital,Urgency,Requester Name,Requester Contact,Accepted By Needy,Rejected By Needy,Rejection Reason,Created At\n'
      appData.incomingAlerts.forEach(alert => {
        csvContent += `"${alert.id}","${alert.bloodType}","${alert.units}","${alert.hospital}","${alert.urgency}","${alert.requesterName}","${alert.requesterContact}","${alert.acceptedByNeedy ? 'Yes' : 'No'}","${alert.rejectedByNeedy ? 'Yes' : 'No'}","${alert.rejectionReason || ''}","${alert.createdAt}"\n`
      })
    } else {
      csvContent += 'No incoming alerts\n'
    }

    csvContent += '\n\n'

    // 5. UPCOMING ALERTS (DONOR)
    csvContent += '=== UPCOMING ALERTS (Donor Tasks) ===\n\n'
    if (appData && appData.upcomingAlerts && appData.upcomingAlerts.length > 0) {
      csvContent += 'ID,Blood Type,Units,Hospital,Urgency,Accepted By,Accepted At\n'
      appData.upcomingAlerts.forEach(alert => {
        csvContent += `"${alert.id}","${alert.bloodType}","${alert.units}","${alert.hospital}","${alert.urgency}","${alert.acceptedBy?.name || 'N/A'}","${alert.acceptedAt}"\n`
      })
    } else {
      csvContent += 'No upcoming alerts\n'
    }

    csvContent += '\n\n'

    // 6. COMPLETED ALERTS (DONOR)
    csvContent += '=== COMPLETED ALERTS (Donor Tasks) ===\n\n'
    if (appData && appData.completedAlerts && appData.completedAlerts.length > 0) {
      csvContent += 'ID,Blood Type,Units,Hospital,Urgency,Status,Completed At\n'
      appData.completedAlerts.forEach(alert => {
        csvContent += `"${alert.id}","${alert.bloodType}","${alert.units}","${alert.hospital}","${alert.urgency}","${alert.status}","${alert.completedAt}"\n`
      })
    } else {
      csvContent += 'No completed alerts\n'
    }

    csvContent += '\n\n'

    // 7. VOLUNTEER UPCOMING TASKS
    csvContent += '=== VOLUNTEER UPCOMING TASKS ===\n\n'
    if (appData && appData.volunteerUpcomingTasks && appData.volunteerUpcomingTasks.length > 0) {
      csvContent += 'ID,Service,Date,Place,Name,Accepted By,Accepted At\n'
      appData.volunteerUpcomingTasks.forEach(task => {
        csvContent += `"${task.id}","${task.service}","${task.date}","${task.place}","${task.name}","${task.acceptedBy?.name || 'N/A'}","${task.acceptedAt}"\n`
      })
    } else {
      csvContent += 'No volunteer upcoming tasks\n'
    }

    csvContent += '\n\n'

    // 8. VOLUNTEER COMPLETED TASKS
    csvContent += '=== VOLUNTEER COMPLETED TASKS ===\n\n'
    if (appData && appData.volunteerCompletedTasks && appData.volunteerCompletedTasks.length > 0) {
      csvContent += 'ID,Service,Date,Place,Name,Status,Completed At\n'
      appData.volunteerCompletedTasks.forEach(task => {
        csvContent += `"${task.id}","${task.service}","${task.date}","${task.place}","${task.name}","${task.status}","${task.completedAt}"\n`
      })
    } else {
      csvContent += 'No volunteer completed tasks\n'
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const timestamp = new Date().toISOString().split('T')[0]
    
    link.setAttribute('href', url)
    link.setAttribute('download', `SevaHub_Data_${timestamp}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('Data exported successfully!')
    return true
  } catch (error) {
    console.error('Error exporting data:', error)
    alert('Error exporting data: ' + error.message)
    return false
  }
}

// Alternative: Export as JSON
export const exportAllDataAsJSON = () => {
  try {
    const users = JSON.parse(localStorage.getItem('sevaHubUsers') || '[]')
    const authUser = JSON.parse(localStorage.getItem('sevaHubAuthUser') || 'null')
    const appData = JSON.parse(localStorage.getItem('sevaHubAppData') || 'null')

    const allData = {
      exportedAt: new Date().toISOString(),
      users,
      authUser,
      appData
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const timestamp = new Date().toISOString().split('T')[0]
    
    link.setAttribute('href', url)
    link.setAttribute('download', `SevaHub_Data_${timestamp}.json`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('JSON data exported successfully!')
    return true
  } catch (error) {
    console.error('Error exporting JSON:', error)
    alert('Error exporting data: ' + error.message)
    return false
  }
}
