import { useState } from 'react'
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
        const upcomingAlert = {
          ...currentAlertBeingAccepted,
          acceptedAt: new Date().toISOString(),
          acceptedBy: {
            name: userName,
            id: userId,
            role: 'Donor',
            phone: userPhone,
            email: userEmail,
            bloodType: formData.bloodType
          }
        }
        setUpcomingAlerts(prev => [...prev, upcomingAlert])
        setIncomingAlerts(prev => prev.filter(a => a.id !== currentAlertBeingAccepted.id))
        // Also update the original service request with acceptedBy info
        setServiceRequests(prev => prev.map(r =>
          r.id === currentAlertBeingAccepted.id
            ? { ...r, acceptedBy: upcomingAlert.acceptedBy }
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
    const task = serviceRequests.find(t => t.id === taskId)
    if (task) {
      const acceptedByInfo = {
        name: userName,
        id: userId,
        role: 'Volunteer',
        phone: userPhone,
        email: userEmail
      }
      const upcomingTask = {
        ...task,
        acceptedAt: new Date().toISOString(),
        acceptedBy: acceptedByInfo
      }
      setVolunteerUpcomingTasks(prev => [...prev, upcomingTask])
      // Update the original service request with acceptedBy info for NeedyDashboard
      setServiceRequests(prev => prev.map(r => r.id === taskId ? { ...r, acceptedBy: acceptedByInfo } : r))
    }
  }

  // Handle volunteer completing a task
  const handleCompleteTask = (taskId, status) => {
    const task = volunteerUpcomingTasks.find(t => t.id === taskId)
    if (task) {
      const completedTask = {
        ...task,
        status: status === 'success' ? 'Resolved' : 'Unresolved',
        completedAt: new Date().toISOString()
      }
      setVolunteerCompletedTasks(prev => [...prev, completedTask])
      setVolunteerUpcomingTasks(prev => prev.filter(t => t.id !== taskId))
      // Update serviceRequests status as well for NeedyDashboard
      setServiceRequests(prev => prev.map(r =>
        r.id === taskId
          ? { ...r, status: status === 'success' ? 'Resolved' : 'Unresolved' }
          : r
      ))
    }
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
            navigateToPage('donor')
          }} onBack={() => navigateToPage('volunteerOrDonor')} />
        }
        return <VolunteerLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, phone, id, email) => {
          setUserName(name || 'User')
          setUserPhone(phone || '')
          setUserEmail(email || '')
          setUserId(id)
          setIsLoggedIn(true)
          navigateToPage('volunteer')
        }} onBack={() => navigateToPage('volunteerOrDonor')} />
      }
      if (roleSelected === 'needy') {
        return <NeedyLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, id) => {
          setUserName(name || 'User')
          setUserId(id)
          setIsLoggedIn(true)
          navigateToPage('needy')
        }} onBack={() => { setRoleSelected(null); navigateToPage(isLoggedIn ? 'needy' : 'dashboard') }} />
      }

      return <LoginPage onSignupClick={() => navigateToPage('signup')} onLogin={(name, id) => {
        setUserName(name || 'User')
        setUserId(id)
        setIsLoggedIn(true)
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
        onBack={() => navigateToPage('volunteerOrDonor')}
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
        incomingAlerts={incomingAlerts}
        upcomingAlerts={upcomingAlerts}
        completedAlerts={completedAlerts}
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
