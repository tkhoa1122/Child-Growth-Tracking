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
// import { Navbar } from './components/sections/Navbar'
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
import AdminDashboard from './components/protection_page/Admin/AdminDashboard';
import DoctorManagement from './components/protection_page/Admin/DoctorManagement';
import { ServiceManagement } from './components/protection_page/Admin/ServiceManagement';
import { CreateService } from './components/protection_page/Admin/CreateService';
import { ProtectedRouteByRole } from './components/Utils/ProtectedRoute'
import { AdminLayout } from './components/layouts/AdminLayout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateService } from './components/protection_page/Admin/UpdateService';

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <>
      <Router>
        <AuthProvider>
          <>
            {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
            <div className={`min-h-screen transition-opacity duration-600 ${isLoaded ? "opacity-100" : "opacity-0"} bg-[rgba(3, 3, 3, 0.8)] text-gray-100`}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<Product />} />
                <Route path="/verify-otp" element={<OTPVerification />} />

                {/* Protected Routes for All Authenticated Users */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRouteByRole allowedRoles={['User', 'Doctor', 'Manager']}>
                      <Profile />
                    </ProtectedRouteByRole>
                  }
                />

                {/* Protected Routes for Users */}
                <Route
                  path="/family-profile"
                  element={
                    <ProtectedRouteByRole allowedRoles={['User']}>
                      <FamilyProfileManagement />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/detail-family"
                  element={
                    <ProtectedRouteByRole allowedRoles={['User']}>
                      <DetailFamilyProfile />
                    </ProtectedRouteByRole>
                  }
                />

                {/* Protected Routes for Doctors */}
                <Route
                  path="/doctor-dashboard/*"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Doctor']}>
                      <DoctorDashboard />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/doctor-dashboard/products"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Doctor']}>
                      <ProductManagement />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/doctor-dashboard/requests"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Doctor']}>
                      <RequestManagement />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/doctor-dashboard/appointments"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Doctor']}>
                      <AppointmentManagement />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/doctor-dashboard/feedback"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Doctor']}>
                      <FeedbackManagement />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/consultation-detail"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Doctor']}>
                      <ConsultationDetail />
                    </ProtectedRouteByRole>
                  }
                />

                {/* Protected Routes for Managers/Admin */}
                <Route
                  path="/admin-dashboard"
                  element={
                    //<ProtectedRouteByRole allowedRoles={['Manager']}>
                      <AdminDashboard />
                    //</ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/users"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <AdminDashboard />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/doctors"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <AdminDashboard activeTab="doctors" />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/services"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <AdminDashboard />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/statistics"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <AdminDashboard />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/settings"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <AdminDashboard />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/doctor-management"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <DoctorManagement />
                    </ProtectedRouteByRole>
                  }
                />
                <Route
                  path="/admin-dashboard/services/create"
                  element={
                    <ProtectedRouteByRole allowedRoles={['Manager']}>
                      <CreateService />
                    </ProtectedRouteByRole>
                  }
                />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="services" element={<ServiceManagement />} />
                  <Route path="services/create" element={<CreateService />} />
                  <Route path="services/edit/:id" element={<UpdateService />} />
                </Route>

                {/* 404 Route */}
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
        </AuthProvider>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
