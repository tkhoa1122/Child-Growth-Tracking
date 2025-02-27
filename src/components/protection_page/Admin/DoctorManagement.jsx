import { useState, useEffect } from 'react';
import api from "../../Utils/Axios";
import { FaUserMd, FaStar, FaPhone, FaEnvelope, FaHospital, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Kiểm tra token
            const response = await api.get('Manager/doctors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const deleteDoctor = async (accountId) => {
        try {
            const token = localStorage.getItem("token");
            
            // Gọi API với accountId thay vì doctorId
            await api.delete(`Manager/doctors/${accountId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Cập nhật state bằng accountId
            setDoctors(prev => prev.filter(doctor => doctor.accountId !== accountId));
            setNotification({ 
                show: true, 
                message: 'Xóa bác sĩ thành công!', 
                type: 'success' 
            });

        } catch (error) {
            console.error('Lỗi xóa bác sĩ:', error);
            setNotification({ 
                show: true, 
                message: error.response?.data?.message || 'Xóa bác sĩ thất bại. Vui lòng thử lại.', 
                type: 'error' 
            });
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
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`font-medium ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                        {notification.message}
                    </span>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý bác sĩ</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Thêm bác sĩ mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div 
                        key={doctor.doctorId} 
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => navigate(`/admin/doctors/${doctor.accountId}`)}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <img 
                                            className="w-16 h-16 rounded-full object-cover" 
                                            src={doctor.imageUrl || '/Images/doctor.png'} 
                                            alt={doctor.fullName}
                                            onError={(e) => {
                                                e.target.src = '/Images/doctor.png'; // Đặt hình ảnh mặc định nếu có lỗi
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{doctor.fullName}</h3>
                                        <p className="text-gray-600 text-sm">Account ID: {doctor.accountId}</p>
                                        <p className="text-gray-600 text-sm">Doctor ID: {doctor.doctorId}</p>
                                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                        <p className="text-gray-600">{doctor.email}</p>
                                        <p className="text-gray-600">{doctor.phoneNumber}</p>
                                        <p className="text-gray-600">{doctor.hospitalAddressWork}</p>
                                        <p className="text-gray-600">{doctor.experienceYears} năm kinh nghiệm</p>
                                       
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-400" />
                                    <span className="ml-1 text-gray-600">{doctor.starRating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorManagement;
