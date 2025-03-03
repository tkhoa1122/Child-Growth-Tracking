import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import axios from '../../Utils/Axios';

export const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        productDescription: '',
        price: 0,
        minAge: '',
        maxAge: '',
        safetyFeature: '',
        rating: 0,
        recommendedBy: '',
        imageUrl: '',
        brand: '',
        isActive: true,
        productType: ''
    });
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('Product/get-all');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async () => {
        try {
            await axios.post('Product/create', newProduct);
            setNotification({
                show: true,
                message: 'Sản phẩm đã được thêm thành công!',
                type: 'success'
            });
            setIsModalOpen(false);
            fetchProducts(); // Cập nhật danh sách sản phẩm
        } catch (error) {
            console.error('Error adding product:', error);
            setNotification({
                show: true,
                message: 'Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.',
                type: 'error'
            });
        }
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct(product);
        console.log(product);
        setIsEditModalOpen(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProduct = async () => {
        try {
            console.log(selectedProduct);
            await axios.put(`Product/update`, selectedProduct);
            setNotification({
                show: true,
                message: 'Cập nhật sản phẩm thành công!',
                type: 'success'
            });
            setIsEditModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            setNotification({
                show: true,
                message: 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
                type: 'error'
            });
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`Product/delete/${productId}`);
            setNotification({
                show: true,
                message: 'Xóa sản phẩm thành công!',
                type: 'success'
            });
            fetchProducts(); // Load lại danh sách sau khi xóa
        } catch (error) {
            console.error('Error deleting product:', error);
            setNotification({
                show: true,
                message: 'Xóa sản phẩm thất bại. Vui lòng thử lại.',
                type: 'error'
            });
        }
    };

    return (
        <DoctorLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                        <FaPlus /> Thêm sản phẩm mới
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={product.productListId || index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-200"
                            style={{ height: '440px' }} // Chiều cao cố định
                        >
                            {/* Ảnh - đảm bảo hiển thị đầy đủ, không méo, không cắt góc */}
                            <div className="w-full h-[250px] overflow-hidden flex items-center justify-center bg-gray-100">
                                <img
                                    src={product.imageUrl}
                                    alt={product.productName}
                                    className="w-full h-full object-contain" // Dùng object-contain thay vì object-cover
                                />
                            </div>

                            {/* Nội dung sản phẩm */}
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    {/* Tên sản phẩm - làm to, nổi bật */}
                                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{product.productName}</h3>

                                    {/* Thông tin sản phẩm */}
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">Phân loại:</span> {product.productType}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">Độ tuổi:</span> {product.minAge} - {product.maxAge} tuổi
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">Thương hiệu:</span> {product.brand}
                                    </p>

                                    {/* Mô tả sản phẩm (giới hạn 3 dòng) */}
                                    <p className="text-gray-700 text-sm line-clamp-3">{product.productDescription}</p>
                                </div>

                                {/* Nút hành động */}
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleOpenEditModal(product)}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteProduct(product.productListId)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for adding new product */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fadeIn flex flex-col">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Thêm sản phẩm mới</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="productName"
                                placeholder="Tên sản phẩm"
                                value={newProduct.productName}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <textarea
                                name="productDescription"
                                placeholder="Mô tả sản phẩm"
                                value={newProduct.productDescription}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Giá"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="text"
                                name="minAge"
                                placeholder="Độ tuổi tối thiểu"
                                value={newProduct.minAge}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="text"
                                name="maxAge"
                                placeholder="Độ tuổi tối đa"
                                value={newProduct.maxAge}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="text"
                                name="safetyFeature"
                                placeholder="Tính năng an toàn"
                                value={newProduct.safetyFeature}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="text"
                                name="recommendedBy"
                                placeholder="Được khuyên dùng bởi"
                                value={newProduct.recommendedBy}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="text"
                                name="imageUrl"
                                placeholder="URL hình ảnh"
                                value={newProduct.imageUrl}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <input
                                type="text"
                                name="brand"
                                placeholder="Thương hiệu"
                                value={newProduct.brand}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            />
                            <select
                                name="productType"
                                value={newProduct.productType}
                                onChange={handleInputChange}
                                className="border text-gray-700 border-gray-300 rounded-lg p-3 w-full"
                            >
                                <option value="">-- Chọn loại sản phẩm --</option>
                                <option value="Underweight">Underweight</option>
                                <option value="Balanced">Balanced</option>
                                <option value="Overweight">Overweight</option>
                            </select>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleAddProduct}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 ml-2"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg animate-fadeIn">
                        <div className="flex gap-6">
                            {/* Cột bên trái cho hình ảnh */}
                            <div className="w-1/3">
                                <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                                    <img
                                        src={selectedProduct.imageUrl || '/placeholder-image.png'}
                                        alt={selectedProduct.productName}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                {/* Input URL hình ảnh */}
                                <div className="mt-2">
                                    <label className="text-xs font-medium text-gray-700">URL hình ảnh</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={selectedProduct.imageUrl}
                                        onChange={handleEditInputChange}
                                        className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                    />
                                </div>
                            </div>

                            {/* Cột bên phải cho form */}
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Cập nhật sản phẩm</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Tên sản phẩm</label>
                                        <input
                                            type="text"
                                            name="productName"
                                            value={selectedProduct.productName}
                                            onChange={handleEditInputChange}
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Mô tả</label>
                                        <textarea
                                            name="productDescription"
                                            value={selectedProduct.productDescription}
                                            onChange={handleEditInputChange}
                                            rows="2"
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Giá</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={selectedProduct.price}
                                            onChange={handleEditInputChange}
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Phân loại</label>
                                        <select
                                            name="productType"
                                            value={selectedProduct.productType}
                                            onChange={handleEditInputChange}
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        >
                                            <option value="">-- Chọn loại sản phẩm --</option>
                                            <option value="Underweight">Underweight</option>
                                            <option value="Balanced">Balanced</option>
                                            <option value="Overweight">Overweight</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Độ tuổi tối thiểu</label>
                                        <input
                                            type="text"
                                            name="minAge"
                                            value={selectedProduct.minAge}
                                            onChange={handleEditInputChange}
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Độ tuổi tối đa</label>
                                        <input
                                            type="text"
                                            name="maxAge"
                                            value={selectedProduct.maxAge}
                                            onChange={handleEditInputChange}
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Thương hiệu</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={selectedProduct.brand}
                                            onChange={handleEditInputChange}
                                            className="border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Nút hành động */}
                                <div className="flex justify-end mt-4 gap-2">
                                    <button
                                        onClick={handleUpdateProduct}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        Lưu thay đổi
                                    </button>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </DoctorLayout>
    );
};