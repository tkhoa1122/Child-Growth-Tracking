import { FaBookMedical, FaHeartbeat, FaAppleAlt } from 'react-icons/fa';

export const BMIBlog = ({ bmiValue }) => {
    // Dữ liệu blog mẫu cho từng vùng BMI
    const bmiBlogs = {
        underweight: {
            range: "BMI < 18.5",
            title: "Hướng Dẫn Tăng Cân Lành Mạnh",
            content: [
                {
                    icon: <FaAppleAlt />,
                    title: "Chế độ dinh dưỡng",
                    description: "Tăng cường protein, carbohydrate và chất béo lành mạnh. Ăn nhiều bữa nhỏ trong ngày.",
                    tips: [
                        "Bổ sung các loại hạt và bơ đậu phộng",
                        "Uống sữa nguyên kem thay vì sữa gầy",
                        "Thêm dầu olive vào các món salad"
                    ]
                },
                {
                    icon: <FaHeartbeat />,
                    title: "Bài tập thể lực",
                    description: "Tập trung vào bài tập sức mạnh để xây dựng cơ bắp.",
                    tips: [
                        "Tập tạ với trọng lượng vừa phải",
                        "Tập 3-4 lần/tuần",
                        "Ưu tiên bài tập compound"
                    ]
                }
            ]
        },
        normal: {
            range: "18.5 ≤ BMI < 25",
            title: "Duy Trì Cân Nặng Khỏe Mạnh",
            content: [
                {
                    icon: <FaAppleAlt />,
                    title: "Chế độ ăn cân bằng",
                    description: "Duy trì chế độ ăn đa dạng, cân bằng các nhóm chất.",
                    tips: [
                        "Ăn đủ rau xanh và trái cây",
                        "Cân đối protein, tinh bột và chất béo",
                        "Uống đủ nước mỗi ngày"
                    ]
                },
                {
                    icon: <FaHeartbeat />,
                    title: "Duy trì vận động",
                    description: "Kết hợp các bài tập cardio và sức mạnh.",
                    tips: [
                        "30 phút vận động mỗi ngày",
                        "Đa dạng bài tập",
                        "Duy trì thói quen đều đặn"
                    ]
                }
            ]
        },
        overweight: {
            range: "25 ≤ BMI < 30",
            title: "Kế Hoạch Giảm Cân An Toàn",
            content: [
                {
                    icon: <FaAppleAlt />,
                    title: "Kiểm soát khẩu phần",
                    description: "Giảm calo nạp vào một cách khoa học và bền vững.",
                    tips: [
                        "Giảm tinh bột tinh chế",
                        "Tăng protein nạc",
                        "Hạn chế đồ ngọt và chất béo"
                    ]
                },
                {
                    icon: <FaHeartbeat />,
                    title: "Tăng cường vận động",
                    description: "Kết hợp cardio và bài tập sức mạnh để đốt mỡ hiệu quả.",
                    tips: [
                        "45-60 phút cardio mỗi ngày",
                        "Tập HIIT 2-3 lần/tuần",
                        "Tăng cường đi bộ hàng ngày"
                    ]
                }
            ]
        },
        obese: {
            range: "BMI ≥ 30",
            title: "Chương Trình Giảm Cân Toàn Diện",
            content: [
                {
                    icon: <FaBookMedical />,
                    title: "Tư vấn chuyên gia",
                    description: "Cần có sự hướng dẫn của bác sĩ và chuyên gia dinh dưỡng.",
                    tips: [
                        "Khám sức khỏe định kỳ",
                        "Theo dõi các chỉ số sức khỏe",
                        "Tuân thủ kế hoạch điều trị"
                    ]
                },
                {
                    icon: <FaHeartbeat />,
                    title: "Luyện tập an toàn",
                    description: "Bắt đầu từ từ với các bài tập nhẹ nhàng.",
                    tips: [
                        "Đi bộ 30 phút mỗi ngày",
                        "Bơi lội hoặc đạp xe",
                        "Tập với HLV cá nhân"
                    ]
                }
            ]
        }
    };

    // Xác định blog phù hợp dựa trên BMI
    const getBlogContent = () => {
        if (bmiValue < 18.5) return bmiBlogs.underweight;
        if (bmiValue < 25) return bmiBlogs.normal;
        if (bmiValue < 30) return bmiBlogs.overweight;
        return bmiBlogs.obese;
    };

    const blogContent = getBlogContent();

    return (
        <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6">
                    <h3 className="text-2xl font-bold text-white">
                        {blogContent.title}
                    </h3>
                    <p className="text-blue-100 mt-2">
                        Phù hợp cho vùng BMI: {blogContent.range}
                    </p>
                </div>

                <div className="p-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        {blogContent.content.map((section, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        {section.icon}
                                    </div>
                                    <h4 className="ml-4 text-xl font-semibold text-gray-900">
                                        {section.title}
                                    </h4>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    {section.description}
                                </p>
                                <ul className="space-y-2">
                                    {section.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                                            <span className="text-gray-700">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 