import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { FaUser, FaEnvelope, FaKey, FaEdit, FaUserCircle, FaUsers } from 'react-icons/fa';
import { useAuth } from '../Utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const backgroundImage = '/Images/background.jpg';

const Profile = () => {
    const { isAuthenticated } = useAuth();
    const token = localStorage.getItem('token');
    let userInfo = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userInfo = {
                email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            };
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow relative pt-20">
                {/* Background with overlay */}
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                </div>

                <div className="relative z-10 container mx-auto px-8 py-8">
                    {isAuthenticated && userInfo ? (
                        <div className="max-w-4xl mx-auto">
                            {/* Profile Header */}
                            <div className="bg-white/80 backdrop-blur-md rounded-t-2xl p-8 shadow-xl">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative">
                                        <FaUserCircle className="w-32 h-32 text-blue-500" />
                                        <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                                            <FaEdit className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                            Thông tin tài khoản
                                        </h1>
                                        <p className="text-gray-600">
                                            Quản lý thông tin cá nhân của bạn
                                        </p>
                                    </div>
                                    <Link
                                        to="/family-profile"
                                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <FaUsers className="w-5 h-5" />
                                        Quản lý gia đình
                                    </Link>
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="bg-white/90 backdrop-blur-md rounded-b-2xl p-8 shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* User ID Card */}
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-start gap-4">
                                            <FaUser className="w-8 h-8 mt-1" />
                                            <div>
                                                <p className="text-blue-100 text-sm">ID người dùng</p>
                                                <p className="font-semibold text-lg break-all">{userInfo.userId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Card */}
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-start gap-4">
                                            <FaEnvelope className="w-8 h-8 mt-1" />
                                            <div>
                                                <p className="text-purple-100 text-sm">Email</p>
                                                <p className="font-semibold text-lg break-all">{userInfo.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Card */}
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 md:col-span-2">
                                        <div className="flex items-start gap-4">
                                            <FaKey className="w-8 h-8 mt-1" />
                                            <div>
                                                <p className="text-green-100 text-sm">Vai trò</p>
                                                <p className="font-semibold text-lg">{userInfo.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                    <button 
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                                        onClick={() => {/* Thêm chức năng cập nhật thông tin */}}
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        Cập nhật thông tin
                                    </button>
                                    <button 
                                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                                        onClick={() => {/* Thêm chức năng đổi mật khẩu */}}
                                    >
                                        <FaKey className="w-4 h-4" />
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl max-w-md mx-auto text-center">
                            <FaUserCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Vui lòng đăng nhập
                            </h2>
                            <p className="text-gray-600">
                                Bạn cần đăng nhập để xem thông tin tài khoản
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
