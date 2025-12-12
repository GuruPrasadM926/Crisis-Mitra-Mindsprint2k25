import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import VolunteerLogin from './VolunteerLogin'
import VolunteerSignup from './VolunteerSignup'
import DonorLogin from './Donorlogin'
import DonorSignup from './DonorSignup'
import NeedyLogin from './NeedyLogin'
import NeedySignup from './NeedySignup'
import Dashboard from './Dashboard'
import Needy from './Needy'
import NeedyDashboard from './NeedyDashboard'
import Volunteer from './Volunteer'
import VolunteerOrDonor from './VolunteerOrDonor'
import VolunteerDashboard from './VolunteerDashboard'
import DonorDashboard from './DonorDashboard'
import DonorForm from './DonorForm'
import UserProfile from './UserProfile'
import { userDB } from './TempDB'

function App() {
  // Blood type compatibility checker
  const isBloodTypeCompatible = (donorType, neededType) => {
    if (!donorType || !neededType) return false

    const compatibility = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    }

    return compatibility[donorType]?.includes(neededType) || false
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard') // start at dashboard
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('User')
  const [userPhone, setUserPhone] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userAge, setUserAge] = useState('')
  const [userBloodType, setUserBloodType] = useState('')
  const [roleSelected, setRoleSelected] = useState(null)
  const [volunteerSubRole, setVolunteerSubRole] = useState(null) // volunteer or donor
  const [serviceRequests, setServiceRequests] = useState([])
  const [pageHistory, setPageHistory] = useState(['dashboard'])
  const [incomingAlerts, setIncomingAlerts] = useState([])
  const [upcomingAlerts, setUpcomingAlerts] = useState([])
  const [completedAlerts, setCompletedAlerts] = useState([])
  const [currentAlertBeingAccepted, setCurrentAlertBeingAccepted] = useState(null)

  // Volunteer task tracking (similar to donor alerts)
  const [volunteerUpcomingTasks, setVolunteerUpcomingTasks] = useState([])
  const [volunteerCompletedTasks, setVolunteerCompletedTasks] = useState([])
  const [currentTaskBeingAccepted, setCurrentTaskBeingAccepted] = useState(null)

  // ===== PERSISTENCE: Load user session on app mount =====
  useEffect(() => {
    const authUser = userDB.getAuthUser()
    if (authUser) {
      // Restore user session
      setIsLoggedIn(true)
      setUserId(authUser.id)
      setUserName(authUser.name)
      setUserPhone(authUser.phone)
      setUserEmail(authUser.email)
      setUserAge(authUser.age)
      setUserBloodType(authUser.bloodType)
      setRoleSelected(authUser.role)

      // Restore app data (alerts, requests, tasks)
      const appData = userDB.loadAppData()
      if (appData) {
        setServiceRequests(appData.serviceRequests || [])
        setIncomingAlerts(appData.incomingAlerts || [])
        setUpcomingAlerts(appData.upcomingAlerts || [])
        setCompletedAlerts(appData.completedAlerts || [])
        setVolunteerUpcomingTasks(appData.volunteerUpcomingTasks || [])
        setVolunteerCompletedTasks(appData.volunteerCompletedTasks || [])
        setCurrentPage('dashboard')
      }
      console.log('User session restored:', authUser.email)
    }
  }, [])

  // ===== SYNC DATA WITH BACKEND =====
  const syncDataWithBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/api/sync-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        console.log('✅ Data synced to backend')
      } else {
        console.warn('⚠️ Backend sync failed:', response.status)
      }
    } catch (error) {
      console.warn('⚠️ Cannot reach backend server (http://localhost:3001):', error.message)
    }
  }

  // ===== PERSISTENCE: Save app data whenever it changes =====
  useEffect(() => {
    if (isLoggedIn) {
      const appData = {
        serviceRequests,
        incomingAlerts,
        upcomingAlerts,
        completedAlerts,
        volunteerUpcomingTasks,
        volunteerCompletedTasks,
        timestamp: new Date().toISOString()
      }
      userDB.saveAppData(appData)

      // Sync with backend
      const allUsers = userDB.getAllUsers()
      const authUser = userDB.getAuthUser()
      syncDataWithBackend({
        users: allUsers,
        authUser: authUser,
        appData: appData
      })
    }
  }, [isLoggedIn, serviceRequests, incomingAlerts, upcomingAlerts, completedAlerts, volunteerUpcomingTasks, volunteerCompletedTasks])

  // Function to navigate to a new page and track history
  const navigateToPage = (page) => {
    if (page !== currentPage) {
      setPageHistory(prev => [...prev, page])
      setCurrentPage(page)
    }
  }

  // Function to go back to the previous page
  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = pageHistory.slice(0, -1)
      setPageHistory(newHistory)
      setCurrentPage(newHistory[newHistory.length - 1])
    }
  }

  // Handle accepting a blood donation alert
  const handleAcceptAlert = (alert) => {
    setCurrentAlertBeingAccepted(alert)
    navigateToPage('donorForm')
  }

  // Handle donor form submission after accepting an alert
  const handleDonorFormSubmit = (formData) => {
    // Update user age and blood type from form
    if (formData) {
      setUserAge(formData.age || '')
      setUserBloodType(formData.bloodType || '')
    }

    if (currentAlertBeingAccepted) {
      // Check blood type compatibility before accepting
      if (formData && isBloodTypeCompatible(formData.bloodType, currentAlertBeingAccepted.bloodType)) {
        const donorAcceptance = {
          name: userName,
          id: userId,
          role: 'Donor',
          phone: userPhone,
          email: userEmail,
          bloodType: formData.bloodType
        }
        const upcomingAlert = {
          ...currentAlertBeingAccepted,
          acceptedAt: new Date().toISOString(),
          acceptedBy: donorAcceptance
        }
        setUpcomingAlerts(prev => [...prev, upcomingAlert])
        setIncomingAlerts(prev => prev.filter(a => a.id !== currentAlertBeingAccepted.id))
        // Also update the original service request with acceptance info
        setServiceRequests(prev => prev.map(r =>
          r.id === currentAlertBeingAccepted.id
            ? {
              ...r,
              acceptances: [...(r.acceptances || []), donorAcceptance]
            }
            : r
        ))
        setCurrentAlertBeingAccepted(null)
        navigateToPage('donor')
      } else {
        // Blood type not compatible - alert stays in incoming, go back to dashboard
        alert('Your blood type is not compatible with the requested blood type. Please select a compatible request.')
        setCurrentAlertBeingAccepted(null)
        navigateToPage('donor')
      }
    } else {
      // If not accepting an alert, just redirect back to donor dashboard
      navigateToPage('donor')
    }
  }

  // Handle completing an alert (success or failure)
  const handleCompleteAlert = (alertId, status) => {
    const alert = upcomingAlerts.find(a => a.id === alertId)
    if (alert) {
      const completedAlert = {
        ...alert,
        status: status,
        completedAt: new Date().toISOString()
      }
      setCompletedAlerts(prev => [...prev, completedAlert])
      setUpcomingAlerts(prev => prev.filter(a => a.id !== alertId))
    }
  }

  // Handle volunteer accepting a service request
  const handleAcceptTask = (taskId) => {
    console.log('handleAcceptTask called with:', taskId)

    // Handle service requests
    const task = serviceRequests.find(t => t.id === taskId || String(t.id) === String(taskId))
    if (task) {
      const volunteerAcceptance = {
        name: userName,
        id: userId,
        role: 'Volunteer',
        phone: userPhone,
        email: userEmail
      }
      const upcomingTask = {
        ...task,
        acceptedAt: new Date().toISOString(),
        acceptedBy: volunteerAcceptance
      }
      setVolunteerUpcomingTasks(prev => [...prev, upcomingTask])
      // Update the original service request with acceptance info for NeedyDashboard
      console.log('Regular task accepted:', upcomingTask)
      setServiceRequests(prev => prev.map(r =>
        r.id === taskId || String(r.id) === String(taskId)
          ? { ...r, acceptances: [...(r.acceptances || []), volunteerAcceptance] }
          : r
      ))
    } else {
      console.warn('Task not found:', taskId, 'Available tasks:', serviceRequests.map(r => r.id))
    }
  }

  // Handle volunteer completing a task
  const handleCompleteTask = (taskId, status) => {
    console.log('handleCompleteTask called with:', taskId, 'status:', status)
    const task = volunteerUpcomingTasks.find(t => t.id === taskId || String(t.id) === String(taskId))
    if (task) {
      const completedTask = {
        ...task,
        status: status === 'success' ? 'Resolved' : 'Unresolved',
        completedAt: new Date().toISOString()
      }
      console.log('Task completed:', completedTask)
      setVolunteerCompletedTasks(prev => [...prev, completedTask])
      setVolunteerUpcomingTasks(prev => prev.filter(t => t.id !== taskId && String(t.id) !== String(taskId)))
      // Update serviceRequests status as well for NeedyDashboard
      setServiceRequests(prev => prev.map(r =>
        r.id === taskId || String(r.id) === String(taskId)
          ? { ...r, status: status === 'success' ? 'Resolved' : 'Unresolved' }
          : r
      ))
    } else {
      console.warn('Task not found in upcoming tasks:', taskId, 'Available tasks:', volunteerUpcomingTasks.map(t => ({ id: t.id, service: t.service })))
    }
  }

  // Handle needy accepting a volunteer/donor's acceptance
  const handleAcceptVolunteer = (requestId, acceptanceId) => {
    console.log('handleAcceptVolunteer called:', { requestId, acceptanceId })

    // Mark the alert as accepted by needy - update BOTH incomingAlerts and serviceRequests
    setIncomingAlerts(prev => {
      const updated = prev.map(alert =>
        alert.id === requestId ? { ...alert, acceptedByNeedy: true, acceptedAt: new Date() } : alert
      )
      console.log('Updated incomingAlerts:', updated.find(a => a.id === requestId))
      return updated
    })

    setServiceRequests(prev => {
      const updated = prev.map(r => {
        if (r.id === requestId) {
          console.log('Updating service request:', { id: r.id, acceptances: r.acceptances })
          // Find the acceptance with matching id
          const acceptedVolunteer = r.acceptances?.find(a => a.id === acceptanceId)
          if (acceptedVolunteer) {
            const newRequest = {
              ...r,
              acceptedBy: acceptedVolunteer,
              status: 'Accepted',
              acceptedByNeedy: true,
              acceptedAt: new Date()
            }
            console.log('New service request state:', newRequest)
            return newRequest
          }
        }
        return r
      })
      return updated
    })
  }

  // Handle needy rejecting a volunteer/donor's acceptance
  const handleRejectVolunteer = (requestId, acceptanceId, rejectionReason = '') => {
    console.log('handleRejectVolunteer called:', { requestId, acceptanceId, rejectionReason })

    setServiceRequests(prev => {
      const updated = prev.map(r => {
        if (r.id === requestId) {
          const rejectedAcceptance = r.acceptances?.find(a => a.id === acceptanceId)
          console.log(`Rejected ${rejectedAcceptance?.name} for request ${requestId}. Reason: ${rejectionReason}`)
          const newRequest = {
            ...r,
            acceptances: r.acceptances?.filter(a => a.id !== acceptanceId) || [],
            rejectedByNeedy: true,
            rejectionReason: rejectionReason,
            rejectedAt: new Date()
          }
          console.log('Updated service request after rejection:', newRequest)
          return newRequest
        }
        return r
      })
      return updated
    })

    // Mark the alert as rejected by this needy with reason
    setIncomingAlerts(prev => {
      const updated = prev.map(alert => {
        if (alert.id === requestId) {
          const newAlert = {
            ...alert,
            rejectedByNeedy: true,
            rejectionReason: rejectionReason,
            rejectedAt: new Date()
          }
          console.log('Updated incoming alert after rejection:', newAlert)
          return newAlert
        }
        return alert
      })
      return updated
    })

    // Show success message
    alert('✓ Rejection sent successfully')
  }

  // Handle needy marking service as successful
  const handleMarkServiceSuccess = (requestId, feedback = '') => {
    console.log('handleMarkServiceSuccess called:', { requestId, feedback })

    setServiceRequests(prev => {
      const updated = prev.map(r => {
        if (r.id === requestId) {
          const updatedRequest = {
            ...r,
            serviceStatus: 'success',
            serviceFeedback: feedback,
            ratedAt: new Date().toISOString(),
            status: 'Resolved'
          }
          console.log('Service marked as success:', updatedRequest)
          return updatedRequest
        }
        return r
      })
      return updated
    })

    // Move from incoming alerts to completed alerts
    const alertData = incomingAlerts.find(a => a.id === requestId)
    if (alertData) {
      setIncomingAlerts(prev => prev.filter(a => a.id !== requestId))
      setCompletedAlerts(prev => [...prev, {
        ...alertData,
        serviceStatus: 'success',
        serviceFeedback: feedback,
        ratedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'Completed'
      }])
    }

    window.alert('✓ Service marked as successful')
  }

  // Handle needy marking service as failed
  const handleMarkServiceFailure = (requestId, feedback = '') => {
    console.log('handleMarkServiceFailure called:', { requestId, feedback })

    setServiceRequests(prev => {
      const updated = prev.map(r => {
        if (r.id === requestId) {
          const updatedRequest = {
            ...r,
            serviceStatus: 'failure',
            serviceFeedback: feedback,
            ratedAt: new Date().toISOString(),
            status: 'Failed'
          }
          console.log('Service marked as failure:', updatedRequest)
          return updatedRequest
        }
        return r
      })
      return updated
    })

    // Move from incoming alerts to completed alerts
    const alertItem = incomingAlerts.find(a => a.id === requestId)
    if (alertItem) {
      setIncomingAlerts(prev => prev.filter(a => a.id !== requestId))
      setCompletedAlerts(prev => [...prev, {
        ...alertItem,
        serviceStatus: 'failure',
        serviceFeedback: feedback,
        ratedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'Failed'
      }])
    }

    window.alert('✕ Service marked as failed/incomplete')
  }

  if (!isLoggedIn) {
    // VolunteerOrDonor selection page (before login for volunteer role)
    if (currentPage === 'volunteerOrDonor') {
      return <VolunteerOrDonor
        userName={userName}
        onVolunteerSelect={() => {
          setVolunteerSubRole('volunteer')
          navigateToPage('login')
        }}
        onDonorSelect={() => {
          setVolunteerSubRole('donor')
          navigateToPage('login')
        }}
      />
    }

    if (currentPage === 'signup') {
      // render role-specific signup when a role was chosen
      if (roleSelected === 'volunteer') {
        if (volunteerSubRole === 'donor') {
          return <DonorSignup onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} onBack={() => navigateToPage('volunteerOrDonor')} />
        }
        return <VolunteerSignup onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} onBack={() => navigateToPage('volunteerOrDonor')} />
      }
      if (roleSelected === 'needy') {
        return <NeedySignup onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} onBack={() => { setRoleSelected(null); navigateToPage(isLoggedIn ? 'needy' : 'dashboard') }} />
      }
      return <SignupPage onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} role={roleSelected} />
    }

    if (currentPage === 'login') {
      // render role-specific login when a role was chosen
      if (roleSelected === 'volunteer') {
        if (volunteerSubRole === 'donor') {
          return <DonorLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, phone, id, age, bloodType, email) => {
            setUserName(name || 'User')
            setUserPhone(phone || '')
            setUserEmail(email || '')
            setUserId(id)
            setUserAge(age || '')
            setUserBloodType(bloodType || '')
            setIsLoggedIn(true)
            userDB.setAuthUser({ id, name, phone, email, age, bloodType, role: 'donor' })
            navigateToPage('donor')
          }} onBack={() => navigateToPage('volunteerOrDonor')} />
        }
        return <VolunteerLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, phone, id, email) => {
          setUserName(name || 'User')
          setUserPhone(phone || '')
          setUserEmail(email || '')
          setUserId(id)
          setIsLoggedIn(true)
          userDB.setAuthUser({ id, name, phone, email, role: 'volunteer' })
          navigateToPage('volunteer')
        }} onBack={() => navigateToPage('volunteerOrDonor')} />
      }
      if (roleSelected === 'needy') {
        return <NeedyLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, id) => {
          setUserName(name || 'User')
          setUserId(id)
          setIsLoggedIn(true)
          userDB.setAuthUser({ id, name, role: 'needy' })
          navigateToPage('needy')
        }} onBack={() => { setRoleSelected(null); navigateToPage(isLoggedIn ? 'needy' : 'dashboard') }} />
      }

      return <LoginPage onSignupClick={() => navigateToPage('signup')} onLogin={(name, id) => {
        setUserName(name || 'User')
        setUserId(id)
        setIsLoggedIn(true)
        userDB.setAuthUser({ id, name, role: roleSelected })
        if (roleSelected === 'needy') {
          navigateToPage('needy')
        } else if (roleSelected === 'volunteer') {
          navigateToPage('volunteer')
        } else {
          navigateToPage('dashboard')
        }
      }} role={roleSelected} />
    }

    // default: show dashboard (role selection) before auth
    return <Dashboard userName={userName} onLogout={() => {
      setIsLoggedIn(false)
      userDB.clearAuthUser()
      userDB.clearAppData()
      setCurrentPage('login')
    }} onRoleSelect={(role) => {
      setRoleSelected(role)
      // If volunteer role, show volunteer/donor selection first
      if (role === 'volunteer') {
        setCurrentPage('volunteerOrDonor')
      } else {
        setCurrentPage('login')
      }
    }} />
  }

  // when logged in
  if (isLoggedIn) {
    if (currentPage === 'profile') {
      return <UserProfile
        userId={userId}
        userName={userName}
        onBack={goBack}
        onLogout={() => {
          setIsLoggedIn(false)
          userDB.clearAuthUser()
          userDB.clearAppData()
          setCurrentPage('dashboard')
          setPageHistory(['dashboard'])
          setRoleSelected(null)
          setVolunteerSubRole(null)
          setUserId(null)
          setUserName('User')
          setUserPhone('')
          setUserEmail('')
          setUserAge('')
          setUserBloodType('')
          setIncomingAlerts([])
          setUpcomingAlerts([])
          setCompletedAlerts([])
          setVolunteerUpcomingTasks([])
          setVolunteerCompletedTasks([])
          setServiceRequests([])
        }}
      />
    }
    if (currentPage === 'volunteerOrDonor') {
      return <VolunteerOrDonor
        userName={userName}
        onVolunteerSelect={() => {
          setVolunteerSubRole('volunteer')
          navigateToPage('volunteer')
        }}
        onDonorSelect={() => {
          setVolunteerSubRole('donor')
          navigateToPage('donor')
        }}
        onProfileClick={() => navigateToPage('profile')}
        onBack={() => { setRoleSelected(null); navigateToPage('dashboard') }}
      />
    }
    if (currentPage === 'serviceRequestForm') {
      // Render your existing service request form here
      // For now, fallback to Needy (or replace with your form component)
      return <Needy userName={userName} onProfileClick={() => navigateToPage('profile')} onBack={() => navigateToPage('needy')} onServiceRequest={(request) => {
        const requestId = Date.now()

        // Blood and Organ requests go ONLY to Donor Dashboard (incoming alerts)
        if (request.service === 'Blood' || request.service === 'Organ') {
          const alert = {
            id: requestId,
            bloodType: request.bloodType,
            units: 1,
            hospital: request.place,
            urgency: 'High',
            requestType: request.service,
            organType: request.organType || null,
            patientAge: request.patientAge || null,
            requesterName: request.name,
            requesterContact: request.phone,
            createdAt: new Date().toISOString()
          }
          setIncomingAlerts(prev => [...prev, alert])
          // Also add to serviceRequests for NeedyDashboard display only
          const newRequest = { ...request, id: requestId, status: 'Pending', acceptedBy: null, requestType: 'Blood_Organ' }
          setServiceRequests(prev => [...prev, newRequest])
        } else {
          // Event Management and Social Service requests go ONLY to Volunteer Dashboard
          const newRequest = { ...request, id: requestId, status: 'Pending', acceptedBy: null, requestType: 'Event_Social' }
          setServiceRequests(prev => [...prev, newRequest])
        }

        navigateToPage('needy')
      }} />
    }
    if (currentPage === 'needy') {
      return <NeedyDashboard
        userName={userName}
        requests={serviceRequests}
        onNewRequest={() => navigateToPage('serviceRequestForm')}
        onPullRequest={(id) => {
          setServiceRequests(prev => prev.filter(r => r.id !== id))
          // Also remove from donor incoming alerts if it was a blood/organ request
          setIncomingAlerts(prev => prev.filter(a => a.id !== id))
        }}
        onAcceptVolunteer={handleAcceptVolunteer}
        onRejectVolunteer={handleRejectVolunteer}
        onMarkServiceSuccess={handleMarkServiceSuccess}
        onMarkServiceFailure={handleMarkServiceFailure}
        onBack={() => navigateToPage('dashboard')}
      />
    }
    if (currentPage === 'volunteer') {
      // Filter serviceRequests to only show Event/Social Service requests (not Blood/Organ)
      const volunteerRequests = serviceRequests.filter(req => req.requestType !== 'Blood_Organ')

      return <VolunteerDashboard
        userName={userName}
        onProfileClick={() => navigateToPage('profile')}
        onBack={() => navigateToPage('volunteerOrDonor')}
        serviceRequests={volunteerRequests}
        incomingAlerts={volunteerRequests}
        upcomingTasks={volunteerUpcomingTasks}
        completedTasks={volunteerCompletedTasks}
        onAcceptTask={handleAcceptTask}
        onCompleteTask={handleCompleteTask}
      />
    }
    if (currentPage === 'donorForm') {
      return <DonorForm
        userName={userName}
        phone={userPhone}
        userAge={userAge}
        userBloodType={userBloodType}
        onBack={() => navigateToPage('donor')}
        onProfileClick={() => navigateToPage('profile')}
        onSubmit={handleDonorFormSubmit}
      />
    }
    if (currentPage === 'donor') {
      return <DonorDashboard
        userName={userName}
        userAge={userAge}
        userBloodType={userBloodType}
        onProfileClick={() => navigateToPage('profile')}
        onBack={() => navigateToPage('volunteerOrDonor')}
        incomingAlerts={incomingAlerts.map(alert => {
          // Merge alert data with corresponding service request data (for rejection/acceptance status)
          const correspondingRequest = serviceRequests.find(r => r.id === alert.id)
          return {
            ...alert,
            acceptedByNeedy: correspondingRequest?.acceptedByNeedy || false,
            rejectedByNeedy: correspondingRequest?.rejectedByNeedy || false,
            rejectionReason: correspondingRequest?.rejectionReason || '',
            acceptances: correspondingRequest?.acceptances || []
          }
        })}
        upcomingAlerts={upcomingAlerts.map(alert => {
          // Also merge upcoming alerts with service request data
          const correspondingRequest = serviceRequests.find(r => r.id === alert.id)
          return {
            ...alert,
            acceptedByNeedy: correspondingRequest?.acceptedByNeedy || false,
            rejectedByNeedy: correspondingRequest?.rejectedByNeedy || false,
            rejectionReason: correspondingRequest?.rejectionReason || '',
            acceptances: correspondingRequest?.acceptances || []
          }
        })}
        completedAlerts={completedAlerts.map(alert => {
          // Also merge completed alerts with service request data
          const correspondingRequest = serviceRequests.find(r => r.id === alert.id)
          return {
            ...alert,
            acceptedByNeedy: correspondingRequest?.acceptedByNeedy || false,
            rejectedByNeedy: correspondingRequest?.rejectedByNeedy || false,
            rejectionReason: correspondingRequest?.rejectionReason || '',
            acceptances: correspondingRequest?.acceptances || []
          }
        })}
        onAcceptAlert={handleAcceptAlert}
        onCompleteAlert={handleCompleteAlert}
      />
    }
    return <Dashboard
      userName={userName}
      onProfileClick={() => navigateToPage('profile')}
      onLogout={() => {
        setIsLoggedIn(false)
        setCurrentPage('dashboard')
        setPageHistory(['dashboard'])
        setRoleSelected(null)
        setVolunteerSubRole(null)
        setUserId(null)
        setUserName('User')
        setUserPhone('')
        setUserEmail('')
        setUserAge('')
        setUserBloodType('')
        setIncomingAlerts([])
        setUpcomingAlerts([])
        setCompletedAlerts([])
        setVolunteerUpcomingTasks([])
        setVolunteerCompletedTasks([])
        setServiceRequests([])
      }}
      onRoleSelect={(role) => {
        if (role === 'needy') navigateToPage('needy')
        if (role === 'volunteer') {
          setRoleSelected('volunteer')
          setVolunteerSubRole(null)
          navigateToPage('volunteerOrDonor')
        }
      }}
    />
  }
}

export default App
