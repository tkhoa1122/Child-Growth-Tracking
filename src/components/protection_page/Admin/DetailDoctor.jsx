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
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        experienceYears: '',
        hospitalAddressWork: '',
        imageUrl: ''
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                console.log('Bắt đầu lấy dữ liệu bác sĩ...');
                const token = localStorage.getItem('token');
                const response = await api.get(`Manager/doctors/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Dữ liệu nhận được:', response.data);
                setDoctor(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    specialization: response.data.specialization,
                    experienceYears: response.data.experienceYears,
                    hospitalAddressWork: response.data.hospitalAddressWork,
                    imageUrl: response.data.imageUrl
                });
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu:', err);
                toast.error('Không thể tải thông tin bác sĩ');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [accountId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Bắt đầu cập nhật dữ liệu...');
            const token = localStorage.getItem('token');
            const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (!phoneRegex.test(formData.phoneNumber)) {
                toast.error('Số điện thoại không hợp lệ');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Email không hợp lệ');
                return;
            }
            const payload = {
                ...formData,
                doctorId: doctor.doctorId,
                accountId: doctor.accountId,
                experienceYears: Number(formData.experienceYears),
                starRating: doctor.starRating,
                fullName: `${formData.firstName} ${formData.lastName}`
            };

            console.log('Dữ liệu gửi đi:', payload);
            
            const response = await api.put(`Manager/doctors/${accountId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Phản hồi từ server:', response.data);
            
            setDoctor(prev => ({
                ...prev,
                ...response.data,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                specialization: formData.specialization,
                experienceYears: formData.experienceYears,
                hospitalAddressWork: formData.hospitalAddressWork,
                imageUrl: formData.imageUrl
            }));

            setIsEditing(false);
            toast.success('Cập nhật thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            console.error('Chi tiết lỗi:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        }
    };

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

    if (doctor === null) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>Không thể tải thông tin bác sĩ</p>
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
            <div className="bg-white rounded-lg shadow-md p-6">
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

                {!isEditing ? (
                    <div className="mt-6 flex gap-4 justify-end">
                        <button
                            onClick={() => setIsEditing(true)}
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
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Năm kinh nghiệm</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Bệnh viện công tác</label>
                                <input
                                    type="text"
                                    name="hospitalAddressWork"
                                    value={formData.hospitalAddressWork}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">URL ảnh đại diện</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DetailDoctor;
