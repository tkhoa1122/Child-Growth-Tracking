import { useState, useEffect } from 'react';
import api from "../../Utils/Axios";
import { FaUserMd, FaStar, FaPhone, FaEnvelope, FaHospital, FaBriefcase } from 'react-icons/fa';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('Doctor/get-all');
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý bác sĩ</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Thêm bác sĩ mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor.doctorId} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        {doctor.imageUrl ? (
                                            <img 
                                                src={doctor.imageUrl} 
                                                alt={doctor.fullName}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <FaUserMd className="w-16 h-16 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{doctor.fullName}</h3>
                                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-400" />
                                    <span className="ml-1 text-gray-600">{doctor.starRating}</span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <FaEnvelope className="w-4 h-4 mr-2" />
                                    <span>{doctor.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaPhone className="w-4 h-4 mr-2" />
                                    <span>{doctor.phoneNumber}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaHospital className="w-4 h-4 mr-2" />
                                    <span>{doctor.hospitalAddressWork}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaBriefcase className="w-4 h-4 mr-2" />
                                    <span>{doctor.experienceYears} năm kinh nghiệm</span>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-3">
                                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors">
                                    Chỉnh sửa
                                </button>
                                <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition-colors">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorManagement;
