import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', role: '' });
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Kiểm tra token và phân quyền khi component mount
    useEffect(() => {
        const validateToken = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('userInfo');
            if (token && storedUser) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    
                    if (decoded.exp > currentTime) {
                        setIsAuthenticated(true);
                        setUserInfo(JSON.parse(storedUser)); // Lấy thông tin user từ localStorage
                        setUser(decoded);
                        
                        // Kiểm tra URL hiện tại có phù hợp với role không
                        const currentPath = location.pathname;
                        const userRole = decoded.role;
                        
                        if (currentPath.includes('/admin-dashboard') && userRole !== 'Manager') {
                            navigate('/home');
                        } else if (currentPath.includes('/doctor-dashboard') && userRole !== 'Doctor') {
                            navigate('/home');
                        }
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Error validating token:', error);
                    handleLogout();
                }
            }
        };

        validateToken();
        
        // Kiểm tra token định kỳ
        const intervalId = setInterval(validateToken, 60000); // Kiểm tra mỗi phút
        
        return () => clearInterval(intervalId);
    }, [navigate, location]);

    const login = (token, firstName, lastName, role) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setUser(decoded);
            setUserInfo({ firstName, lastName, role });

            const userRole = decoded.role;
            localStorage.setItem('userInfo', JSON.stringify({ firstName, lastName, userRole }));

            // Điều hướng dựa vào role sau khi đăng nhập
            const from = location.state?.from?.pathname || '/';

            switch (userRole) {
                case 'Manager':
                    navigate('/admin-dashboard');
                    break;
                case 'Doctor':
                    navigate('/doctor-dashboard');
                    break;
                default:
                    navigate(from);
                    break;
            }
        } catch (error) {
            console.error('Error during login:', error);
            handleLogout();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            userInfo, 
            logout: handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
