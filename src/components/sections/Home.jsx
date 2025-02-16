import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useEffect } from 'react';

const childHealth = '/Images/child-health.jpg';

export const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const healthCategories = [
        {
            title: "Khám sức khỏe định kỳ",
            description: "Hướng dẫn chi tiết về lịch khám định kỳ cho trẻ từ 0-15 tuổi",
            details: [
                "Khám tổng quát 3 tháng/lần trong năm đầu",
                "Theo dõi chiều cao, cân nặng định kỳ",
                "Đánh giá phát triển vận động và ngôn ngữ",
                "Kiểm tra thị lực và thính lực hàng năm"
            ]
        },
        {
            title: "Dinh dưỡng và Chế độ ăn",
            description: "Hướng dẫn dinh dưỡng phù hợp cho từng giai đoạn phát triển",
            details: [
                "Chế độ ăn dặm khoa học cho trẻ 6-12 tháng",
                "Thực đơn cân bằng cho trẻ mầm non",
                "Bổ sung vitamin và khoáng chất",
                "Phòng chống thừa cân và suy dinh dưỡng"
            ]
        },
        {
            title: "Vận động và Phát triển",
            description: "Các hoạt động thể chất phù hợp với từng độ tuổi",
            details: [
                "Bài tập vận động cho trẻ sơ sinh",
                "Hoạt động thể chất cho trẻ mầm non",
                "Các môn thể thao phù hợp theo độ tuổi",
                "Kỹ năng vận động tinh và thô"
            ]
        }
    ];

    const developmentStages = [
        {
            age: "0-12 tháng",
            milestones: [
                "Phát triển thị giác và thính giác",
                "Học cách lẫy và bò",
                "Bắt đầu tập đứng và đi",
                "Phát triển ngôn ngữ cơ bản"
            ]
        },
        {
            age: "1-3 tuổi",
            milestones: [
                "Phát triển vận động thô",
                "Học nói và giao tiếp",
                "Phát triển kỹ năng xã hội",
                "Học cách kiểm soát cảm xúc"
            ]
        },
        {
            age: "3-6 tuổi",
            milestones: [
                "Phát triển tư duy logic",
                "Hoàn thiện kỹ năng vận động",
                "Phát triển khả năng sáng tạo",
                "Học cách làm việc nhóm"
            ]
        },
        {
            age: "6-12 tuổi",
            milestones: [
                "Phát triển trí tuệ toàn diện",
                "Hoàn thiện kỹ năng xã hội",
                "Phát triển sở thích cá nhân",
                "Xây dựng tính kỷ luật"
            ]
        }
    ];

    const healthTips = [
        {
            title: "Dinh dưỡng hợp lý",
            tips: [
                "Đảm bảo đủ 4 nhóm chất dinh dưỡng",
                "Ăn đủ 3 bữa chính và 2 bữa phụ",
                "Uống đủ nước mỗi ngày",
                "Hạn chế đồ ăn nhanh và đồ ngọt"
            ]
        },
        {
            title: "Vận động thể chất",
            tips: [
                "Vận động ít nhất 60 phút mỗi ngày",
                "Tham gia các hoạt động ngoài trời",
                "Hạn chế thời gian xem TV và điện thoại",
                "Khuyến khích các trò chơi vận động"
            ]
        },
        {
            title: "Giấc ngủ và nghỉ ngơi",
            tips: [
                "Đảm bảo đủ giờ ngủ theo độ tuổi",
                "Tạo thói quen giờ giấc đều đặn",
                "Môi trường ngủ yên tĩnh, thoáng mát",
                "Tránh các thiết bị điện tử trước khi ngủ"
            ]
        }
    ];

    const emergencyGuide = {
        title: "Hướng dẫn xử lý tình huống khẩn cấp",
        situations: [
            {
                title: "Sốt cao co giật",
                steps: [
                    "Đặt trẻ nằm nghiêng an toàn",
                    "Nới lỏng quần áo",
                    "Không cho bất cứ thứ gì vào miệng",
                    "Gọi cấp cứu ngay lập tức"
                ]
            },
            {
                title: "Hóc dị vật",
                steps: [
                    "Xác định mức độ nghiêm trọng",
                    "Thực hiện thủ thuật Heimlich phù hợp với độ tuổi",
                    "Gọi hỗ trợ y tế nếu cần thiết",
                    "Theo dõi tình trạng hô hấp"
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Header />
            <div></div>
            <Navbar />
            
            {/* Hero Section */}
            <section 
                className="relative h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${childHealth})` }}
            >
                {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8"
                >
                    <div className="text-center max-w-4xl mx-auto bg-gray-800/30 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-200/20">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Chăm sóc sức khỏe trẻ em
                            <span className="text-blue-300"> tương lai của chúng ta</span>
                        </h1>
                        <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                            Cung cấp thông tin và hướng dẫn toàn diện về sức khỏe trẻ em, 
                            giúp các bậc phụ huynh chăm sóc con yêu tốt nhất.
                        </p>
                        <button className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Health Categories Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
            >
                <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
                    Lĩnh vực chăm sóc sức khỏe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {healthCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-blue-900 mb-3">{category.title}</h3>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            <ul className="list-disc list-inside text-gray-600">
                                {category.details.map((detail, idx) => (
                                    <li key={idx} className="mb-2">{detail}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Development Stages Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="bg-blue-50 py-16 px-4 md:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
                        Các giai đoạn phát triển
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {developmentStages.map((stage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl font-semibold text-blue-900 mb-4">{stage.age}</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    {stage.milestones.map((milestone, idx) => (
                                        <li key={idx} className="mb-2">{milestone}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Health Tips Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
            >
                <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
                    Lời khuyên sức khỏe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {healthTips.map((tip, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-blue-900 mb-4">{tip.title}</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {tip.tips.map((item, idx) => (
                                    <li key={idx} className="mb-2">{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Emergency Guide Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="bg-red-50 py-16 px-4 md:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-red-900 mb-12">
                        {emergencyGuide.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {emergencyGuide.situations.map((situation, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500"
                            >
                                <h3 className="text-xl font-semibold text-red-900 mb-4">{situation.title}</h3>
                                <ol className="list-decimal list-inside text-gray-600">
                                    {situation.steps.map((step, idx) => (
                                        <li key={idx} className="mb-2">{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
            >
                <div className="bg-blue-900 text-white rounded-2xl p-12 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Bạn cần tư vấn thêm?
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors">
                        Liên hệ ngay
                    </button>
                </div>
            </motion.section>
            <Footer />
        </div>
    );
};