import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ProtectedRouteByRole } from '../Utils/ProtectedRoute';
import api from '../Utils/Axios';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);

    // Lấy orderCode từ URL parameters
    const getOrderCodeFromUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('orderCode');
    };

    const handleNavigateHome = async () => {
        setIsProcessing(true);
        const orderCode = getOrderCodeFromUrl();

        try {
            // Kiểm tra trạng thái thanh toán
            const checkStatusResponse = await api.get(`/payments/check-status/${orderCode}`);
            
            if (checkStatusResponse.status === 200 && checkStatusResponse.data.status === 'PAID') {
                // Nếu thanh toán thành công, cập nhật trạng thái
                const accountId = localStorage.getItem('userId');
                if (!accountId) {
                    toast.error('Không tìm thấy thông tin người dùng!');
                    setIsProcessing(false);
                    return;
                }

                try {
                    const userResponse = await api.get(`/Parent/by-accountId/${accountId}`);
                    const parentId = userResponse.data.parentId;

                    // Cập nhật trạng thái đơn hàng
                    const updateResponse = await api.post(`/payments/update-status/${parentId}`);
                    
                    if (updateResponse.status === 200) {
                        toast.success('Xác nhận thanh toán thành công!', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            onClose: () => navigate('/') // Chuyển hướng sau khi toast đóng
                        });
                    } else {
                        toast.error('Không thể cập nhật trạng thái đơn hàng!');
                    }
                } catch (error) {
                    console.error('Lỗi cập nhật trạng thái:', error);
                    toast.error(error.response?.data?.message || 'Lỗi cập nhật trạng thái đơn hàng!');
                }
            } else {
                toast.error('Trạng thái thanh toán không hợp lệ!');
            }
        } catch (error) {
            console.error('Lỗi kiểm tra trạng thái:', error);
            toast.error(error.response?.data?.message || 'Lỗi kiểm tra trạng thái thanh toán!');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ProtectedRouteByRole allowedRoles={['User']}>
            <div className="min-h-screen bg-[#F8F3D9]">
                <Header />
                <div className="container mx-auto px-4 pt-32">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg 
                                    className="w-12 h-12 text-green-500" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-green-600 mb-4">
                            Thanh toán thành công!
                        </h2>
                        
                        <p className="text-gray-600 mb-8">
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. 
                            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                        </p>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleNavigateHome}
                                disabled={isProcessing}
                                className={`px-6 py-3 bg-blue-500 text-white rounded-lg transition-colors ${
                                    isProcessing 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-blue-600'
                                }`}
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Về trang chủ'}
                            </button>
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        </ProtectedRouteByRole>
    );
};

export default PaymentSuccess;
