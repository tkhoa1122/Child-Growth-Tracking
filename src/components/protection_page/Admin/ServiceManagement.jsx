import { useState, useEffect } from 'react';
import api from "../../Utils/Axios";
import { FaEdit, FaStop, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';

export const ServiceManagement = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        serviceName: '',
        servicePrice: '',
        serviceDescription: '',
        serviceDuration: '',
        isActive: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/service/list-service');
            setServices(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Không thể tải danh sách dịch vụ');
            setLoading(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await api.post('/service/create-service', formData);
            setShowAddModal(false);
            setFormData({
                serviceName: '',
                servicePrice: '',
                serviceDescription: '',
                serviceDuration: '',
                isActive: true
            });
            fetchServices();
        } catch (error) {
            console.error('Error adding service:', error);
            setError('Không thể thêm dịch vụ');
        }
    };

    const handleEditService = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/service/update-service/${selectedService.serviceId}`, formData);
            setShowEditModal(false);
            setSelectedService(null);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            setError('Không thể cập nhật dịch vụ');
        }
    };

    const handleSoftRemove = async (serviceId) => {
        if (window.confirm('Bạn có chắc chắn muốn ngưng cung cấp dịch vụ này?')) {
            try {
                await api.put(`/service/soft-remove/${serviceId}`);
                toast.success('Đã ngưng cung cấp dịch vụ thành công');
                fetchServices();
            } catch (error) {
                console.error('Error soft removing service:', error);
                toast.error('Không thể ngưng cung cấp dịch vụ');
            }
        }
    };

    const openEditModal = (service) => {
        setSelectedService(service);
        setFormData({
            serviceName: service.serviceName,
            servicePrice: service.servicePrice,
            serviceDescription: service.serviceDescription,
            serviceDuration: service.serviceDuration,
            isActive: service.isActive
        });
        setShowEditModal(true);
    };

    const handleEdit = (serviceId) => {
        navigate(`/admin/services/edit/${serviceId}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Dịch vụ</h2>
                <button
                    onClick={() => navigate('/admin/services/create')}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Thêm dịch vụ mới
                </button>
            </div>

            {loading ? (
                <div className="text-center py-4">Đang tải...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã dịch vụ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên dịch vụ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá (VNĐ)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời hạn
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service.serviceId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {service.serviceId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {service.serviceName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {service.serviceDescription}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Intl.NumberFormat('vi-VN').format(service.servicePrice)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {service.serviceDuration} ngày
                                        </div>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(service.serviceId)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <FaEdit className="inline-block" /> Sửa
                                        </button>
                                        <button
                                            onClick={() => handleSoftRemove(service.serviceId)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaStop className="inline-block" /> Ngưng cung cấp
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Service Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Thêm dịch vụ mới</h2>
                        <form onSubmit={handleAddService}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                                    <input
                                        type="text"
                                        value={formData.serviceName}
                                        onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Giá dịch vụ</label>
                                    <input
                                        type="number"
                                        value={formData.servicePrice}
                                        onChange={(e) => setFormData({...formData, servicePrice: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thời hạn (ngày)</label>
                                    <input
                                        type="number"
                                        value={formData.serviceDuration}
                                        onChange={(e) => setFormData({...formData, serviceDuration: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea
                                        value={formData.serviceDescription}
                                        onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Hoạt động</label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Service Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa dịch vụ</h2>
                        <form onSubmit={handleEditService}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                                    <input
                                        type="text"
                                        value={formData.serviceName}
                                        onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Giá dịch vụ</label>
                                    <input
                                        type="number"
                                        value={formData.servicePrice}
                                        onChange={(e) => setFormData({...formData, servicePrice: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thời hạn (ngày)</label>
                                    <input
                                        type="number"
                                        value={formData.serviceDuration}
                                        onChange={(e) => setFormData({...formData, serviceDuration: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea
                                        value={formData.serviceDescription}
                                        onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Hoạt động</label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
