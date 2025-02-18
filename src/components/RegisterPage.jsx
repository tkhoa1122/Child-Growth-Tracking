import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Header } from "./Header";
import { Footer } from "./Footer";
import api from "../components/Utils/Axios";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: ""
  });

  const backgroundImage = '/Images/background.jpg';
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phoneNumber: false,
    address: false,
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!formData.firstName || formData.firstName.trim() === "") {
      tempErrors.firstName = "Họ là bắt buộc";
    }

    if (!formData.lastName || formData.lastName.trim() === "") {
      tempErrors.lastName = "Tên là bắt buộc";
    }

    if (!formData.email || formData.email.trim() === "") {
      tempErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Email không hợp lệ";
    }

    if (!formData.password || formData.password.trim() === "") {
      tempErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword || formData.confirmPassword.trim() === "") {
      tempErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      tempErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!formData.address || formData.address.trim() === "") {
      tempErrors.address = "Địa chỉ là bắt buộc";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        try {
            // Tạo object data theo đúng format API yêu cầu
            const registerData = {
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                address: formData.address.trim()
            };

            // Log data trước khi gửi request
            console.log("Sending registration data:", registerData);

            // Gửi request đến API endpoint
            const response = await api.post("Auth/register", registerData);
            
            // Log response từ server
            console.log("Server response:", response);

            setNotification({
                show: true,
                message: response.data.message || "Đăng ký thành công! Vui lòng kiểm tra email để nhập mã OTP",
                type: "success"
            });

            // Chuyển hướng đến trang OTP với email
            setTimeout(() => {
                navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
            }, 1000);

        } catch (error) {
            // Log chi tiết lỗi
            console.error("Registration error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.response?.data?.message
            });

            setNotification({
                show: true,
                message: error.response?.data?.message || "Đăng ký thất bại! Vui lòng thử lại.",
                type: "error"
            });

            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 2000);
        }
    } else {
        console.log("Form validation failed:", errors);
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
                    className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
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
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Tên"
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            {/* Phone Number Field */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phoneNumber')}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Số điện thoại"
                />
              </div>
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Địa chỉ"
                />
              </div>
              {touched.address && errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address}</p>
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
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
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
                    className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
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
                    className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
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
