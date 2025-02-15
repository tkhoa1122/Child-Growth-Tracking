import { Header } from '../Header';
import { Footer } from '../Footer';
import { FaUsers, FaLightbulb, FaHandshake, FaChartLine, FaCalendar, FaUser, FaArrowRight } from 'react-icons/fa';
const backgroundImageUrl = '/Images/background.jpg';

export const About = () => {
    const teamMembers = [
        {
            name: "TS. Nguyễn Văn A",
            role: "Trưởng khoa Nhi",
            description: "20 năm kinh nghiệm trong lĩnh vực nhi khoa",
            specialties: ["Nhi khoa tổng quát", "Dinh dưỡng trẻ em", "Tiêm chủng"],
            image: "Images/avtfe.jpg"
        },
        {
            name: "BS. Trần Thị B",
            role: "Chuyên gia dinh dưỡng",
            description: "15 năm kinh nghiệm về dinh dưỡng trẻ em",
            specialties: ["Dinh dưỡng lâm sàng", "Tư vấn dinh dưỡng", "Phát triển thể chất"],
            image: "Images/avatar.jpg"
        },
        {
            name: "ThS. Lê Văn C",
            role: "Chuyên gia tâm lý",
            description: "12 năm kinh nghiệm tâm lý trẻ em",
            specialties: ["Tâm lý trẻ em", "Phát triển nhận thức", "Kỹ năng xã hội"],
            image: "Images/avatar.jpg"
        }
    ];

    const milestones = [
        {
            year: "2018",
            title: "Thành lập công ty",
            description: "Khởi đầu với đội ngũ 5 thành viên nhiệt huyết"
        },
        {
            year: "2019",
            title: "Mở rộng dịch vụ",
            description: "Phát triển thêm các dịch vụ mới và tăng trưởng đội ngũ"
        },
        {
            year: "2020",
            title: "Chuyển đổi số",
            description: "Áp dụng công nghệ mới và mở rộng nền tảng trực tuyến"
        },
        {
            year: "2021",
            title: "Phát triển thị trường",
            description: "Mở rộng thị trường và thiết lập các đối tác chiến lược"
        }
    ];

    const healthBlogs = [
        {
            id: 1,
            title: "Hướng dẫn dinh dưỡng toàn diện cho trẻ từ 0-5 tuổi",
            author: "TS. Nguyễn Văn A",
            date: "15/03/2024",
            image: "/Images/blog-nutrition.jpg",
            excerpt: "Tổng hợp những kiến thức cần thiết về dinh dưỡng giúp trẻ phát triển khỏe mạnh trong những năm đầu đời...",
            category: "Dinh dưỡng"
        },
        {
            id: 2,
            title: "Lịch tiêm chủng chuẩn WHO cho trẻ em",
            author: "BS. Trần Thị B",
            date: "10/03/2024",
            image: "/Images/blog-nutrition.jpg",
            excerpt: "Cập nhật lịch tiêm chủng mới nhất theo khuyến cáo của Tổ chức Y tế Thế giới (WHO) và hướng dẫn chi tiết cho phụ huynh...",
            category: "Tiêm chủng"
        },
        {
            id: 3,
            title: "Phát hiện sớm các dấu hiệu tự kỷ ở trẻ",
            author: "ThS. Lê Văn C",
            date: "05/03/2024",
            image: "/Images/blog-nutrition.jpg",
            excerpt: "Những dấu hiệu cần lưu ý để phát hiện sớm tự kỷ ở trẻ và các biện pháp can thiệp kịp thời...",
            category: "Tâm lý"
        },
        {
            id: 4,
            title: "10 cách tăng cường hệ miễn dịch cho trẻ",
            author: "BS. Phạm Thị D",
            date: "01/03/2024",
            image: "/Images/blog-nutrition.jpg",
            excerpt: "Các phương pháp tự nhiên và hiệu quả giúp tăng cường sức đề kháng cho trẻ trong mùa dịch...",
            category: "Sức khỏe"
        },
        {
            id: 5,
            title: "Chăm sóc răng miệng đúng cách cho trẻ em",
            author: "TS. Hoàng Văn E",
            date: "28/02/2024",
            image: "/Images/blog-nutrition.jpg",
            excerpt: "Hướng dẫn chi tiết cách chăm sóc răng miệng cho trẻ từ sơ sinh đến tuổi đi học...",
            category: "Nha khoa"
        },
        {
            id: 6,
            title: "Phát triển vận động cho trẻ từ 1-3 tuổi",
            author: "ThS. Ngô Thị F",
            date: "25/02/2024",
            image: "/Images/blog-nutrition.jpg",
            excerpt: "Các bài tập và hoạt động giúp phát triển kỹ năng vận động thô và tinh cho trẻ...",
            category: "Phát triển"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            {/* Hero Section */}
            <section
                className="relative pt-32 pb-20 px-4"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl text-gray-200 max-w-4xl mx-auto">
                        Chúng tôi là đội ngũ chuyên gia y tế và chăm sóc sức khỏe hàng đầu,
                        với sứ mệnh mang đến thông tin và dịch vụ chăm sóc sức khỏe
                        chất lượng cao cho trẻ em Việt Nam.
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Tầm nhìn</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Trở thành nền tảng y tế trực tuyến hàng đầu Việt Nam,
                                mang đến giải pháp chăm sóc sức khỏe toàn diện và
                                đáng tin cậy cho mọi gia đình.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Sứ mệnh</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao,
                                kết nối người dùng với đội ngũ y bác sĩ chuyên nghiệp,
                                góp phần nâng cao chất lượng cuộc sống cộng đồng.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                        Giá trị cốt lõi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <FaUsers className="w-12 h-12 text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold text-blue-500 mb-4">Tận tâm</h3>
                            <p className="text-gray-600">
                                Luôn đặt lợi ích của khách hàng lên hàng đầu,
                                phục vụ với tinh thần trách nhiệm cao nhất.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <FaLightbulb className="w-12 h-12 text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold text-blue-500 mb-4">Sáng tạo</h3>
                            <p className="text-gray-600">
                                Không ngừng đổi mới, tìm kiếm giải pháp tốt nhất
                                cho khách hàng và đối tác.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <FaHandshake className="w-12 h-12 text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold text-blue-500 mb-4">Hợp tác</h3>
                            <p className="text-gray-600">
                                Xây dựng mối quan hệ bền vững với đối tác,
                                cùng nhau phát triển và thành công.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <FaChartLine className="w-12 h-12 text-blue-500 mb-6" />
                            <h3 className="text-xl font-semibold text-blue-500 mb-4">Phát triển</h3>
                            <p className="text-gray-600">
                                Cam kết phát triển bền vững, mang lại giá trị
                                lâu dài cho cộng đồng.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Health Blog Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        Kiến Thức Y Tế
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                        Tổng hợp những bài viết chuyên sâu về chăm sóc sức khỏe trẻ em
                        từ đội ngũ chuyên gia hàng đầu
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {healthBlogs.map((blog) => (
                            <div key={blog.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative h-48">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-500 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <FaUser className="mr-2" />
                                        <span className="mr-4">{blog.author}</span>
                                        <FaCalendar className="mr-2" />
                                        <span>{blog.date}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        {blog.excerpt}
                                    </p>
                                    <button className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                                        Đọc thêm
                                        <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Xem tất cả bài viết
                            <FaArrowRight className="ml-2" />
                        </button>
                    </div>

                    {/* Team Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                                Đội ngũ chuyên gia
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {teamMembers.map((member, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="mb-6">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-32 h-32 rounded-full mx-auto object-cover"
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-center text-blue-500 mb-2">
                                            {member.name}
                                        </h3>
                                        <div className="text-blue-500 text-center mb-4">
                                            {member.role}
                                        </div>
                                        <p className="text-gray-600 text-center mb-4">
                                            {member.description}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold text-gray-500">
                                                Chuyên môn:
                                            </div>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {member.specialties.map((specialty, idx) => (
                                                    <li key={idx}>{specialty}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Milestones */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
                                Chặng đường phát triển
                            </h2>
                            <div className="space-y-12">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-full md:w-1/4 text-center md:text-right">
                                            <div className="text-3xl font-bold text-blue-500">
                                                {milestone.year}
                                            </div>
                                        </div>
                                        <div className="w-full md:w-3/4">
                                            <h3 className="text-xl font-semibold text-blue-500 mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>



                 
                </div>
            </section>

            <Footer />
        </div>
    );
};