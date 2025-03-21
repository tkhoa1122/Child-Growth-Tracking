import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import api from '../Utils/Axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from '../Utils/AuthContext';
import { toast } from 'react-toastify';

const CustomArrow = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-blue-500 
            hover:text-blue-600 rounded-full p-3 shadow-lg transition-all duration-300 
            ${direction === 'left' ? '-left-4' : '-right-4'}`}
    >
        {direction === 'left' ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
    </button>
);

const BuyServiceOrder = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('banking');
    const [userInfo, setUserInfo] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [checkingRights, setCheckingRights] = useState(false);

    const checkServiceRights = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                // Lấy thông tin tài khoản để lấy parentId
                const userResponse = await api.get(`/Parent/by-accountId/${userId}`);
                const parentId = userResponse.data.parentId;

                if (parentId) {
                    setCheckingRights(true); // Bắt đầu kiểm tra quyền
                    const response = await api.get(`/serviceorder/CheckServiceRights/${parentId}`);
                    if (response.status === 200 && response.data.isValid) {
                        // Nếu có quyền truy cập, chuyển hướng về trang chính
                        toast.info('Bạn không thể mua dịch vụ mới vì đang có dịch vụ hoạt động.');
                        navigate('/'); // Hoặc trang khác mà bạn muốn
                    }
                }
            } catch (error) {
                console.error('Lỗi kiểm tra quyền truy cập dịch vụ:', error);
                toast.error('Không thể kiểm tra quyền truy cập dịch vụ.');
            } finally {
                setCheckingRights(false); // Kết thúc kiểm tra quyền
            }
        }
    };

    useEffect(() => {
        checkServiceRights(); // Kiểm tra quyền truy cập dịch vụ khi vào trang
        const fetchServices = async () => {
            try {
                const response = await api.get('/service/list-service');
                setServices(response.data);
            } catch (error) {
                console.error('Lỗi tải dịch vụ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const accountId = localStorage.getItem('userId');
                if (accountId) {
                    const response = await api.get(`/Parent/by-accountId/${accountId}`);
                    setUserInfo(response.data);
                }
            } catch (error) {
                console.error('Lỗi tải thông tin người dùng:', error);
            }
        };
        
        if (isAuthenticated) fetchUserInfo();
    }, [isAuthenticated]);

    const handleServiceRegistration = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            if (paymentMethod === 'cash') {
                const orderData = {
                    parentId: userInfo.parentId,
                    serviceId: selectedService.serviceId,
                    quantity: 1
                };

                const response = await api.post('/serviceorder/CreateServiceOrder', orderData);
                
                if (response.status === 200) {
                    toast.success('Đăng ký dịch vụ thành công!', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    setSelectedService(null);
                } else {
                    toast.error('Đăng ký dịch vụ thất bại!', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } else if (paymentMethod === 'banking') {
                const paymentData = {
                    parentId: userInfo.parentId,
                    description: selectedService.serviceName,
                    returnUrl: "http://localhost:5173/payment-success",
                    cancelUrl: "http://localhost:5173/payment-fail",
                    services: [
                        {
                            serviceId: selectedService.serviceId,
                            quantity: 1,
                            totalPrice: 0
                        }
                    ]
                };

                const response = await api.post('/payments/create', paymentData);
                
                if (response.data && response.data.paymentUrl) {
                    window.location.href = response.data.paymentUrl;
                } else {
                    toast.error('Không thể tạo liên kết thanh toán!', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            }
        } catch (error) {
            console.error('Lỗi xử lý thanh toán:', error);
            toast.error(error.response?.data?.message || 'Xử lý thanh toán thất bại!', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <CustomArrow direction="right" />,
        prevArrow: <CustomArrow direction="left" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#80CBC4' }}>
            <Header />
            <div className="container mx-auto p-8 text-black pt-20">
                <h1 className="text-4xl font-bold text-left mb-8">Các Gói Dịch Vụ</h1>
                
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="relative px-8">
                            <Slider {...sliderSettings}>
                                {services
                                    .filter(service => service.isActive)
                                    .map((service) => (
                                        <div key={service.serviceId} className="px-2">
                                            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                                <div className="relative h-48">
                                                    <img
                                                        src="/Images/information.png"
                                                        alt={service.serviceName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                                        {service.serviceDuration} ngày
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {service.serviceName}
                                                    </h3>
                                                    <div className="flex items-center text-gray-600 mb-4">
                                                        <FaCalendarAlt className="mr-2" />
                                                        <span>
                                                            Ngày tạo: {new Date(service.serviceCreateDate).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <div className="text-2xl font-bold text-blue-500 mb-4">
                                                        {new Intl.NumberFormat('vi-VN', { 
                                                            style: 'currency', 
                                                            currency: 'VND' 
                                                        }).format(service.servicePrice)}
                                                    </div>
                                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                                        {service.serviceDescription}
                                                    </p>
                                                    <button 
                                                        onClick={() => setSelectedService(service)}
                                                        className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors"
                                                    >
                                                        Đăng ký ngay
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </Slider>
                        </div>
                        
                        {selectedService && (
                            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold mb-4">Biên lai đăng ký dịch vụ</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Thông tin người mua:</h3>
                                        {userInfo && (
                                            <div className="space-y-1">
                                                <p className='' >Mã khách hàng: {userInfo.parentId}</p>
                                                <p>Họ tên: {userInfo.account.firstName} {userInfo.account.lastName}</p>
                                                <p>Email: {userInfo.account.email}</p>
                                                <p>Điện thoại: {userInfo.account.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">Thông tin gói dịch vụ:</h3>
                                        <p>Tên gói: {selectedService.serviceName}</p>
                                        <p>Ngày đăng ký: {new Date().toLocaleDateString('vi-VN')}</p>
                                        <p>Hiệu lực: {selectedService.serviceDuration} ngày</p>
                                        <p>Hết hạn: {new Date(
                                            new Date().getTime() + selectedService.serviceDuration * 24 * 60 * 60 * 1000
                                        ).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="text-left p-2">Đơn giá</th>
                                                <th className="text-left p-2">Số lượng</th>
                                                <th className="text-left p-2">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-2">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(selectedService.servicePrice)}
                                                </td>
                                                <td className="p-2">1</td>
                                                <td className="p-2">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(selectedService.servicePrice)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <button 
                                    onClick={handleServiceRegistration}
                                    className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors"
                                >
                                    Thanh toán và Đăng ký
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BuyServiceOrder;
