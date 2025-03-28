import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { FaArrowLeft } from 'react-icons/fa';

const HistoryBuyingOrderByParentId = () => {
    const { parentId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/serviceorder/GetListOrderByParentId/${parentId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Lỗi tải lịch sử đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await api.get(`/user/${parentId}`);
                setUserId(response.data.userId);
            } catch (error) {
                console.error('Lỗi tải thông tin user:', error);
            }
        };

        if (parentId) {
            fetchOrders();
            fetchUserData();
        }
    }, [parentId]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 text-black">
                <div className="flex items-center gap-4 mb-6 pt-20">
                    {/* <Link 
                        to={`/profile/${userId}`}
                        className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Quay lại hồ sơ
                    </Link> */}
                    <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên dịch vụ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày mua</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hết hạn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời hạn (ngày)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.serviceOrderId}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.serviceOrderId.length > 8 ? order.serviceOrderId.slice(0,8) + "..." : order.serviceOrderId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.service?.serviceName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(order.totalPrice)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(order.createDate).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }).split('/').join('-')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(order.endDate).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }).split('/').join('-')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.service?.serviceDuration || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${order.status === 'Completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : order.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <p className="text-gray-600 text-center py-4">Không có đơn hàng nào</p>
                        )}
                    </div>
                )}
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default HistoryBuyingOrderByParentId;
