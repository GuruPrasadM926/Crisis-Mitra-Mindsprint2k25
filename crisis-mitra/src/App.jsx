import { useState } from 'react'
import './App.css'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import Dashboard from './Dashboard'
import Needy from './Needy'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'signup', 'dashboard', 'needy'
  const [userName, setUserName] = useState('User')

  if (!isLoggedIn) {
    if (currentPage === 'signup') {
      return <SignupPage onSignupSuccess={(name) => {
        setUserName(name || 'User')
        setCurrentPage('login')
      }} onLoginClick={() => setCurrentPage('login')} />
    }
    return <LoginPage onSignupClick={() => setCurrentPage('signup')} onLogin={(name) => {
      setUserName(name || 'User')
      setIsLoggedIn(true)
      setCurrentPage('dashboard')
    }} />
  }

  if (isLoggedIn) {
    if (currentPage === 'needy') {
      return <Needy userName={userName} onBack={() => setCurrentPage('dashboard')} />
    }
    return <Dashboard userName={userName} onLogout={() => {
      setIsLoggedIn(false)
      setCurrentPage('login')
    }} onNeedyClick={() => setCurrentPage('needy')} />
  }
}

export default App
