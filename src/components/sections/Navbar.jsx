import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 64) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav 
            className={`fixed w-full z-30 transition-all duration-300 ${
                isScrolled 
                    ? 'top-0 bg-white shadow-lg' 
                    : 'top-16 bg-transparent'
            }`}
        >
            <div className="max-w-3xl mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-center h-16">
                    <div className="flex items-center space-x-12">
                        <Link to="/" className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors`}>
                            Home
                        </Link>
                        <Link to="/about" className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors`}>
                            About
                        </Link>
                        <Link to="/products" className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors`}>
                            Products
                        </Link>
                        <Link to="/projects" className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors`}>
                            Projects
                        </Link>
                        <Link to="/contact" className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors`}>
                            Contact
                        </Link>
                      
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex justify-center h-16 items-center">
                    <button 
                        onClick={toggleMenu}
                        className={`${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors`}
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

                {/* Mobile Menu */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col space-y-4 py-4">
                        <Link 
                            to="/" 
                            className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/about" 
                            className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link 
                            to="/products" 
                            className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link 
                            to="/projects" 
                            className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Projects
                        </Link>
                        <Link 
                            to="/contact" 
                            className={`text-lg ${isScrolled ? 'text-black' : 'text-white'} hover:text-blue-500 transition-colors text-center`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};