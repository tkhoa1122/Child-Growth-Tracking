import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { Header } from './Header';
import { Footer } from './Footer';
import api from "../components/Utils/Axios";

const backgroundImage = '/Images/background.jpg';

export const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        // Lấy email từ URL parameters
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        if (!emailParam) {
            navigate('/register');
            return;
        }
        setEmail(emailParam);
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('Auth/activate-account', {
                email: email,
                otp: otp
            });

            // Log response từ server
            console.log("Server response:", response);

            setNotification({
                show: true,
                message: 'Xác thực thành công!',
                type: 'success'
            });

            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (error) {
            console.error("OTP verification error:", error.response?.data);
            setNotification({
                show: true,
                message: error.response?.data?.message || 'Xác thực thất bại!',
                type: 'error'
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                    <span className={`font-medium ${
                        notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {notification.message}
                    </span>
                </div>
            )}

            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                
                <div className="max-w-md w-full space-y-8 relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-2xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Xác thực OTP
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Vui lòng nhập mã OTP đã được gửi đến email
                        </p>
                        <p className="text-center text-sm font-medium text-blue-600">
                            {email}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="otp" className="sr-only">
                                Mã OTP
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Nhập mã OTP"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};