import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import axios from '../../Utils/Axios';

const DoctorDashboard = () => {
    const [doctorInfo, setDoctorInfo] = useState({
        doctorId: "",
        accountId: "",
        fullNname: "",
        specialization: "",
        hospitalAddressWork: "",
        starRating: 0,
        experienceYears: "",
        email: "",
        phone: "",
        address: "",
        imageUrl: "",
        firstName: "",
        lastName: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({});

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get('Doctor/get-all');
                console.log(response);
                const data = response.data[0]; // Giả sử API trả về một mảng, lấy phần tử đầu tiên

                setDoctorInfo({
                    accountId: data.accountId,
                    doctorId: data.doctorId,
                    fullName: data.fullName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    specialization: data.specialization,
                    hospitalAddressWork: data.hospitalAddressWork,
                    starRating: data.starRating,
                    experienceYears: data.experienceYears,
                    email: data.email,
                    phone: data.phoneNumber,
                    address: data.hospitalAddressWork,
                    imageUrl: data.imageUrl,
                });
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };

        fetchDoctorData();
    }, []);

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.");
        if (confirmDelete) {
            // Gọi API để xóa tài khoản
            axios.delete(`Doctor/${doctorInfo.accountId}`)
                .then(response => {
                    alert("Tài khoản đã được xóa thành công.");
                    // Điều hướng về trang chủ hoặc trang đăng nhập
                    window.location.href = '/login';
                })
                .catch(error => {
                    console.error('Lỗi khi xóa tài khoản:', error);
                    alert("Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại.");
                });
        }
    };

    const handleUpdateClick = () => {
        setUpdatedInfo({
            accountId: doctorInfo.accountId,
            doctorId: doctorInfo.doctorId,
            firstName: doctorInfo.firstName,
            lastName: doctorInfo.lastName,
            email: doctorInfo.email,
            phone: doctorInfo.phone,
            specialization: doctorInfo.specialization,
            experienceYears: doctorInfo.experienceYears,
            hospitalAddressWork: doctorInfo.hospitalAddressWork,
            imageUrl: doctorInfo.imageUrl,
            fullName: `${doctorInfo.firstName} ${doctorInfo.lastName}`,
            starRating: 0
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        // Kiểm tra các trường cần thiết
        if (!updatedInfo.firstName || !updatedInfo.lastName || !updatedInfo.hospitalAddressWork || !updatedInfo.specialization || !updatedInfo.experienceYears || !updatedInfo.email || !updatedInfo.phone) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        try {
            console.log("Dữ liệu gửi lên API:", JSON.stringify(updatedInfo, null, 2));
            await axios.put(`Doctor/${doctorInfo.accountId}`, updatedInfo);
            alert("Cập nhật thông tin thành công!");
            setIsModalOpen(false);
            // Cập nhật lại thông tin bác sĩ
            setDoctorInfo((prev) => ({ ...prev, ...updatedInfo }));
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            alert("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
        }
    };

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar and Rating */}
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <img
                                src={doctorInfo.imageUrl || "/Images/avatar.jpg"}
                                alt="Doctor"
                                className="w-full h-auto max-h-80 object-cover rounded-lg shadow"
                            />
                        </div>
                        {/* Đánh giá sao */}
                        <div className="mt-2 bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    const rating = doctorInfo.starRating || 0;
                                    const isFullStar = starValue <= Math.floor(rating);
                                    const isHalfStar = starValue > Math.floor(rating) && starValue <= rating;
                                    const isGrayStar = starValue > rating;

                                    return (
                                        <div key={index} className="relative">
                                            <FaStar className={`text-gray-300 text-xl ${isGrayStar ? 'opacity-100' : 'opacity-0'}`} />
                                            {isFullStar && (
                                                <FaStar className="text-yellow-400 text-xl absolute top-0 left-0" />
                                            )}
                                            {isHalfStar && (
                                                <div className="absolute top-0 left-0" style={{ width: `${(rating - Math.floor(rating)) * 100}%`, overflow: 'hidden' }}>
                                                    <FaStar className="text-yellow-400 text-xl" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                <span className="text-2xl font-bold text-gray-600">{doctorInfo.starRating}</span>
                                <span className="text-gray-500">({doctorInfo.totalReviews} đánh giá)</span>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin bác sĩ */}
                    <div className="w-3/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-800">{doctorInfo.fullName}</h2>
                                <p className="text-gray-600 text-1x1">{doctorInfo.specialization} tại {doctorInfo.hospitalAddressWork}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleUpdateClick}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Cập nhật thông tin
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Xóa tài khoản
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            <div>
                                <h3 className="font-semibold text-2xl text-gray-700 mb-3 underline">📌 Thông Tin Liên Hệ:</h3>
                                <div className="space-y-3 text-gray-600 text-base">
                                    <p><span className="font-medium">📧 Email:</span> {doctorInfo.email}</p>
                                    <p><span className="font-medium">📞 Điện Thoại:</span> {doctorInfo.phone}</p>
                                    <p><span className="font-medium">📍 Địa Chỉ:</span> {doctorInfo.address}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-2xl text-gray-900 mb-3 underline">🎓 Chuyên Môn:</h3>
                                <div className="text-gray-600 text-base">
                                    <p><span className="font-medium">🏆 Kinh Nghiệm:</span> {doctorInfo.experienceYears}</p>
                                </div>
                            </div>
                        </div>

                        {doctorInfo.certifications?.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-700 mb-2">Chứng chỉ</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctorInfo.certifications.map((cert, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal for updating information */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
                        <div className="bg-white rounded-xl p-6 w-11/12 md:w-2/3 flex shadow-lg animate-fadeIn">
                            {/* Avatar cũ bên trái */}
                            <div className="w-1/3 flex flex-col items-center justify-center border-r pr-4">
                                <img
                                    src={updatedInfo.imageUrl || "/Images/avatar.jpg"}
                                    alt="Doctor"
                                    className="w-32 h-32 object-cover rounded-full shadow-lg"
                                />
                                <p className="mt-2 text-gray-600 text-sm">{doctorInfo.fullName}</p>
                            </div>

                            {/* Nội dung bên phải */}
                            <div className="w-2/3 pl-4">
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật thông tin</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Họ */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Họ</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={updatedInfo.firstName}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* Tên */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Tên</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={updatedInfo.lastName}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* Bệnh viện */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Bệnh viện</label>
                                        <input
                                            type="text"
                                            name="hospital"
                                            value={updatedInfo.hospitalAddressWork}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* Chuyên môn */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Chuyên môn</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={updatedInfo.specialization}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* Kinh nghiệm */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Kinh nghiệm</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={updatedInfo.experienceYears}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={updatedInfo.email}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* Điện thoại */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Điện thoại</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={updatedInfo.phone}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* URL hình ảnh */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">URL hình ảnh mới</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={updatedInfo.imageUrl}
                                            onChange={handleInputChange}
                                            className="border text-gray-500 border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>
                                </div>

                                {/* Nút hành động */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleUpdateSubmit}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 ml-2"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};
export default DoctorDashboard;