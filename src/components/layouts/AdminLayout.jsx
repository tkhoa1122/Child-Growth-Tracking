import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaUserMd, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import {OwnHeader} from '../layouts/OwnHeader';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-15">
            <OwnHeader/>
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-white shadow-lg fixed">
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <nav className="mt-6">
                        <div className="px-4 space-y-3">
                            <button
                                onClick={() => navigate('/admin')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    isActive('/admin') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaHome className="text-xl" />
                                <span className="font-medium">Dash Board</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/services')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.includes('/admin/services') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaClipboardList className="text-xl" />
                                <span className="font-medium">Service Management</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/doctors')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.includes('/admin/doctors') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaUserMd className="text-xl" />
                                <span className="font-medium">Doctor Management</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/users')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.includes('/admin/users') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaUsers className="text-xl" />
                                <span className="font-medium">User Management</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/products')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.includes('/admin/products') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaClipboardList className="text-xl" />
                                <span className="font-medium">Product Management</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/statistics')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.includes('/admin/statistics') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaChartBar className="text-xl" />
                                <span className="font-medium">Statistic</span>
                            </button>

                            {/* <button
                                onClick={() => navigate('/admin/settings')}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.includes('/admin/settings') 
                                        ? 'bg-blue-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FaCog className="text-xl" />
                                <span className="font-medium">Cài đặt</span>
                            </button> */}
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-64">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}; 