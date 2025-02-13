import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropDownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.style.overflowY = 'scroll';
        return () => {
            document.documentElement.style.overflowY = '';
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".user-dropdown")) {
                setIsDropDownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    //demo check login
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (isAuthenticated === "true" && storedUser) {
            setUser(storedUser);
        } else {
            setUser(null);
        }
        //Check when user logout or logout in other tab
        // checkAuth();
        // window.addEventListener("storage", checkAuth); // Listen for changes in localStorage

        // return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login"); // Chuyển về trang đăng nhập sau khi logout
    };


    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const textColor = isScrolled ? 'text-black' : 'text-white';
    const hoverColor = isScrolled ? 'hover:text-blue-500' : 'hover:text-blue-400';

    return (
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[rgba(0, 0, 0, 0.8)] backdrop-blur-lg shadow-lg' : 'bg-transparent'
            } border-b border-white/10`}
            style={{ paddingRight: 'calc(100vw - 100%)' }}
        >

            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className={`font-mono text-2xl font-bold ${textColor}`}>
                            Thonglnse<span className="text-blue-500">.tech</span>
                        </Link>
                    </div>

                    {/* MENU */}
                    <div className="hidden md:flex items-center justify-center flex-1 mx-8">
                        <div className="flex items-center justify-center space-x-8">
                            <Link to="/" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>Home</Link>
                            <Link to="/about" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>About</Link>
                            <Link to="/projects" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>Projects</Link>
                            <Link to="/contact" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>Contact</Link>
                        </div>
                    </div>

                    {/* USER INFO */}
                    <div
                        className="relative hidden md:flex items-center space-x-4 flex-shrink-0 cursor-pointer user-dropdown"
                        onClick={() => setIsDropDownOpen(prev => !prev)} // Toggle dropdown
                    >
                        {user ? (
                            <div className="flex items-center space-x-2">
                                <FaUserCircle className="text-2xl text-gray-400" />
                                <span className={`text-lg ${textColor}`}>{user.firstName} {user.lastName}</span>

                                {/* Dropdown */}
                                {isDropdownOpen && user && (
                                    <div className="absolute top-full mt-2 min-w-[150px] w-max z-50 bg-white shadow-lg rounded-lg border border-gray-200">
                                        <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className={`px-4 py-2 text-lg ${textColor} ${hoverColor} transition-colors`}>
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-blue-500 text-lg text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};