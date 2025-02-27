import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Utils/Axios';
import { FaUserMd, FaStar, FaPhone, FaEnvelope, FaHospital, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DetailDoctor = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`Manager/doctors/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctor(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
                setError('Không thể tải thông tin bác sĩ');
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [accountId]);

    // Hàm xử lý xóa bác sĩ
    const handleDelete = async () => {
        try {
            const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?');
            if (!confirmDelete) return;

            const token = localStorage.getItem('token');
            await api.delete(`Manager/doctors/${accountId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Xóa bác sĩ thành công!');
            navigate('/admin/doctors'); // Quay lại trang quản lý
        } catch (error) {
            console.error('Lỗi xóa bác sĩ:', error);
            toast.error(error.response?.data?.message || 'Xóa thất bại');
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
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Chi tiết bác sĩ</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Quay lại
                    </button>
                </div>

                <div className="flex items-start space-x-6">
                    <img
                        src={doctor.imageUrl || '/Images/doctor.png'}
                        alt={doctor.fullName}
                        className="w-32 h-32 rounded-full object-cover"
                        onError={(e) => e.target.src = '/Images/doctor.png'}
                    />
                    <div className="space-y-2">
                        <p className="text-xl text-black font-semibold">{doctor.firstName} {doctor.lastName}</p>
                        <p className="text-sm text-gray-500">Doctor ID: {doctor.doctorId}</p>
                        <p className="text-sm text-gray-500">Account ID: {doctor.accountId}</p>
                        <p className="text-blue-600"><FaBriefcase className="inline mr-2" />{doctor.specialization}</p>
                        <p className="text-gray-600"><FaEnvelope className="inline mr-2" />{doctor.email}</p>
                        <p className="text-gray-600"><FaPhone className="inline mr-2" />{doctor.phoneNumber}</p>
                        <p className="text-gray-600"><FaHospital className="inline mr-2" />{doctor.hospitalAddressWork}</p>
                        <p className="text-gray-600">Kinh nghiệm: {doctor.experienceYears} năm</p>
                        <p className="text-gray-600"><FaStar className="inline mr-2 text-yellow-400" />{doctor.starRating}</p>
                    </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                    <button
                        onClick={() => navigate(`/admin/doctors/edit/${accountId}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Chỉnh sửa
                    </button>
                    
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Xóa bác sĩ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailDoctor;
