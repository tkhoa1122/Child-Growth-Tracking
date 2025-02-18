import { useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaCamera, FaPlus, FaEdit, FaTrash, FaUserCircle, FaEye } from 'react-icons/fa';
import { useAuth } from '../Utils/AuthContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const backgroundImage = '/Images/background.jpg';

export const FamilyProfileManagement = () => {
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

    // Dữ liệu mẫu cho danh sách thành viên
    const [familyMembers] = useState([
        {
            id: 1,
            avatarUrl: "/Images/avtfe.jpg",
            firstName: "Alice",
            lastName: "Doe",
            gender: "Nữ",
            dateOfBirth: "2015-05-15",
            relationship: "Con gái"
        },
        {
            id: 2,
            avatarUrl: "/Images/avatar.jpg",
            firstName: "Bob",
            lastName: "Doe",
            gender: "Nam",
            dateOfBirth: "2018-03-20",
            relationship: "Con trai"
        }
    ]);

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

                <div className="relative z-10 container mx-auto px-4 py-8">
                    {isAuthenticated && userInfo ? (
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* User Profile Card */}
                            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative">
                                        <FaUserCircle className="w-32 h-32 text-blue-500" />
                                        <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                                            <FaCamera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                            Quản lý hồ sơ gia đình
                                        </h1>
                                        <p className="text-gray-600">
                                            Email: {userInfo.email}
                                        </p>
                                        <p className="text-gray-600">
                                            Vai trò: {userInfo.role}
                                        </p>
                                    </div>
                                    <button 
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                        onClick={() => {/* Thêm chức năng */}}
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Thêm thành viên mới
                                    </button>
                                </div>
                            </div>

                            {/* Family Members Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {familyMembers.map((member) => (
                                    <div 
                                        key={member.id} 
                                        className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={member.avatarUrl}
                                                alt={`${member.firstName} ${member.lastName}`}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {member.firstName} {member.lastName}
                                                </h3>
                                                <p className="text-gray-600">{member.relationship}</p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-sm text-gray-500">
                                                        <FaVenusMars className="inline-block mr-2" />
                                                        {member.gender}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        <FaCalendar className="inline-block mr-2" />
                                                        {member.dateOfBirth}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Updated action buttons with new routes */}
                                        <div className="mt-6 flex justify-end gap-2">
                                            <Link 
                                                to="/detail-family"
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye className="w-5 h-5" />
                                                <span className="text-sm">Chi tiết</span>
                                            </Link>
                                            <button 
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                                                onClick={() => {/* Thêm chức năng sửa */}}
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit className="w-5 h-5" />
                                                <span className="text-sm">Sửa</span>
                                            </button>
                                            <button 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                                onClick={() => {/* Thêm chức năng xóa */}}
                                                title="Xóa"
                                            >
                                                <FaTrash className="w-5 h-5" />
                                                <span className="text-sm">Xóa</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl max-w-md mx-auto text-center">
                            <FaUserCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Vui lòng đăng nhập
                            </h2>
                            <p className="text-gray-600">
                                Bạn cần đăng nhập để xem thông tin gia đình
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

// Info Card Component
const InfoCard = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-center p-4 bg-white/60 rounded-lg ${className}`}>
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
            {React.cloneElement(icon, { className: "w-6 h-6 text-blue-500" })}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-700">{value}</p>
        </div>
    </div>
);
