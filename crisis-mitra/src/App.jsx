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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard') // start at dashboard
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('User')
  const [userPhone, setUserPhone] = useState('')
  const [userAge, setUserAge] = useState('')
  const [userBloodType, setUserBloodType] = useState('')
  const [roleSelected, setRoleSelected] = useState(null)
  const [volunteerSubRole, setVolunteerSubRole] = useState(null) // volunteer or donor
  const [serviceRequests, setServiceRequests] = useState([])
  const [pageHistory, setPageHistory] = useState(['dashboard'])
  const [incomingAlerts, setIncomingAlerts] = useState([])
  const [upcomingAlerts, setUpcomingAlerts] = useState([])
  const [completedAlerts, setCompletedAlerts] = useState([])

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
    const upcomingAlert = {
      ...alert,
      acceptedAt: new Date().toISOString()
    }
    setUpcomingAlerts(prev => [...prev, upcomingAlert])
    setIncomingAlerts(prev => prev.filter(a => a.id !== alert.id))
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
          return <DonorSignup onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} />
        }
        return <VolunteerSignup onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} />
      }
      if (roleSelected === 'needy') {
        return <NeedySignup onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} />
      }
      return <SignupPage onSignupSuccess={(name) => { setUserName(name || 'User'); navigateToPage('login') }} onLoginClick={() => navigateToPage('login')} role={roleSelected} />
    }

    if (currentPage === 'login') {
      // render role-specific login when a role was chosen
      if (roleSelected === 'volunteer') {
        if (volunteerSubRole === 'donor') {
          return <DonorLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, phone, id, age, bloodType) => {
            setUserName(name || 'User')
            setUserPhone(phone || '')
            setUserId(id)
            setUserAge(age || '')
            setUserBloodType(bloodType || '')
            setIsLoggedIn(true)
            navigateToPage('donor')
          }} />
        }
        return <VolunteerLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, phone, id) => {
          setUserName(name || 'User')
          setUserPhone(phone || '')
          setUserId(id)
          setIsLoggedIn(true)
          navigateToPage('volunteer')
        }} />
      }
      if (roleSelected === 'needy') {
        return <NeedyLogin onSignupClick={() => navigateToPage('signup')} onLogin={(name, id) => {
          setUserName(name || 'User')
          setUserId(id)
          setIsLoggedIn(true)
          navigateToPage('needy')
        }} />
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
          setUserAge('')
          setUserBloodType('')
          setIncomingAlerts([])
          setUpcomingAlerts([])
          setCompletedAlerts([])
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
      />
    }
    if (currentPage === 'serviceRequestForm') {
      // Render your existing service request form here
      // For now, fallback to Needy (or replace with your form component)
      return <Needy userName={userName} onProfileClick={() => navigateToPage('profile')} onBack={goBack} onServiceRequest={(request) => {
        setServiceRequests(prev => [...prev, { ...request, id: Date.now(), status: 'Pending' }])
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
        }}
        onBack={goBack}
      />
    }
    if (currentPage === 'volunteer') {
      return <VolunteerDashboard userName={userName} onProfileClick={() => navigateToPage('profile')} onBack={goBack} serviceRequests={serviceRequests} />
    }
    if (currentPage === 'donor') {
      return <DonorDashboard
        userName={userName}
        userAge={userAge}
        userBloodType={userBloodType}
        onProfileClick={() => navigateToPage('profile')}
        onBack={goBack}
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
        setUserAge('')
        setUserBloodType('')
        setIncomingAlerts([])
        setUpcomingAlerts([])
        setCompletedAlerts([])
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
