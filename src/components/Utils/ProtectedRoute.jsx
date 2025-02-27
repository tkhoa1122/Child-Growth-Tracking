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
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Chờ cho đến khi authentication state được khởi tạo
    if (isLoading) {
        return <div>Loading...</div>; // Hoặc component loading của bạn
    }

    // Kiểm tra authentication
    if (!isAuthenticated) {
        // Redirect to login và lưu lại URL người dùng đang cố truy cập
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Kiểm tra role từ token
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const cleanToken = token.replace(/^"|"$/g, '');
        const decoded = jwtDecode(cleanToken);
        const userRole = decoded.role;

        // Kiểm tra xem role của user có trong danh sách được phép không
        if (!allowedRoles.includes(userRole)) {
            // Nếu không có quyền, chuyển về trang chủ hoặc trang thông báo lỗi
            return <Navigate to="/unauthorized" replace />;
        }

        // Nếu có quyền, render component
        return children;

    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return <Navigate to="/login" replace />;
    }
};

// Trang Unauthorized
export const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <p className="text-xl text-gray-700 mb-4">Không có quyền truy cập</p>
                <p className="text-gray-500">Bạn không có quyền truy cập vào trang này.</p>
            </div>
        </div>
    );
};
