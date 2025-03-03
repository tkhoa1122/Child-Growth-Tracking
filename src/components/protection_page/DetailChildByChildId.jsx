import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';

const DetailChildByChildId = () => {
    const { childId, parentId } = useParams();
    const [childData, setChildData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildData = async () => {
            try {
                const response = await api.get(`/Parent/${childId}/parent/${parentId}`);
                setChildData(response.data);
            } catch (error) {
                console.error('Lỗi tải thông tin trẻ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChildData();
    }, [childId, parentId]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 text-black">
                <h1 className="text-2xl font-bold mb-6">Thông tin chi tiết trẻ</h1>
                
                {loading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : childData ? (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-center">
                                <img
                                    src={(childData.gender === 'Female' 
                                        ? '/Images/girl.png' 
                                        : '/Images/boy.png')}
                                    alt="Child"
                                    className="w-48 h-48 rounded-full object-cover mb-4"
                                    onError={(e) => {
                                        e.target.src = '/Images/default-child.png';
                                    }}
                                />
                                <h2 className="text-xl font-semibold">
                                    {childData.lastName} {childData.firstName}
                                </h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">Mã trẻ:</p>
                                    <p className="text-gray-600">{childData.childId}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Giới tính:</p>
                                    <p className="text-gray-600">{childData.gender}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Ngày sinh:</p>
                                    <p className="text-gray-600">
                                        {new Date(childData.dob).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Mã phụ huynh:</p>
                                    <p className="text-gray-600">{childData.parentId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Không tìm thấy thông tin trẻ</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default DetailChildByChildId;
