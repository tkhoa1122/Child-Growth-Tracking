import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Header } from "./Header";
import { Footer } from "./Footer";
import backgroundImage from '../../public/Images/background.jpg';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFieldsTouched = Object.keys(touched).every((key) => touched[key]);

    if (!allFieldsTouched) {
      setTouched(
        Object.keys(touched).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
    }

    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Xử lý đăng ký ở đây

      //for demo
      // Giả sử đăng ký thành công, lưu thông tin vào localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        })
      );

      // Chuyển hướng người dùng sang trang đăng nhập
      window.location.href = "/login";
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
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="relative">
                <FaUser className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  className={`rounded-lg w-full pl-10 pr-3 py-3 border ${
                    touched.firstName && errors.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-white`}
                  placeholder="Họ"
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                  className={`rounded-lg w-full px-3 py-3 border ${
                    touched.lastName && errors.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-white`}
                  placeholder="Tên"
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={`rounded-lg w-full pl-10 pr-3 py-3 border ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-white`}
                placeholder="Email"
              />
              {touched.email && errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
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
