import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import HomePage from './pages/HomePage.jsx'
import Loader from './components/loader.jsx'
import { IntroContext } from './components/introContext.jsx'
import './App.css'

function App() {
  // App never unmounts, so the loader plays once per page load/refresh
  // and not again when navigating between internal routes.
  const [loading, setLoading] = useState(true)

  return (
    <IntroContext.Provider value={!loading}>
      <AnimatePresence>
        {loading && <Loader key='loader' onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/projects'
          element={<div className='p-10 text-white'>Projects page</div>}
        />
        <Route
          path='/services'
          element={<div className='p-10 text-white'>Services page</div>}
        />
        <Route
          path='/contact'
          element={<div className='p-10 text-white'>Contact page</div>}
        />
      </Routes>
    </IntroContext.Provider>
  )
}

export default App