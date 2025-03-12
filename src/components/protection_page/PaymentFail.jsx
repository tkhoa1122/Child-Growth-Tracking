import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ProtectedRouteByRole } from '../Utils/ProtectedRoute';

const PaymentFail = () => {
    const navigate = useNavigate();

    return (
        <ProtectedRouteByRole allowedRoles={['User']}>
            <div className="min-h-screen bg-[#F8F3D9]">
                <Header />
                <div className="container mx-auto px-4 pt-32">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <svg 
                                    className="w-12 h-12 text-red-500" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-red-600 mb-4">
                            Thanh toán thất bại!
                        </h2>
                        
                        <p className="text-gray-600 mb-8">
                            Rất tiếc, giao dịch của bạn không thành công. 
                            Vui lòng kiểm tra lại thông tin thanh toán và thử lại.
                        </p>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Về trang chủ
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        </ProtectedRouteByRole>
    );
};

export default PaymentFail;
