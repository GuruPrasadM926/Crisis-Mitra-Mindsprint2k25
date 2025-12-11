import { useState } from 'react'
import './App.css'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import VolunteerLogin from './VolunteerLogin'
import VolunteerSignup from './VolunteerSignup'
import NeedyLogin from './NeedyLogin'
import NeedySignup from './NeedySignup'
import Dashboard from './Dashboard'
import Needy from './Needy'
import Volunteer from './Volunteer'
import VolunteerDashboard from './VolunteerDashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard') // start at dashboard
  const [userName, setUserName] = useState('User')
  const [roleSelected, setRoleSelected] = useState(null)

  if (!isLoggedIn) {
    if (currentPage === 'signup') {
      // render role-specific signup when a role was chosen
      if (roleSelected === 'volunteer') {
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
        return <VolunteerLogin onSignupClick={() => setCurrentPage('signup')} onLogin={(name) => {
          setUserName(name || 'User')
          setIsLoggedIn(true)
          setCurrentPage('volunteer')
        }} />
      }
      if (roleSelected === 'needy') {
        return <NeedyLogin onSignupClick={() => setCurrentPage('signup')} onLogin={(name) => {
          setUserName(name || 'User')
          setIsLoggedIn(true)
          setCurrentPage('needy')
        }} />
      }

      return <LoginPage onSignupClick={() => setCurrentPage('signup')} onLogin={(name) => {
        setUserName(name || 'User')
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
      setCurrentPage('login')
    }} />
  }

  // when logged in
  if (isLoggedIn) {
    if (currentPage === 'needy') {
      return <Needy userName={userName} onBack={() => setCurrentPage('dashboard')} />
    }
    if (currentPage === 'volunteer') {
      return <VolunteerDashboard userName={userName} onBack={() => setCurrentPage('dashboard')} />
    }
    return <Dashboard userName={userName} onLogout={() => {
      setIsLoggedIn(false)
      setCurrentPage('login')
    }} onRoleSelect={(role) => {
      // when already logged in, selecting a role can navigate to needy/volunteer
      if (role === 'needy') setCurrentPage('needy')
      if (role === 'volunteer') setCurrentPage('volunteer')
    }} />
  }
}

export default App
