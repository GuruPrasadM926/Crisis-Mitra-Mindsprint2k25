import { useState } from 'react'
import './App.css'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import Dashboard from './Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('login') // 'login' or 'signup'
  const [userName, setUserName] = useState('User')

  if (isLoggedIn) {
    return <Dashboard userName={userName} onLogout={() => {
      setIsLoggedIn(false)
      setCurrentPage('login')
    }} />
  }

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
    }} />
  }
}

export default App
