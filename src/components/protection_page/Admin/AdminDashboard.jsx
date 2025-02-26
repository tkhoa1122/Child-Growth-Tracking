import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../Utils/Axios';

const AdminDashboard = () => {
    const [adminInfo, setAdminInfo] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        exp: null,
        iat: null,
        sub: "",
        jti: "",
        lastLogin: new Date().toLocaleString(),
        status: "Active"
    });

    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [children, setChildren] = useState([]);

    useEffect(() => {
        const fetchUserInfo = () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                const firstName = localStorage.getItem('firstName');
                const lastName = localStorage.getItem('lastName');

                if (token) {
                    const cleanToken = token.replace(/^"|"$/g, '');
                    const decoded = jwtDecode(cleanToken);
                    console.log("Decoded token:", decoded);

                    setAdminInfo({
                        userId: userId || "",
                        firstName: firstName || "",
                        lastName: lastName || "",
                        email: decoded.email || "",
                        role: decoded.role || "",
                        exp: decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : null,
                        iat: decoded.iat ? new Date(decoded.iat * 1000).toLocaleString() : null,
                        sub: decoded.sub || "",
                        jti: decoded.jti || "",
                        lastLogin: new Date().toLocaleString(),
                        status: "Active"
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin từ token:", error);
            }
        };

        const fetchDoctors = async () => {
            try {
                const response = await api.get('Manager/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bác sĩ:", error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await api.get('service/list-service');
                setServices(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            }
        };

        const fetchChildren = async () => {
            try {
                const response = await api.get('Manager/children');
                setChildren(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách trẻ em:", error);
            }
        };

        fetchUserInfo();
        fetchDoctors();
        fetchServices();
        fetchChildren();
    }, []);

    // Format price to VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="bg-gray-100 rounded-lg p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin Admin</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Thông tin cá nhân</h3>
                            <div className="mt-2 space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">ID:</span>{' '}
                                    {adminInfo.userId}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Họ và tên:</span>{' '}
                                    {`${adminInfo.firstName} ${adminInfo.lastName}`}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Email:</span>{' '}
                                    {adminInfo.email}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Vai trò:</span>{' '}
                                    {adminInfo.role}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Trạng thái</h3>
                            <div className="mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    adminInfo.status === 'Active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {adminInfo.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Thông tin Token</h3>
                            <div className="mt-2 space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">Token ID:</span>{' '}
                                    {adminInfo.jti}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Subject:</span>{' '}
                                    {adminInfo.sub}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Thời gian tạo:</span>{' '}
                                    {adminInfo.iat}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Thời gian hết hạn:</span>{' '}
                                    {adminInfo.exp}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Phiên đăng nhập</h3>
                            <div className="mt-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">Đăng nhập lúc:</span>{' '}
                                    {adminInfo.lastLogin}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors Table Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách Bác sĩ</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kinh nghiệm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nơi làm việc</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctors.map((doctor) => (
                                <tr key={doctor.doctorId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img 
                                                    className="h-10 w-10 rounded-full object-cover" 
                                                    src={doctor.imageUrl || '/Images/doctor.png'} 
                                                    alt={doctor.fullName}
                                                    onError={(e) => {
                                                        e.target.src = '/Images/doctor.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.experienceYears} năm</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospitalAddressWork}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.starRating} ⭐</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Services Table Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách Dịch vụ</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời hạn (ngày)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service.serviceId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {service.serviceId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {service.serviceName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatPrice(service.servicePrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {service.serviceDescription}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {service.serviceDuration}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(service.serviceCreateDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            service.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Children Table Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách Trẻ em</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhật</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Phụ huynh</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {children.map((child) => (
                                <tr key={child.childId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img 
                                                    className="h-10 w-10 rounded-full object-cover" 
                                                    src={child.imageUrl || '/Images/boy.png'} 
                                                    alt={`${child.firstName} ${child.lastName}`}
                                                    onError={(e) => {
                                                        e.target.src = '/Images/boy.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {`${child.firstName} ${child.lastName}`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {child.gender}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(child.dob)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(child.dateCreateAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(child.dateUpdateAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {child.parentId}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 