import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Navbar } from './sections/Navbar';
import background from '../../public/Images/background.jpg';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import api from './Utils/Axios';

export const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        searchTerm: '',
        category: 'all',
        ageRange: 'all'
    });

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/Product/get-all');
                console.log('API Response Structure:', response.data); // Debug API structure
                
                // Sửa thành response.data nếu API trả về trực tiếp mảng sản phẩm
                const productData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data?.productList || [];
                
                setProducts(productData);
            } catch (err) {
                console.error('Lỗi API:', err);
                setError('Không thể tải danh sách sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        // Kiểm tra nếu không có thông tin tìm kiếm và không có filter nào được chọn
        if (!filters.searchTerm) {
            // Gọi lại API để tải lại danh sách sản phẩm đầy đủ
            setLoading(true);
            api.get('/Product/get-all')
                .then(response => {
                    const productData = Array.isArray(response.data) 
                        ? response.data 
                        : response.data?.productList || [];
                    setProducts(productData);
                })
                .catch(err => {
                    console.error('Lỗi API:', err);
                    setError('Không thể tải danh sách sản phẩm');
                })
                .finally(() => {
                    setLoading(false);
                });
            return;
        }

        // Thực hiện tìm kiếm sản phẩm nếu có thông tin tìm kiếm
        const filteredProducts = products.filter(product => {
            return product.productName.toLowerCase().includes(filters.searchTerm.toLowerCase());
        });
        setProducts(filteredProducts);
    };

    if (loading) return <div className="text-center py-8">Đang tải sản phẩm...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section 
                    className="relative pt-32 pb-20 px-4"
                    style={{
                        backgroundImage: `url(${background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative z-10 max-w-8xl mx-auto text-center">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            Sản phẩm dinh dưỡng cho trẻ em
                        </h1>
                        <p className="text-xl text-gray-200 max-w-4xl mx-auto">
                            Các sản phẩm dinh dưỡng chất lượng cao, phù hợp với từng độ tuổi và nhu cầu của trẻ
                        </p>
                    </div>
                </section>

                {/* Advanced Filter Section */}
                <section className="py-8 bg-white shadow-md">
                    <div className="max-w-8xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Tìm kiếm sản phẩm</h2>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        name="searchTerm"
                                        value={filters.searchTerm}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            searchTerm: e.target.value
                                        }))}
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                                    />
                                    <FaSearch className="absolute right-3 top-3 text-gray-400" />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Products Section */}
                <section className="py-16">
                    <div className="max-w-8xl mx-auto px-4">
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product, index) => (
                                    <div key={product.productListId} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                        <div className="h-48 bg-gray-200">
                                            <img 
                                                src={`../../public/Images/${product.imageUrl}`}
                                                alt={product.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                {product.productName}
                                            </h3>
                                            
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-2xl font-bold text-red-600">
                                                    {product.price.toLocaleString()}đ
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    product.productType === 'Gầy độ III (Rất gầy) - Nguy cơ cao' ? 'bg-blue-100 text-blue-800' :
                                                    product.productType === 'Gầy độ II - Nguy cơ vừa' ? 'bg-green-100 text-green-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {product.productType}
                                                </span>
                                            </div>

                                            <div className="flex items-center mb-2">
                                                <FaStar className="text-yellow-400" />
                                                <span className="ml-1 text-gray-600">{product.rating}</span>
                                            </div>

                                            <div className="space-y-2 text-sm text-black">
                                                <p><span className="font-medium">Độ tuổi:</span> {product.minAge} - {product.maxAge} tuổi</p>
                                                <p><span className="font-medium">Thương hiệu:</span> {product.brand}</p>
                                                <p><span className="font-medium">Khuyến nghị:</span> {product.recommendedBy}</p>
                                            </div>

                                            <div className="mt-4 border-t pt-4">
                                                <p className="text-gray-600 text-sm">
                                                    {product.productDescription}
                                                </p>
                                            </div>

                                            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Không có sản phẩm nào
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
