import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';

const Profile = () => {
    const { accountId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [childrenLoading, setChildrenLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile data
                const profileResponse = await api.get(`/Parent/by-accountId/${accountId}`);
                setProfileData(profileResponse.data);

                // Fetch children data
                if (profileResponse.data.parentId) {
                    const childrenResponse = await api.get(`/Parent/parents/${profileResponse.data.parentId}/children`);
                    setChildren(childrenResponse.data);
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            } finally {
                setLoading(false);
                setChildrenLoading(false);
            }
        };

        fetchData();
    }, [accountId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
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

                {/* Section Quản lý trẻ em */}
                <div className="bg-white rounded-lg shadow p-6 mt-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Quản lý trẻ em</h2>
                    
                    {childrenLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : children.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {children.map((child) => (
                                <div key={child.childId} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center justify-center mb-4">
                                    <img 
                                            src={child.gender === 'Female' 
                                                ? '/Images/girl.png' 
                                                : '/Images/boy.png'} 
                                            alt="Child" 
                                            className="h-30 w-30 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/Images/default-child.png';
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-medium text-gray-900">
                                            {child.lastName} {child.firstName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">ID:</span> 
                                            <span className="text-gray-600 ml-1">{child.childId}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Giới tính:</span> 
                                            <span className="text-gray-600 ml-1">{child.gender}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Ngày sinh:</span> 
                                            <span className="text-gray-600 ml-1">
                                                {new Date(child.dob).toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 italic">Chưa có trẻ em nào được đăng ký</p>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Profile;