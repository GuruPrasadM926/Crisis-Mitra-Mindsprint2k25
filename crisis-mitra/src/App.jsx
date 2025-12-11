import { useState } from 'react'
import './App.css'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('login') // 'login' or 'signup'

  if (!isLoggedIn) {
    if (currentPage === 'signup') {
      return <SignupPage onSignupSuccess={() => setCurrentPage('login')} onLoginClick={() => setCurrentPage('login')} />
    }
    return <LoginPage onSignupClick={() => setCurrentPage('signup')} />
  }

  return (
    <div>
      <h1>Welcome to Crisis Mitra</h1>
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
    </div>
  )
}

export default App
