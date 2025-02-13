import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '../assets/background.jpg';

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    const validateForm = () => {
        let tempErrors = {};
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!formData.email) {
            tempErrors.email = 'Email là bắt buộc';
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            tempErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(tempErrors);
        setTouched({
            email: true,
            password: true
        });
        return Object.keys(tempErrors).length === 0;
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         console.log('Form submitted:', formData);
    //     }
    // };

    //for demo

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);

            if (formData.rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Kiểm tra tài khoản (giả sử thành công)
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
            console.error("User is null, cannot read email.");
            alert("You've not registered! ");
            return;
        }

        if (storedUser.email === formData.email && storedUser.password === formData.password) {
            console.log('Form submitted:', formData);
            console.log('Stored user:', storedUser);
            // Lưu trạng thái đăng nhập
            localStorage.setItem("isAuthenticated", "true");
    
            // Chuyển hướng về trang chủ
            window.location.href = "/home";
        } else {
            console.log(storedUser.email === formData.email && storedUser.password === formData.password);
            console.log('Form submitted:', formData);
            console.log('Stored user:', storedUser);
            alert("Wrong Information!");
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
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                position: 'relative'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" style={{ position: 'fixed' }}></div>

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

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                            <p className={`mt-2 text-sm text-red-600 transition-opacity duration-300 ${touched.email && errors.email ? 'opacity-100' : 'opacity-0'}`}>
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
                            <p className={`mt-2 text-sm text-red-600 transition-opacity duration-300 ${touched.password && errors.password ? 'opacity-100' : 'opacity-0'}`}>
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
        </div>
    );
};
