import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import background from '../../public/Images/background.jpg';
import { FaSearch, FaFilter } from 'react-icons/fa';

export const Product = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Sữa tăng chiều cao Kids Height",
            image: "../../public/Images/pro1.jpg", // Thay bằng link ảnh thực
            ageRange: "1-3 tuổi",
            category: "Trẻ thiếu dinh dưỡng",
            description: "Sản phẩm giúp bổ sung canxi và vitamin D cho trẻ"
        },
        {
            id: 2,
            name: "Ngũ cốc dinh dưỡng Baby Care",
            image: "../../public/Images/pro2.jpg",
            ageRange: "2-5 tuổi",
            category: "Bữa ăn cân bằng",
            description: "Bữa sáng dinh dưỡng cho trẻ"
        },
        {
            id: 3,
            name: "Vitamin tổng hợp Junior",
            image: "../../public/Images/pro3.jpg",
            ageRange: "6-12 tuổi",
            category: "Trẻ thiếu dinh dưỡng",
            description: "Bổ sung vitamin và khoáng chất thiết yếu"
        },
        {
            id: 4,
            name: "Bánh gạo lứt Fitness Kids",
            image: "../../public/Images/pro2.jpg",
            ageRange: "3-12 tuổi",
            category: "Trẻ thừa cân",
            description: "Snack lành mạnh ít calo"
        },
        {
            id: 5,
            name: "Sữa hạt dinh dưỡng GrowWell",
            image: "../../public/Images/pro3.jpg",
            ageRange: "1-18 tuổi",
            category: "Bữa ăn cân bằng",
            description: "Thức uống từ các loại hạt tự nhiên"
        },
        {
            id: 6,
            name: "Protein Bar Teen",
            image: "../../public/Images/pro2.jpg",
            ageRange: "12-18 tuổi",
            category: "Trẻ thiếu dinh dưỡng",
            description: "Thanh protein bổ sung dinh dưỡng"
        },
        {
            id: 7,
            name: "Bột rau củ Smart Kids",
            image: "../../public/Images/pro1.jpg",
            ageRange: "1-6 tuổi",
            category: "Bữa ăn cân bằng",
            description: "Bột rau củ tự nhiên cho bé"
        },
        {
            id: 8,
            name: "Sinh tố giảm cân Teen Fit",
            image: "../../public/Images/pro3.jpg",
            ageRange: "12-18 tuổi",
            category: "Trẻ thừa cân",
            description: "Thức uống hỗ trợ kiểm soát cân nặng"
        },
        {
            id: 9,
            name: "DHA Brain Boost",
            image: "../../public/Images/pro2.jpg",
            ageRange: "3-15 tuổi",
            category: "Bữa ăn cân bằng",
            description: "Bổ sung DHA cho phát triển não bộ"
        },
        {
            id: 10,
            name: "Bánh protein ít đường KidsFit",
            image: "../../public/Images/pro1.jpg",
            ageRange: "5-18 tuổi",
            category: "Trẻ thừa cân",
            description: "Bánh ăn nhẹ giàu protein, ít đường"
        },
        {
            id: 11,
            name: "Bánh protein nhiều đường KidsFit",
            image: "../../public/Images/pro2.jpg",
            ageRange: "5-18 tuổi",
            category: "Trẻ thiếu dinh dưỡng",
            description: "Bánh ăn giàu protein, nhiều đường"
        },
        {
            id: 12,
            name: "Bánh protein nhiều đường KidsFit",
            image: "../../public/Images/pro3.jpg",
            ageRange: "5-10 tuổi",
            category: "Trẻ thiếu dinh dưỡng",
            description: "Bánh ăn giàu protein, nhiều đường"
        }
    ]);

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
        { value: '4-6', label: '4-6 tuổi' },
        { value: '7-12', label: '7-12 tuổi' },
        { value: '13-18', label: '13-18 tuổi' }
    ];

    const categories = [
        { value: 'all', label: 'Tất cả danh mục' },
        { value: 'Trẻ thiếu dinh dưỡng', label: 'Trẻ thiếu dinh dưỡng' },
        { value: 'Bữa ăn cân bằng', label: 'Bữa ăn cân bằng' },
        { value: 'Trẻ thừa cân', label: 'Trẻ thừa cân' }
    ];

    const priceRanges = [
        { value: 'all', label: 'Tất cả giá' },
        { value: 'under-100', label: 'Dưới 100.000đ' },
        { value: '100-200', label: '100.000đ - 200.000đ' },
        { value: '200-500', label: '200.000đ - 500.000đ' },
        { value: 'over-500', label: 'Trên 500.000đ' }
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Thực hiện tìm kiếm dựa trên filters
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesCategory = filters.category === 'all' || product.category === filters.category;
            const matchesAge = filters.ageRange === 'all' || product.ageRange.includes(filters.ageRange);
            return matchesSearch && matchesCategory && matchesAge;
        });
        setProducts(filteredProducts);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
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
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                    <div className="h-48 bg-gray-200">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 mb-2">Độ tuổi: {product.ageRange}</p>
                                        <p className="text-gray-600 mb-2">Phân loại: {product.category}</p>
                                        <p className="text-gray-700">{product.description}</p>
                                        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
