import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import { LoadingScreen } from './components/LoadingScreen'
import { Home } from './components/sections/Home'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Projects } from './components/sections/Projects'
import { Login } from './components/Login'
import { RegisterPage } from './components/RegisterPage'
import { Navbar } from './components/sections/Navbar'
import "./index.css"
import Profile from './components/protection_page/Profile'
import { AuthProvider } from './components/Utils/AuthContext'
import { ProtectedRoute } from './components/Utils/ProtectedRoute'
import { FamilyProfileManagement } from './components/protection_page/FamilyProfileManagement'
import { DetailFamilyProfile } from './components/protection_page/DetailFamilyProfile'
import { Product } from './components/Product'

import { OTPVerification } from './components/OTPVerification'
import DoctorDashboard from './components/protection_page/Doctor/DoctorDashBoard'
import { ConsultationDetail } from './components/protection_page/Doctor/ConsultationDetail'
import { ProductManagement } from './components/protection_page/Doctor/ProductManagement';
import { RequestManagement } from './components/protection_page/Doctor/RequestManagement';
import AppointmentManagement from './components/protection_page/Doctor/AppointmentManagement';
import FeedbackManagement from './components/protection_page/Doctor/FeedbackManagement';

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <AuthProvider>
      <Router>
        <>
          {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
          <div className={`min-h-screen transition-opacity duration-600 ${isLoaded ? "opacity-100" : "opacity-0"} bg-[rgba(3, 3, 3, 0.8)] text-gray-100`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<Product />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/verify-otp" element={<OTPVerification />} />

              //Family
              <Route
                path="/family-profile"
                element={
                  <ProtectedRoute>
                    <FamilyProfileManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/detail-family"
                element={
                  <ProtectedRoute>
                    <DetailFamilyProfile />
                  </ProtectedRoute>
                }
              />

              //Doctor
              <Route
                path="/doctor-dashboard"
                element={
                  //<ProtectedRoute>
                  <DoctorDashboard />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/doctor-dashboard/products"
                element={
                  //<ProtectedRoute>
                  <ProductManagement />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/doctor-dashboard/requests"
                element={
                  //<ProtectedRoute>
                  <RequestManagement />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/doctor-dashboard/appointments"
                element={
                  //<ProtectedRoute>
                  <AppointmentManagement />
                  //</ProtectedRoute>
                } />
              <Route
                path="/doctor-dashboard/feedback"
                element={
                  // <ProtectedRoute>
                  <FeedbackManagement />
                  //</ProtectedRoute>
                }
              />
              <Route
                path="/consultation-detail"
                element={
                  //<ProtectedRoute>
                  <ConsultationDetail />
                  //</ProtectedRoute>
                }
              />

              <Route path="*" element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl">Trang không tồn tại</p>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </>
      </Router>
    </AuthProvider>
  )
}

export default App
