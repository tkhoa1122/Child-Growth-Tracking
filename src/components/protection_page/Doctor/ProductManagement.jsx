import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { DoctorLayout } from '../../layouts/DoctorLayout';

export const ProductManagement = () => {
    const products = [
        {
            id: 1,
            name: "Sữa tăng chiều cao Kids Height",
            image: "/Images/pro1.jpg",
            ageRange: "1-3 tuổi",
            category: "Trẻ thiếu dinh dưỡng",
            description: "Sản phẩm giúp bổ sung canxi và vitamin D cho trẻ"
        },
        // ... thêm sản phẩm khác
    ];

    return (
        <DoctorLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h2>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
                        <FaPlus /> Thêm sản phẩm mới
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">Độ tuổi: {product.ageRange}</p>
                                <p className="text-gray-600 text-sm">Phân loại: {product.category}</p>
                                <p className="text-gray-700 mt-2">{product.description}</p>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DoctorLayout>
    );
};