import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const ProtectedRouteByRole = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();
    
    // Kiểm tra chưa đăng nhập
    if (!isAuthenticated) {
        // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        // Kiểm tra token và role
        const token = localStorage.getItem('token');
        if (!token) {
            return <Navigate to="/login" replace />;
        }

        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        const currentTime = Date.now() / 1000;

        // Kiểm tra token hết hạn
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        // Kiểm tra role có được phép truy cập không
        if (!allowedRoles.includes(userRole)) {
            // Chuyển hướng dựa vào role của người dùng
            switch (userRole) {
                case 'Manager':
                    return <Navigate to="/admin-dashboard" replace />;
                case 'Doctor':
                    return <Navigate to="/doctor-dashboard" replace />;
                default:
                    return <Navigate to="/home" replace />;
            }
        }

        return children;
    } catch (error) {
        console.error('Error in ProtectedRouteByRole:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};
