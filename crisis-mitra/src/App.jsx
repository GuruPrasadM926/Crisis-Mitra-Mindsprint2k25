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
import Volunteer from './Volunteer'
import VolunteerOrDonor from './VolunteerOrDonor'
import VolunteerDashboard from './VolunteerDashboard'
import DonorForm from './DonorForm'
import UserProfile from './UserProfile'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard') // start at dashboard
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('User')
  const [userPhone, setUserPhone] = useState('')
  const [roleSelected, setRoleSelected] = useState(null)
  const [volunteerSubRole, setVolunteerSubRole] = useState(null) // volunteer or donor

  if (!isLoggedIn) {
    // VolunteerOrDonor selection page (before login for volunteer role)
    if (currentPage === 'volunteerOrDonor') {
      return <VolunteerOrDonor
        userName={userName}
        onVolunteerSelect={() => {
          setVolunteerSubRole('volunteer')
          setCurrentPage('login')
        }}
        onDonorSelect={() => {
          setVolunteerSubRole('donor')
          setCurrentPage('login')
        }}
      />
    }

    if (currentPage === 'signup') {
      // render role-specific signup when a role was chosen
      if (roleSelected === 'volunteer') {
        if (volunteerSubRole === 'donor') {
          return <DonorSignup onSignupSuccess={(name) => { setUserName(name || 'User'); setCurrentPage('login') }} onLoginClick={() => setCurrentPage('login')} />
        }
        return <VolunteerSignup onSignupSuccess={(name) => { setUserName(name || 'User'); setCurrentPage('login') }} onLoginClick={() => setCurrentPage('login')} />
      }
      if (roleSelected === 'needy') {
        return <NeedySignup onSignupSuccess={(name) => { setUserName(name || 'User'); setCurrentPage('login') }} onLoginClick={() => setCurrentPage('login')} />
      }
      return <SignupPage onSignupSuccess={(name) => { setUserName(name || 'User'); setCurrentPage('login') }} onLoginClick={() => setCurrentPage('login')} role={roleSelected} />
    }

    if (currentPage === 'login') {
      // render role-specific login when a role was chosen
      if (roleSelected === 'volunteer') {
        if (volunteerSubRole === 'donor') {
          return <DonorLogin onSignupClick={() => setCurrentPage('signup')} onLogin={(name, phone, id) => {
            setUserName(name || 'User')
            setUserPhone(phone || '')
            setUserId(id)
            setIsLoggedIn(true)
            setCurrentPage('donor')
          }} />
        }
        return <VolunteerLogin onSignupClick={() => setCurrentPage('signup')} onLogin={(name, phone, id) => {
          setUserName(name || 'User')
          setUserPhone(phone || '')
          setUserId(id)
          setIsLoggedIn(true)
          setCurrentPage('volunteer')
        }} />
      }
      if (roleSelected === 'needy') {
        return <NeedyLogin onSignupClick={() => setCurrentPage('signup')} onLogin={(name, id) => {
          setUserName(name || 'User')
          setUserId(id)
          setIsLoggedIn(true)
          setCurrentPage('needy')
        }} />
      }

      return <LoginPage onSignupClick={() => setCurrentPage('signup')} onLogin={(name, id) => {
        setUserName(name || 'User')
        setUserId(id)
        setIsLoggedIn(true)
        setCurrentPage(roleSelected === 'needy' ? 'needy' : roleSelected === 'volunteer' ? 'volunteer' : 'dashboard')
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
        onBack={() => setCurrentPage('dashboard')}
        onLogout={() => {
          setIsLoggedIn(false)
          setCurrentPage('dashboard')
          setRoleSelected(null)
          setVolunteerSubRole(null)
          setUserId(null)
        }}
      />
    }
    if (currentPage === 'volunteerOrDonor') {
      return <VolunteerOrDonor
        userName={userName}
        onVolunteerSelect={() => {
          setVolunteerSubRole('volunteer')
          setCurrentPage('volunteer')
        }}
        onDonorSelect={() => {
          setVolunteerSubRole('donor')
          setCurrentPage('donor')
        }}
      />
    }
    if (currentPage === 'needy') {
      return <Needy userName={userName} onProfileClick={() => setCurrentPage('profile')} onBack={() => setCurrentPage('dashboard')} />
    }
    if (currentPage === 'volunteer') {
      return <VolunteerDashboard userName={userName} onProfileClick={() => setCurrentPage('profile')} onBack={() => setCurrentPage('dashboard')} />
    }
    if (currentPage === 'donor') {
      return <DonorForm userName={userName} phone={userPhone} onProfileClick={() => setCurrentPage('profile')} onBack={() => setCurrentPage('dashboard')} />
    }
    return <Dashboard
      userName={userName}
      onProfileClick={() => setCurrentPage('profile')}
      onLogout={() => {
        setIsLoggedIn(false)
        setCurrentPage('dashboard')
        setRoleSelected(null)
        setVolunteerSubRole(null)
        setUserId(null)
      }}
      onRoleSelect={(role) => {
        if (role === 'needy') setCurrentPage('needy')
        if (role === 'volunteer') {
          setRoleSelected('volunteer')
          setVolunteerSubRole(null)
          setCurrentPage('volunteerOrDonor')
        }
      }}
    />
  }
}

export default App
