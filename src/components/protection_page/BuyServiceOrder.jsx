import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import api from '../Utils/Axios';
import { Link } from 'react-router-dom';

const BuyServiceOrder = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/service/list-service');
                setServices(response.data);
            } catch (error) {
                console.error('Lỗi tải dịch vụ:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 text-black">
                <h1 className="text-2xl font-bold mb-6">Chọn gói dịch vụ</h1>
                
                {loading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <div 
                                key={service.serviceId}
                                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                                    {service.serviceName}
                                </h3>
                                <p className="text-gray-600 mb-4">{service.serviceDescription}</p>
                                
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium">Giá:</span> 
                                        {new Intl.NumberFormat('vi-VN', { 
                                            style: 'currency', 
                                            currency: 'VND' 
                                        }).format(service.servicePrice)}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Thời hạn:</span> 
                                        {service.serviceDuration} ngày
                                    </p>
                                </div>
                                
                                <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                                    Đăng ký ngay
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BuyServiceOrder;
