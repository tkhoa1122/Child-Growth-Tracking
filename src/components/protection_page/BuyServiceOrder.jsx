import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import api from '../Utils/Axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomArrow = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-blue-500 
            hover:text-blue-600 rounded-full p-3 shadow-lg transition-all duration-300 
            ${direction === 'left' ? '-left-4' : '-right-4'}`}
    >
        {direction === 'left' ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
    </button>
);

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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <CustomArrow direction="right" />,
        prevArrow: <CustomArrow direction="left" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#80CBC4' }}>
            <Header />
            <div className="container mx-auto p-8 text-black pt-20">
                <h1 className="text-4xl font-bold text-left mb-8">Các Gói Dịch Vụ</h1>
                
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="relative px-8">
                        <Slider {...sliderSettings}>
                            {services.map((service) => (
                                <div key={service.serviceId} className="px-2">
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="relative h-48">
                                            <img
                                                src="/Images/information.png"
                                                alt={service.serviceName}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                                {service.serviceDuration} ngày
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {service.serviceName}
                                            </h3>
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <FaCalendarAlt className="mr-2" />
                                                <span>
                                                    Ngày tạo: {new Date(service.serviceCreateDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-500 mb-4">
                                                {new Intl.NumberFormat('vi-VN', { 
                                                    style: 'currency', 
                                                    currency: 'VND' 
                                                }).format(service.servicePrice)}
                                            </div>
                                            <p className="text-gray-600 mb-6 line-clamp-2">
                                                {service.serviceDescription}
                                            </p>
                                            <button className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors">
                                                Đăng ký ngay
                                                
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BuyServiceOrder;
