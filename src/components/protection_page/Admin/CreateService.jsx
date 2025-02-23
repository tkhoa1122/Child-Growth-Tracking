import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../Utils/Axios";
import { toast } from 'react-toastify';

export const CreateService = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        serviceName: '',
        servicePrice: '',
        serviceDescription: '',
        serviceDuration: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.serviceName.trim()) {
            newErrors.serviceName = 'Vui lòng nhập tên dịch vụ';
        }

        if (!formData.servicePrice) {
            newErrors.servicePrice = 'Vui lòng nhập giá dịch vụ';
        } else if (isNaN(formData.servicePrice) || formData.servicePrice <= 0) {
            newErrors.servicePrice = 'Giá dịch vụ phải là số dương';
        }

        if (!formData.serviceDuration) {
            newErrors.serviceDuration = 'Vui lòng nhập thời hạn dịch vụ';
        } else if (isNaN(formData.serviceDuration) || formData.serviceDuration <= 0) {
            newErrors.serviceDuration = 'Thời hạn phải là số ngày dương';
        }

        if (!formData.serviceDescription.trim()) {
            newErrors.serviceDescription = 'Vui lòng nhập mô tả dịch vụ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const serviceData = {
                ...formData,
                serviceCreateDate: new Date().toISOString(),
                isActive: true,
                servicePrice: Number(formData.servicePrice),
                serviceDuration: Number(formData.serviceDuration)
            };

            const response = await api.post('/service/create-service', serviceData);
            
            if (response.status === 200) {
                toast.success('Tạo dịch vụ thành công!');
                navigate('/admin/services');
            }
        } catch (error) {
            console.error('Error creating service:', error);
            let errorMessage = 'Đã có lỗi xảy ra khi tạo dịch vụ';
            
            if (error.response) {
                // Xử lý các mã lỗi cụ thể từ server
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Dữ liệu không hợp lệ';
                        break;
                    case 401:
                        errorMessage = 'Không có quyền thực hiện';
                        break;
                    case 409:
                        errorMessage = 'Dịch vụ đã tồn tại';
                        break;
                    default:
                        errorMessage = error.response.data?.message || errorMessage;
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm Dịch Vụ Mới</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên dịch vụ
                    </label>
                    <input
                        type="text"
                        value={formData.serviceName}
                        onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                            errors.serviceName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên dịch vụ"
                    />
                    {errors.serviceName && (
                        <p className="mt-1 text-sm text-red-500">{errors.serviceName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá dịch vụ (VNĐ)
                    </label>
                    <input
                        type="number"
                        value={formData.servicePrice}
                        onChange={(e) => setFormData({...formData, servicePrice: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                            errors.servicePrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập giá dịch vụ"
                    />
                    {errors.servicePrice && (
                        <p className="mt-1 text-sm text-red-500">{errors.servicePrice}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời hạn (ngày)
                    </label>
                    <input
                        type="number"
                        value={formData.serviceDuration}
                        onChange={(e) => setFormData({...formData, serviceDuration: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                            errors.serviceDuration ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập số ngày"
                    />
                    {errors.serviceDuration && (
                        <p className="mt-1 text-sm text-red-500">{errors.serviceDuration}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả dịch vụ
                    </label>
                    <textarea
                        value={formData.serviceDescription}
                        onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
                        rows="4"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                            errors.serviceDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập mô tả dịch vụ"
                    />
                    {errors.serviceDescription && (
                        <p className="mt-1 text-sm text-red-500">{errors.serviceDescription}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/services')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Tạo dịch vụ'}
                    </button>
                </div>
            </form>
        </div>
    );
}; 