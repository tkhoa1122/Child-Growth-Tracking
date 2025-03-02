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
        category: 'all',
        ageRange: 'all',
        searchTerm: '',
        priceRange: 'all'
    });

    const [showFilters, setShowFilters] = useState(false);

    // Các options cho filters
    const ageRanges = [
        { value: 'all', label: 'Tất cả độ tuổi' },
        { value: '1-3', label: '1-3 tuổi' },
        { value: '3-5', label: '3-5 tuổi' },
        { value: '6-12', label: '6-12 tuổi' },
        { value: '13-18', label: '13-18 tuổi' }
    ];

    const categories = [
        { value: 'all', label: 'Tất cả danh mục' },
        { value: '0', label: 'Trẻ thiếu dinh dưỡng' },
        { value: '1', label: 'Bữa ăn cân bằng' },
        { value: '2', label: 'Trẻ thừa cân' }
    ];

    const priceRanges = [
        { value: 'all', label: 'Tất cả giá' },
        { value: 'under-100', label: 'Dưới 100.000đ' },
        { value: '100-200', label: '100.000đ - 200.000đ' },
        { value: '200-500', label: '200.000đ - 500.000đ' },
        { value: 'over-500', label: 'Trên 500.000đ' }
    ];

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

    // Xử lý hiển thị loại sản phẩn
    const getProductTypeLabel = (type) => {
        switch(type.toString()) {
            case '0': return 'Thiếu cân';
            case '1': return 'Cân bằng';
            case '2': return 'Thừa cân';
            default: return 'Không xác định';
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.productName.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesCategory = filters.category === 'all' || product.productType === filters.category;
            
            // Xử lý filter độ tuổi
            let matchesAge = true;
            if (filters.ageRange !== 'all') {
                const [min, max] = filters.ageRange.split('-').map(Number);
                matchesAge = product.minAge <= max && product.maxAge >= min;
            }
            
            return matchesSearch && matchesCategory && matchesAge;
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
                    <div className="relative z-10 max-w-7xl mx-auto text-center">
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
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Tìm kiếm sản phẩm</h2>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                            >
                                <FaFilter />
                                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </button>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        name="searchTerm"
                                        value={filters.searchTerm}
                                        onChange={handleFilterChange}
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

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Danh mục
                                        </label>
                                        <select
                                            name="category"
                                            value={filters.category}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Độ tuổi
                                        </label>
                                        <select
                                            name="ageRange"
                                            value={filters.ageRange}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                                        >
                                            {ageRanges.map(age => (
                                                <option key={age.value} value={age.value}>
                                                    {age.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá
                                        </label>
                                        <select
                                            name="priceRange"
                                            value={filters.priceRange}
                                            onChange={handleFilterChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-black"
                                        >
                                            {priceRanges.map(price => (
                                                <option key={price.value} value={price.value}>
                                                    {price.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </section>

                {/* Products Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product, index) => (
                                    <div key={product.productListId} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                        <div className="h-48 bg-gray-200">
                                            <img 
                                                src={`../../public/Images/pro${(index % 3) + 1}.jpg`}
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
                                                    product.productType === '0' ? 'bg-blue-100 text-blue-800' :
                                                    product.productType === '1' ? 'bg-green-100 text-green-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {getProductTypeLabel(product.productType)}
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
