import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const textColor = isScrolled ? 'text-black' : 'text-white';
    const hoverColor = isScrolled ? 'hover:text-blue-500' : 'hover:text-blue-400';

    return (
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
            isScrolled ? 'bg-[rgba(0, 0, 0, 0.8)] backdrop-blur-lg shadow-lg' : 'bg-transparent'
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
                    <div className="md:hidden">
                        <button 
                            onClick={toggleMenu}
                            className={`${textColor} ${hoverColor} transition-colors`}
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="hidden md:flex items-center justify-center flex-1 mx-8">
                        <div className="flex items-center justify-center space-x-8">
                            <Link to="/" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>Home</Link>
                            <Link to="/about" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>About</Link>
                            <Link to="/projects" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>Projects</Link>
                            <Link to="/contact" className={`text-lg ${textColor} ${hoverColor} transition-colors`}>Contact</Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                        <Link 
                            to="/login" 
                            className={`px-4 py-2 text-lg ${textColor} ${hoverColor} transition-colors`}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="px-4 py-2 bg-blue-500 text-lg text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                </div>
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col space-y-4 py-4">
                        <Link 
                            to="/" 
                            className={`text-lg ${textColor} ${hoverColor} transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/about" 
                            className={`text-lg ${textColor} ${hoverColor} transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link 
                            to="/projects" 
                            className={`text-lg ${textColor} ${hoverColor} transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Projects
                        </Link>
                        <Link 
                            to="/contact" 
                            className={`text-lg ${textColor} ${hoverColor} transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <div className="flex flex-col space-y-2">
                            <Link 
                                to="/login" 
                                className={`px-4 py-2 text-lg ${textColor} ${hoverColor} transition-colors text-center`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="mx-4 px-4 py-2 bg-blue-500 text-lg text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
