import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import { LoadingScreen } from './components/LoadingScreen'
import { Home } from './components/sections/Home'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Projects } from './components/sections/Projects'
import { Login } from './components/Login'
import {RegisterPage} from './components/RegisterPage'
import { Navbar } from './components/sections/Navbar'
import "./index.css"

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <Router>
      <>
        {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
        <div className={`min-h-screen transition-opacity duration-600 ${isLoaded ? "opacity-100" : "opacity-0"} bg-[rgba(3, 3, 3, 0.8)] text-gray-100`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </>
    </Router>
  )
}

export default App
