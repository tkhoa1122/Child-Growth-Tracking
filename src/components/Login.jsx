import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from './Utils/AuthContext';
import api from "../components/Utils/Axios";
import { jwtDecode } from 'jwt-decode';

const backgroundImage = '/Images/background.jpg';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    const validateForm = () => {
        let tempErrors = {};
        // Email regex cho phép cả email thông thường và email FPT
        const emailRegex = /^[A-Za-z0-9._%+-]+@((fpt\.edu\.vn)|([A-Za-z0-9.-]+\.[A-Za-z]{2,}))$/;

        if (!formData.email) {
            tempErrors.email = "Email là bắt buộc";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Email không hợp lệ. Vui lòng sử dụng email cá nhân hoặc email FPT (@fpt.edu.vn)";
        }

        if (!formData.password) {
            tempErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
            tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        setErrors(tempErrors);
        setTouched({
            email: true,
            password: true
        });
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('Auth/login', {
                email: formData.email.trim(),
                password: formData.password
            });

            // Lưu thông tin user từ response
            const { jwt, firstName, lastName } = response.data;
            
            // Cập nhật localStorage
            localStorage.setItem('token', jwt);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('userInfo', JSON.stringify({
                firstName,
                lastName,
                role: response.data.role // Giả sử role có trong response
            }));

            // Cập nhật Auth Context
            login(jwt, firstName, lastName);

            // Chuyển hướng
            setNotification({
                show: true,
                message: 'Đăng nhập thành công!',
                type: 'success'
            });
            setTimeout(() => navigate('/home'), 1000);

        } catch (error) {
            console.error('Login Error:', error.response?.data);
            setNotification({
                show: true,
                message: error.response?.data?.message || 'Đăng nhập thất bại',
                type: 'error'
            });

            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value
        }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    return (
        <div className="h-370 flex flex-col">
            <Header />

            {/* Notification Popup */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    ) : (
                        <FaTimesCircle className="w-6 h-6 text-red-500 mr-2" />
                    )}
                    <span className={`font-medium ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {notification.message}
                    </span>
                </div>
            )}

            {/* Main Content */}
            <main
                className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                {/* Form Container */}
                <div className="max-w-md w-full space-y-8 relative z-10">
                    <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-2xl">
                        <div>
                            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                                Đăng nhập
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Hoặc{' '}
                                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                    đăng ký tài khoản mới
                                </Link>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="mb-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-20">
                                        <FaEnvelope className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('email')}
                                        className={`appearance-none rounded-lg w-full pl-10 pr-3 py-3 border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                                            } bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                        placeholder="Địa chỉ email"
                                    />
                                </div>
                                <p className={`mt-2 text-sm text-red-600 transition-opacity duration-300 ${touched.email && errors.email ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    {errors.email || 'Email là bắt buộc'}
                                </p>
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-20">
                                        <FaLock className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('password')}
                                        className={`appearance-none rounded-lg w-full pl-10 pr-10 py-3 border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                                            } bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                        placeholder="Mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <p className={`mt-2 text-sm text-red-600 transition-opacity duration-300 ${touched.password && errors.password ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    {errors.password || 'Mật khẩu là bắt buộc'}
                                </p>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
