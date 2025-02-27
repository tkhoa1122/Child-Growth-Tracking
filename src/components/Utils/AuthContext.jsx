import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const cleanToken = token.replace(/^"|"$/g, '');
                    const decoded = jwtDecode(cleanToken);
                    
                    // Kiểm tra token hết hạn
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp > currentTime) {
                        setIsAuthenticated(true);
                        setUserRole(decoded.role);
                        
                        // Điều hướng dựa vào role sau khi refresh
                        if (window.location.pathname === '/login') {
                            switch (decoded.role) {
                                case 'Manager':
                                    navigate('/admin');
                                    break;
                                case 'Doctor':
                                    navigate('/doctor-dashboard');
                                    break;
                                case 'User':
                                    navigate('/home');
                                    break;
                                default:
                                    navigate('/home');
                                    break;
                            }
                        }
                    } else {
                        // Token hết hạn
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                        setUserRole(null);
                        navigate('/login');
                    }
                } catch (error) {
                    console.error("Token validation error:", error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUserRole(null);
                    navigate('/login');
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, [navigate]);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUserRole(decoded.role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        navigate('/login');
    };

    if (isLoading) {
        return <div>Loading...</div>; // Hoặc component loading của bạn
    }

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            userRole, 
            login, 
            logout,
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
