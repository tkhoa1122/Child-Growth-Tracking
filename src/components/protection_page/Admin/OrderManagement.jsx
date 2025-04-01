import { useState, useEffect } from 'react';
import api from '../../Utils/Axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/serviceorder/GetListOrder');
                if (response.status === 200) {
                    setOrders(response.data);
                }
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="text-center py-8">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý đơn mua hàng</h1>
            
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã đơn mua hàng</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Dịch vụ</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số lượng</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đơn giá</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tổng tiền</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày hết hạn</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.serviceOrderId} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{order.serviceOrderId}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {order.service?.serviceName || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{order.quantity}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {new Intl.NumberFormat('vi-VN').format(order.unitPrice)}đ
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {new Intl.NumberFormat('vi-VN').format(order.totalPrice)}đ
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {formatDate(order.createDate)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {formatDate(order.endDate)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        new Date(order.endDate) > new Date()
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {new Date(order.endDate) > new Date() ? 'Đang hoạt động' : 'Hết hạn'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <FaEdit />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
