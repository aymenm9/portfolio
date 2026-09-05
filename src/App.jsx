import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import './css/screen.css'

// Route-level code splitting — the standard portfolio must not ship the desktop OS
const StandardPortfolio = lazy(() => import('./components/StandardPortfolio.jsx'))
const LockScreen = lazy(() => import('./components/lockScreen.jsx'))
const HomeScreen = lazy(() => import('./components/homeScreen.jsx'))
const ChatBot = lazy(() => import('./components/chatBot.jsx'))

function AppContent() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const apiUrl = 'https://portfolio-chatbot-92au.onrender.com';

  useEffect(
    () => {
      //This is to wake up the server from the cold start, deferred to idle so it never competes with first paint
      const wake = () => {
        fetch(apiUrl).then(
          (responce) => {
            console.log(responce.ok ? 'server is runing' : 'something go wrong')
            return responce.json()
          }
        ).then((data) => {
          console.log(data);
        }).catch(err => console.log('Server wake up failed:', err))
      }
      const idle = window.requestIdleCallback
        ? window.requestIdleCallback(wake, { timeout: 4000 })
        : setTimeout(wake, 2000)
      return () => {
        if (window.requestIdleCallback) cancelIdleCallback(idle)
        else clearTimeout(idle)
      }
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
      <Suspense fallback={null}>
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

        {/* Chatbot lives in the desktop OS only — not on the standard portfolio */}
        {pathname !== '/' && <ChatBot apiUrl={apiUrl} />}
      </Suspense>
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
