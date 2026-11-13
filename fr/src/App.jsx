import { Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import './App.css'

function App() {
  return (
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
  )
}

export default App