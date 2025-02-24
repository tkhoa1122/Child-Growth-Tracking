import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../Utils/AuthContext';

export const OwnHeader = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, userInfo } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const getProfilePath = () => {
        switch (userInfo.userRole) {
            case 'Manager':
                return '/admin-dashboard';
            case 'Doctor':
                return '/doctor-dashboard';
            default:
                return '/profile';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
    };

    const handleLogout = () => {
        // Gọi hàm logout từ AuthContext
        logout();
        // Đóng menu user nếu đang mở
        setShowUserMenu(false);
        // Chuyển về trang chủ
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
            <div className="max-w-8xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <span className="font-mono text-xl font-bold text-black">
                                Thonglnse<span className="text-blue-500">.tech</span>
                            </span>
                        </Link>
                    </div>

                    

                    {/* Auth Buttons or User Menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors"
                                >
                                    <FaUserCircle className="w-6 h-6" />
                                    <span className="text-sm">
                                        {userInfo.firstName} {userInfo.lastName}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <Link
                                            to={getProfilePath()}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Hồ Sơ
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                        >
                                            Đăng Xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-black hover:text-blue-500 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
