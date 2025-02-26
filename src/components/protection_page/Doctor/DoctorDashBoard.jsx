import React, { useEffect, useState } from 'react';
import { FaStar, FaEdit } from 'react-icons/fa';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import axios from '../../Utils/Axios';

const DoctorDashboard = () => {
    const [doctorInfo, setDoctorInfo] = useState({
        name: "",
        specialty: "",
        hospital: "",
        rating: 0,
        totalReviews: 0,
        experience: "",
        email: "",
        phone: "",
        address: "",
        education: "",
        certifications: [],
        bio: "",
        imageUrl: ""
    });

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get('Doctor/get-all');
                const data = response.data[0]; // Giả sử API trả về một mảng, lấy phần tử đầu tiên

                setDoctorInfo({
                    name: `${data.firstName} ${data.lastName}`,
                    specialty: data.specialization,
                    hospital: data.hospitalAddressWork,
                    rating: data.starRating,
                    experience: `${data.experienceYears} years`,
                    email: data.email,
                    phone: data.phoneNumber,
                    address: data.hospitalAddressWork,
                    imageUrl: data.imageUrl,
                    certifications: data.certifications || [] // Đảm bảo certifications là một mảng
                });
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };

        fetchDoctorData();
    }, []);

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-8">
                    {/* Avatar and Rating */}
                    <div className="w-1/3">
                        <div className="relative">
                            <img
                                src={doctorInfo.imageUrl || "/Images/avatar.jpg"}
                                alt="Doctor"
                                className="w-full h-auto max-h-64 object-contain rounded-lg shadow"
                            />
                            <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                <FaEdit className="text-gray-600" />
                            </button>
                        </div>
                        <div className="mt-4 bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-center gap-2">
                                {/* Hiển thị sao đánh giá */}
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    const rating = doctorInfo.rating || 0; // Đảm bảo rating có giá trị mặc định
                                    const isFullStar = starValue <= Math.floor(rating); // Kiểm tra sao vàng đầy đủ
                                    const isHalfStar = starValue > Math.floor(rating) && starValue <= rating; // Hiển thị 1 nửa sau nếu giá trị thực tại index lớn hơn index
                                    const isGrayStar = starValue > rating; // Kiểm tra sao mờ

                                    return (
                                        <div key={index} className="relative">
                                            {/* Sao mờ (nền) */}
                                            <FaStar className={`text-gray-300 text-xl ${isGrayStar ? 'opacity-100' : 'opacity-0'}`} />
                                            {/* Sao vàng (phần hiển thị) */}
                                            {isFullStar && (
                                                <FaStar className="text-yellow-400 text-xl absolute top-0 left-0" />
                                            )}
                                            {/* Sao nửa vàng */}
                                            {isHalfStar && (
                                                <div className="absolute top-0 left-0" style={{ width: `${(rating - Math.floor(rating)) * 100}%`, overflow: 'hidden' }}>
                                                    <FaStar className="text-yellow-400 text-xl" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                <span className="text-2xl font-bold text-gray-600">{doctorInfo.rating}</span>
                                <span className="text-gray-500">({doctorInfo.totalReviews} đánh giá)</span>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="w-2/3">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{doctorInfo.name}</h2>
                                <p className="text-gray-600">{doctorInfo.specialty} at {doctorInfo.hospital}</p>
                            </div>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Cập nhật thông tin
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Thông tin liên hệ</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><span className="font-medium">Email:</span> {doctorInfo.email}</p>
                                    <p><span className="font-medium">Điện thoại:</span> {doctorInfo.phone}</p>
                                    <p><span className="font-medium">Địa chỉ:</span> {doctorInfo.address}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-2xl text-gray-900 mb-2">Chuyên môn</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><span className="font-medium">Kinh nghiệm:</span> {doctorInfo.experience}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Chứng chỉ</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(doctorInfo.certifications) && doctorInfo.certifications.map((cert, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboard;