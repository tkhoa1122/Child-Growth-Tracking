import { Link, useLocation } from 'react-router-dom';
import { FaUserShield, FaUsers, FaUserMd, FaClipboardList, FaChartBar, FaCog } from 'react-icons/fa';
import { Header } from '../Header';
import { Footer } from '../Footer';

export const AdminLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            
            <div className="flex pt-16">
                {/* Sidebar Menu */}
                <div className="w-64 bg-gray-800 min-h-screen p-4 fixed">
                    <div className="space-y-4">
                        <Link
                            to="/admin-dashboard"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/admin-dashboard'
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaUserShield />
                            <span>Thông tin Admin</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/users"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/admin-dashboard/users'
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaUsers />
                            <span>Quản lý người dùng</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/doctors"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/admin-dashboard/doctors'
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaUserMd />
                            <span>Quản lý bác sĩ</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/services"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/admin-dashboard/services'
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaClipboardList />
                            <span>Quản lý dịch vụ</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/statistics"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/admin-dashboard/statistics'
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaChartBar />
                            <span>Thống kê</span>
                        </Link>
                        <Link
                            to="/admin-dashboard/settings"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/admin-dashboard/settings'
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaCog />
                            <span>Cài đặt hệ thống</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-64 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}; 