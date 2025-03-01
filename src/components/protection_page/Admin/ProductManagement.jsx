import { useState, useEffect } from 'react';
import api from '../../Utils/Axios';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/Product/get-all');
                if (response.status === 200) {
                    setProducts(response.data);
                }
            } catch (err) {
                setError('Không thể tải danh sách sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getProductTypeLabel = (type) => {
        switch(type.toString()) {
            case '0': return 'Thiếu cân';
            case '1': return 'Cân bằng';
            case '2': return 'Thừa cân';
            default: return 'Không xác định';
        }
    };

    if (loading) return <div className="text-center py-8">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Sản phẩm</h1>
            
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên SP</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mô tả</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Giá (VND)</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Độ tuổi</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">An toàn</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đánh giá</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Khuyến nghị</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thương hiệu</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.productListId} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{product.productName}</td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">{product.productDescription}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {new Intl.NumberFormat('vi-VN').format(product.price)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {product.minAge} - {product.maxAge} tuổi
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{product.safetyFeature}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    <div className="flex items-center">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        {product.rating}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{product.recommendedBy}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{product.brand}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        product.isActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.isActive ? 'Hoạt động' : 'Ngừng bán'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        product.productType === '0' ? 'bg-blue-100 text-blue-800' :
                                        product.productType === '1' ? 'bg-green-100 text-green-800' :
                                        'bg-orange-100 text-orange-800'
                                    }`}>
                                        {getProductTypeLabel(product.productType)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
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

export default ProductManagement;
