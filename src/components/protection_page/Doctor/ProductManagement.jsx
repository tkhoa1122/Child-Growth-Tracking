import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
        imageUrl: '/Images/pro1.png',
        brand: '',
        isActive: true,
        productType: ''
    });
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: '',
        timeoutId: null
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        productName: '',
        productType: '',
        minAge: '',
        maxAge: ''
    });

    // Thêm state để quản lý lỗi validation
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('Product/get-all');
            // Lọc các sản phẩm có isActive == true
            const activeProducts = response.data.filter(product => product.isActive === true);
            setProducts(activeProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm validate chung
    const validateProduct = (product) => {
        const newErrors = {};

        if (!product.productName || product.productName.trim() === '') {
            newErrors.productName = 'Vui lòng nhập tên sản phẩm';
        }

        if (!product.productDescription || product.productDescription.trim() === '') {
            newErrors.productDescription = 'Vui lòng nhập mô tả sản phẩm';
        }

        if (!product.price || isNaN(product.price) || product.price <= 0) {
            newErrors.price = 'Giá sản phẩm phải là số dương';
        }

        // Validate minAge (0-18 tuổi)
        if (!product.minAge || isNaN(product.minAge) || product.minAge < 0 || product.minAge > 18) {
            newErrors.minAge = 'Độ tuổi tối thiểu phải từ 0 đến 18';
        }

        // Validate maxAge (0-18 tuổi)
        if (!product.maxAge || isNaN(product.maxAge) || product.maxAge < 0 || product.maxAge > 18) {
            newErrors.maxAge = 'Độ tuổi tối đa phải từ 0 đến 18';
        }

        // Kiểm tra minAge và maxAge hợp lý
        if (product.minAge && product.maxAge && Number(product.minAge) >= Number(product.maxAge)) {
            newErrors.maxAge = 'Độ tuổi tối đa phải lớn hơn độ tuổi tối thiểu';
        }

        if (!product.productType) {
            newErrors.productType = 'Vui lòng chọn loại sản phẩm';
        }

        if (!product.brand || product.brand.trim() === '') {
            newErrors.brand = 'Vui lòng nhập thương hiệu';
        }

        return newErrors;
    };

    // Thêm hàm showNotification
    const showNotification = (message, type) => {
        // Clear timeout cũ nếu có
        if (notification.timeoutId) {
            clearTimeout(notification.timeoutId);
        }

        const timeoutId = setTimeout(() => {
            setNotification({
                show: false,
                message: '',
                type: '',
                timeoutId: null
            });
        }, 5000);

        setNotification({
            show: true,
            message,
            type,
            timeoutId
        });
    };

    const handleAddProduct = async () => {
        const validationErrors = validateProduct(newProduct);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.post('Product/create', newProduct);
            showNotification('Sản phẩm đã được thêm thành công!', 'success');
            setIsModalOpen(false);
            setErrors({});
            
            // Reset newProduct về giá trị mặc định
            setNewProduct({
                productName: '',
                productDescription: '',
                price: 0,
                minAge: '',
                maxAge: '',
                safetyFeature: '',
                rating: 0,
                recommendedBy: '',
                imageUrl: '/Images/pro1.png',
                brand: '',
                isActive: true,
                productType: ''
            });
            
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.', 'error');
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

    // Cập nhật hàm handleUpdateProduct
    const handleUpdateProduct = async () => {
        const validationErrors = validateProduct(selectedProduct);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.put(`Product/update`, selectedProduct);
            showNotification('Cập nhật sản phẩm thành công!', 'success');
            setIsEditModalOpen(false);
            setErrors({});
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification('Đã xảy ra lỗi khi cập nhật sản phẩm.', 'error');
        }
    };

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('accessToken');  // Lấy token nếu cần

        try {
            console.log('Deleting product with ID:', productId);

            await axios.delete('Product/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Bỏ nếu API không yêu cầu token
                },
                data: {
                    productListId: productId   // Đảm bảo đúng key productListId
                }
            });

            showNotification('Xóa sản phẩm thành công!', 'success');

            fetchProducts();  // Load lại danh sách sau khi xóa
        } catch (error) {
            console.error('Error deleting product:', error);

            showNotification(error.response?.data || 'Xóa sản phẩm thất bại. Vui lòng thử lại.', 'error');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredProducts = products.filter(product => {
        const { productName, productType, minAge, maxAge } = filters;

        const matchesName = productName === '' || product.productName.toLowerCase().includes(productName.toLowerCase());

        const matchesType = productType === '' || product.productType === productType;

        const filterMinAge = minAge !== '' ? Number(minAge) : null;
        const filterMaxAge = maxAge !== '' ? Number(maxAge) : null;

        // Lọc theo minAge: minAge của product phải <= minAge lọc
        // Và maxAge của product phải > minAge lọc (vì nếu maxAge <= minAge thì độ tuổi sản phẩm không phù hợp)
        let matchesMinAge = true;
        if (filterMinAge !== null) {
            matchesMinAge = product.minAge <= filterMinAge && product.maxAge > filterMinAge;
        }

        // Lọc theo maxAge: maxAge của product phải >= maxAge lọc (nếu có)
        let matchesMaxAge = true;
        if (filterMaxAge !== null) {
            matchesMaxAge = product.maxAge >= filterMaxAge;
        }

        return matchesName && matchesType && matchesMinAge && matchesMaxAge;
    });

    // Thêm useEffect để clear timeout khi component unmount
    useEffect(() => {
        return () => {
            if (notification.timeoutId) {
                clearTimeout(notification.timeoutId);
            }
        };
    }, []);

    return (
        <DoctorLayout>
            {/* Notification Popup */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    ) : (
                        <FaTimesCircle className="w-6 h-6 text-red-500 mr-2" />
                    )}
                    <span className={`font-medium ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {notification.message}
                    </span>
                </div>
            )}

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

                {/* Bộ lọc */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="productName"
                                value={filters.productName}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                                placeholder="Tìm kiếm theo tên"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Loại sản phẩm</label>
                            <select
                                name="productType"
                                value={filters.productType}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                            >
                                <option value="">Tất cả</option>
                                <option value="Gầy độ III (Rất gầy) - Nguy cơ cao">Gầy độ III (Rất gầy) - Nguy cơ cao</option>
                                <option value="Gầy độ II - Nguy cơ vừa">Gầy độ II - Nguy cơ vừa</option>
                                <option value="Gầy độ I - Nguy cơ thấp">Gầy độ I - Nguy cơ thấp</option>
                                <option value="Cân nặng bình thường - Bình thường">Cân nặng bình thường - Bình thường</option>
                                <option value="Thừa cân - Nguy cơ tăng nhẹ">Thừa cân - Nguy cơ tăng nhẹ</option>
                                <option value="Béo phì độ I - Nguy cơ trung bình">Béo phì độ I - Nguy cơ trung bình</option>
                                <option value="Béo phì độ II - Nguy cơ cao">Béo phì độ II - Nguy cơ cao</option>
                                <option value="Béo phì độ III - Nguy cơ rất cao">Béo phì độ III - Nguy cơ rất cao</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Độ tuổi tối thiểu</label>
                            <input
                                type="number"
                                name="minAge"
                                value={filters.minAge}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                                placeholder="Từ tuổi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Độ tuổi tối đa</label>
                            <input
                                type="number"
                                name="maxAge"
                                value={filters.maxAge}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                                placeholder="Đến tuổi"
                            />
                        </div>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.productListId || index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-200"
                            style={{ height: '440px' }}
                        >
                            {/* Ảnh - đảm bảo hiển thị đầy đủ, không méo, không cắt góc */}
                            <div className="w-full h-[250px] overflow-hidden flex items-center justify-center bg-gray-100">
                                <img
                                    src={product.imageUrl || '/Images/pro2.jpg'}
                                    alt={product.productName}
                                    className="w-full h-full object-contain" // Dùng object-contain thay vì object-cover
                                    onError={(e) => {
                                        e.target.src = '/Images/pro2.jpg'; // Hiển thị ảnh mặc định nếu imageUrl không hợp lệ
                                    }}
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
                                className={`border text-gray-700 border-gray-300 rounded-lg p-3 w-full ${errors.productName ? 'border-red-500' : ''}`}
                            />
                            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
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
                                className={`border text-gray-700 border-gray-300 rounded-lg p-3 w-full ${errors.price ? 'border-red-500' : ''}`}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            <input
                                type="text"
                                name="minAge"
                                placeholder="Độ tuổi tối thiểu"
                                value={newProduct.minAge}
                                onChange={handleInputChange}
                                className={`border text-gray-700 border-gray-300 rounded-lg p-3 w-full ${errors.minAge ? 'border-red-500' : ''}`}
                            />
                            {errors.minAge && <p className="text-red-500 text-sm mt-1">{errors.minAge}</p>}
                            <input
                                type="text"
                                name="maxAge"
                                placeholder="Độ tuổi tối đa"
                                value={newProduct.maxAge}
                                onChange={handleInputChange}
                                className={`border text-gray-700 border-gray-300 rounded-lg p-3 w-full ${errors.maxAge ? 'border-red-500' : ''}`}
                            />
                            {errors.maxAge && <p className="text-red-500 text-sm mt-1">{errors.maxAge}</p>}
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
                                <option value="Gầy độ III (Rất gầy) - Nguy cơ cao">Gầy độ III (Rất gầy) - Nguy cơ cao</option>
                                <option value="Gầy độ II - Nguy cơ vừa">Gầy độ II - Nguy cơ vừa</option>
                                <option value="Gầy độ I - Nguy cơ thấp">Gầy độ I - Nguy cơ thấp</option>
                                <option value="Cân nặng bình thường - Bình thường">Cân nặng bình thường - Bình thường</option>
                                <option value="Thừa cân - Nguy cơ tăng nhẹ">Thừa cân - Nguy cơ tăng nhẹ</option>
                                <option value="Béo phì độ I - Nguy cơ trung bình">Béo phì độ I - Nguy cơ trung bình</option>
                                <option value="Béo phì độ II - Nguy cơ cao">Béo phì độ II - Nguy cơ cao</option>
                                <option value="Béo phì độ III - Nguy cơ rất cao">Béo phì độ III - Nguy cơ rất cao</option>
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
                                            className={`border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm ${errors.productName ? 'border-red-500' : ''}`}
                                        />
                                        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
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
                                            className={`border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm ${errors.price ? 'border-red-500' : ''}`}
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
                                            <option value="Gầy độ III (Rất gầy) - Nguy cơ cao">Gầy độ III (Rất gầy) - Nguy cơ cao</option>
                                            <option value="Gầy độ II - Nguy cơ vừa">Gầy độ II - Nguy cơ vừa</option>
                                            <option value="Gầy độ I - Nguy cơ thấp">Gầy độ I - Nguy cơ thấp</option>
                                            <option value="Cân nặng bình thường - Bình thường">Cân nặng bình thường - Bình thường</option>
                                            <option value="Thừa cân - Nguy cơ tăng nhẹ">Thừa cân - Nguy cơ tăng nhẹ</option>
                                            <option value="Béo phì độ I - Nguy cơ trung bình">Béo phì độ I - Nguy cơ trung bình</option>
                                            <option value="Béo phì độ II - Nguy cơ cao">Béo phì độ II - Nguy cơ cao</option>
                                            <option value="Béo phì độ III - Nguy cơ rất cao">Béo phì độ III - Nguy cơ rất cao</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Độ tuổi tối thiểu</label>
                                        <input
                                            type="text"
                                            name="minAge"
                                            value={selectedProduct.minAge}
                                            onChange={handleEditInputChange}
                                            className={`border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm ${errors.minAge ? 'border-red-500' : ''}`}
                                        />
                                        {errors.minAge && <p className="text-red-500 text-sm mt-1">{errors.minAge}</p>}
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Độ tuổi tối đa</label>
                                        <input
                                            type="text"
                                            name="maxAge"
                                            value={selectedProduct.maxAge}
                                            onChange={handleEditInputChange}
                                            className={`border text-gray-700 border-gray-300 rounded-lg p-1.5 w-full text-sm ${errors.maxAge ? 'border-red-500' : ''}`}
                                        />
                                        {errors.maxAge && <p className="text-red-500 text-sm mt-1">{errors.maxAge}</p>}
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