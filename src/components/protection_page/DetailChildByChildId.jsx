import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { toast } from 'react-toastify';

const DetailChildByChildId = () => {
    const { childId, parentId } = useParams();
    const [childData, setChildData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serviceStatus, setServiceStatus] = useState({ 
        isValid: false, 
        loading: true 
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch child data
                const childResponse = await api.get(`/Parent/${childId}/parent/${parentId}`);
                setChildData(childResponse.data);

                // Check service rights
                const serviceResponse = await api.get(`/serviceorder/CheckServiceRights/${parentId}`);
                setServiceStatus({
                    isValid: serviceResponse.data.isValid,
                    loading: false
                });
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                toast.error('Lỗi kết nối hệ thống!');
            } finally {
                setLoading(false);
                setServiceStatus(prev => ({ ...prev, loading: false }));
            }
        };

        fetchData();
    }, [childId, parentId]);

    const handleMakeReport = () => {
        if (!serviceStatus.isValid) {
            toast.error('Vui lòng mua dịch vụ để sử dụng tính năng này!');
            return;
        }
        // Thêm logic tạo báo cáo ở đây
        console.log('Tạo báo cáo cho:', childData.childId);
    };

    return (
        <div className="min-h-screen bg-[#F8F3D9]">
            <Header />
            
            <main className="container mx-auto p-4 md:p-6">
                {/* Header Section */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                    Thông tin chi tiết trẻ
                </h1>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : childData ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-48 h-48">
                                    <img
                                        src={(childData.gender === 'Female' 
                                            ? '/Images/girl.png' 
                                            : '/Images/boy.png')}
                                        alt="Child avatar"
                                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                        onError={(e) => {
                                            e.target.src = '/Images/default-child.png';
                                        }}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {childData.lastName} {childData.firstName}
                                </h2>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-4">
                                <InfoRow label="Mã phụ huynh" value={childData.parentId} />
                                <InfoRow label="Mã trẻ" value={childData.childId} />
                                <InfoRow label="Giới tính" value={childData.gender} />
                                <InfoRow 
                                    label="Ngày sinh" 
                                    value={new Date(childData.dob).toLocaleDateString('vi-VN')} 
                                />
                                
                            </div>
                        </div>

                        {/* Report Button Container */}
                        <div className="px-6 pb-6 mt-6 border-t border-gray-100">
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleMakeReport}
                                    disabled={serviceStatus.loading || loading}
                                    className={`px-8 py-3 rounded-lg font-semibold text-sm md:text-base transition-all
                                        ${serviceStatus.isValid 
                                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                                        ${(serviceStatus.loading || loading) ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {serviceStatus.loading || loading 
                                        ? 'Đang kiểm tra...' 
                                        : `Tạo báo cáo (${serviceStatus.isValid ? 'Khả dụng' : 'Vô hiệu'})`}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-red-500 font-medium">Không tìm thấy thông tin trẻ</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

// Helper component
const InfoRow = ({ label, value }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium min-w-[120px]">{label}</span>
        <span className="text-gray-800 break-words max-w-[70%]">{value || '---'}</span>
    </div>
);

export default DetailChildByChildId;
