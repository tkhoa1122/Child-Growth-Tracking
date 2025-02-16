import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Header } from "./Header";
import { Footer } from "./Footer";
import backgroundImage from '../../public/Images/background.jpg';
import api from "../components/Utils/Axios";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    // Validate First Name
    if (!formData.firstName.trim()) {
      tempErrors.firstName = "Họ là bắt buộc";
    }

    // Validate Last Name
    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Tên là bắt buộc";
    }

    // Validate Username
    if (!formData.username) {
      tempErrors.username = "Username là bắt buộc";
    } else if (!usernameRegex.test(formData.username)) {
      tempErrors.username =
        "Username chỉ được chứa chữ cái, số và dấu gạch dưới, độ dài 3-20 ký tự";
    }

    // Validate Email
    if (!formData.email) {
      tempErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Email không hợp lệ";
    }

    // Validate Password
    if (!formData.password) {
      tempErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allFieldsTouched = Object.keys(touched).every((key) => touched[key]);

    if (!allFieldsTouched) {
      setTouched(
        Object.keys(touched).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }

    if (validateForm()) {
      console.log("Form submitted:", formData);
      // // Xử lý đăng ký ở đây
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     email: formData.email,
      //     password: formData.password,
      //   })
      // );
        try {
            // Gửi request đăng ký đến backend
            const response = await api.post('api/Auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Hiển thị thông báo thành công
            setNotification({
                show: true,
                message: 'Đăng ký thành công!',
                type: 'success'
            });

            // Chuyển hướng đến trang đăng nhập sau 1 giây
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

        } catch (error) {
            // Xử lý lỗi từ backend
            setNotification({
                show: true,
                message: error.response?.data || 'Đăng ký thất bại!',
                type: 'error'
            });
            
            // Tự động ẩn thông báo lỗi sau 3 giây
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    validateForm();
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        {/* Form Container */}
        <div className="max-w-md w-full space-y-8 relative z-10 my-8 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-2xl">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng nhập nếu đã có tài khoản
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                    className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                      touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Họ"
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Tên"
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            {/* Username Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => handleBlur('username')}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                    touched.username && errors.username ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Tên đăng nhập"
                />
              </div>
              {touched.username && errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                    touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Email"
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${
                      touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
