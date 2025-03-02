import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';

const HistoryBuyingOrderByParentId = () => {
    const { parentId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

        if (parentId) {
            fetchOrders();
        }
    }, [parentId]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 text-black">
                <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
                
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.serviceOrderId}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.serviceOrderId}</td>
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
                                            {new Date(order.createDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(order.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.quantity}
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
