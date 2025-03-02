import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useAuth } from './Utils/AuthContext';
import { jwtDecode } from 'jwt-decode';

export const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, login, userId } = useAuth();
    const [userInfo, setUserInfo] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        role: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {

        const getUserInfo = () => {
            const token = localStorage.getItem('token');
            if (token && isAuthenticated) {
                // Lấy thông tin từ localStorage thay vì decode token
                const storedUser = {
                    userId: localStorage.getItem('userId') || '',
                    firstName: localStorage.getItem('firstName') || '',
                    lastName: localStorage.getItem('lastName') || '',
                    // role: localStorage.getItem('role') || '',
                    // email: localStorage.getItem('email') || ''
                };
                console.log(storedUser);
                setUserInfo(storedUser);
            }
        };

        getUserInfo();

    }, [isAuthenticated]);

    useEffect(() => {
        console.log("userInfo đã cập nhật:", userInfo);
    }, [userInfo]);

    const getProfilePath = () => {
        switch (userInfo.role) {
            default:
                return '/profile';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <span className="font-mono text-xl font-bold text-black">
                                Thonglnse<span className="text-blue-500">.tech</span>
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
                            />
                            <button 
                                type="submit"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FaSearch className="h-4 w-4" />
                            </button>
                        </form>
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
                                        {userInfo.firstName || userInfo.lastName 
                                            ? [userInfo.firstName, userInfo.lastName].filter(Boolean).join(' ')
                                            : 'Tài khoản'}
                                    </span>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                         <Link
                                            to={`/profile/${userInfo.userId}`}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Hồ Sơ
                                        </Link>
                                        <Link
                                            to={`/change-password/${userInfo.userId}`}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Đổi mật khẩu
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
