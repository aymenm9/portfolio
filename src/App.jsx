import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LockScreen from './components/lockScreen.jsx'
import HomeScreen from './components/homeScreen.jsx'
import ChatBot from './components/chatBot.jsx'
import './App.css'
import './css/screen.css'
import StandardPortfolio from './components/StandardPortfolio.jsx'

function AppContent() {
  const navigate = useNavigate();
  const apiUrl = 'https://portfolio-chatbot-92au.onrender.com';
  console.log(apiUrl);

  useEffect(
    () => {
      //This is to wake up the server from the cold start
      fetch(apiUrl).then(
        (responce) => {
          console.log(responce.ok ? 'server is runing' : 'something go wrong')
          return responce.json()
        }
      ).then((data) => {
        console.log(data);
      }).catch(err => console.log('Server wake up failed:', err))
    }, []
  )

  const handleUnlock = () => {
    navigate('/home');
  }

  const handleLock = () => {
    navigate('/lock');
  }

  const handleShutdown = () => {
    navigate('/');
  }

  return (
    <>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<StandardPortfolio />} />

        {/* Lock screen route */}
        <Route path="/lock" element={
          <div className="screen" style={{ backgroundBlendMode: 'overlay' }}>
            <LockScreen onUnlock={handleUnlock} />
          </div>
        } />

        {/* Home screen route */}
        <Route path="/home" element={
          <div className="screen" style={{ backgroundBlendMode: 'normal' }}>
            <HomeScreen onLock={handleLock} onShutdown={handleShutdown} />
          </div>
        } />
      </Routes>

      <ChatBot apiUrl={apiUrl} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename="/portfolio">
      <AppContent />
    </BrowserRouter>
  )
}

export default App
