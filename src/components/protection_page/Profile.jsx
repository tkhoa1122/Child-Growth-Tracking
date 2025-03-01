import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';

const Profile = () => {
    const { accountId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/Parent/by-accountId/${accountId}`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Lỗi tải hồ sơ:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProfile();
    }, [accountId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4 text-black">
            <Header />
            <h1 className="text-2xl font-bold mb-4 text-black">Thông tin hồ sơ</h1>
            
            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-lg shadow p-6 mb-4 text-black">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Thông tin tài khoản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-gray-900">Họ và tên:</p>
                        <p className="text-gray-800">{profileData.account.firstName} {profileData.account.lastName}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Email:</p>
                        <p className="text-gray-800">{profileData.account.email}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Số điện thoại:</p>
                        <p className="text-gray-800">{profileData.account.phoneNumber}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Địa chỉ:</p>
                        <p className="text-gray-800">{profileData.account.address}</p>
                    </div>
                </div>
            </div>

            {/* Thông tin khác */}
            <div className="bg-white rounded-lg shadow p-6 text-black">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Thông tin bổ sung</h2>
                <div className="space-y-2">
                    <p className="text-gray-800">
                        <span className="font-medium text-gray-900">Account ID:</span> {profileData.accountId}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium text-gray-900">Parent ID:</span> {profileData.parentId}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium text-gray-900">Vai trò:</span> {profileData.account.role === 1 ? 'Parent' : 'Khác'}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium text-gray-900">Ngày tạo:</span> {new Date(profileData.account.dateCreateAt).toLocaleDateString()}
                    </p>
                    <div className="pt-4">
                        <h3 className="font-medium text-gray-900 mb-2">Service Orders:</h3>
                        {profileData.serviceOrders ? (
                            <div className="space-y-2">
                                {profileData.serviceOrders.map((order, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                        <p>Order ID: {order.orderId}</p>
                                        <p>Status: {order.status}</p>
                                        <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Không có service orders</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;