export const About = () => {
    const teamMembers = [
        {
            name: "TS. Nguyễn Văn A",
            role: "Trưởng khoa Nhi",
            description: "20 năm kinh nghiệm trong lĩnh vực nhi khoa",
            specialties: ["Nhi khoa tổng quát", "Dinh dưỡng trẻ em", "Tiêm chủng"]
        },
        {
            name: "BS. Trần Thị B",
            role: "Chuyên gia dinh dưỡng",
            description: "15 năm kinh nghiệm về dinh dưỡng trẻ em",
            specialties: ["Dinh dưỡng lâm sàng", "Tư vấn dinh dưỡng", "Phát triển thể chất"]
        },
        {
            name: "ThS. Lê Văn C",
            role: "Chuyên gia tâm lý",
            description: "12 năm kinh nghiệm tâm lý trẻ em",
            specialties: ["Tâm lý trẻ em", "Phát triển nhận thức", "Kỹ năng xã hội"]
        }
    ];

    const achievements = [
        {
            number: "10,000+",
            title: "Trẻ em được tư vấn",
            description: "Đã tư vấn và hỗ trợ cho hơn 10,000 trẻ em và gia đình"
        },
        {
            number: "1,000+",
            title: "Bài viết chuyên môn",
            description: "Xuất bản hơn 1,000 bài viết về sức khỏe trẻ em"
        },
        {
            number: "50+",
            title: "Chuyên gia y tế",
            description: "Đội ngũ chuyên gia giàu kinh nghiệm trong lĩnh vực nhi khoa"
        },
        {
            number: "24/7",
            title: "Hỗ trợ trực tuyến",
            description: "Luôn sẵn sàng hỗ trợ và tư vấn mọi lúc mọi nơi"
        }
    ];

    return (
        <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Về Chúng Tôi
                </h1>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                    Chúng tôi là đội ngũ chuyên gia y tế và chăm sóc sức khỏe hàng đầu, 
                    với sứ mệnh mang đến thông tin và dịch vụ chăm sóc sức khỏe 
                    chất lượng cao cho trẻ em Việt Nam.
                </p>
            </div>

            {/* Core Values Section */}
            <div className="py-16">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">
                    Giá trị cốt lõi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-300">Chuyên môn</h3>
                        <p className="text-gray-300">
                            Đội ngũ chuyên gia với kinh nghiệm lâu năm trong lĩnh vực nhi khoa và chăm sóc sức khỏe trẻ em.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-300">Tận tâm</h3>
                        <p className="text-gray-300">
                            Luôn đặt sức khỏe và lợi ích của trẻ em lên hàng đầu, cam kết mang đến dịch vụ tốt nhất.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-semibold mb-4 text-blue-300">Sáng tạo</h3>
                        <p className="text-gray-300">
                            Không ngừng đổi mới và cập nhật phương pháp chăm sóc sức khỏe hiện đại nhất.
                        </p>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="py-16 bg-gray-900 rounded-2xl">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">
                    Thành tựu của chúng tôi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl font-bold text-blue-400 mb-2">
                                {achievement.number}
                            </div>
                            <div className="text-xl font-semibold text-white mb-2">
                                {achievement.title}
                            </div>
                            <p className="text-gray-400">
                                {achievement.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">
                    Đội ngũ chuyên gia
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                            <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                            <div className="text-blue-400 mb-4">{member.role}</div>
                            <p className="text-gray-300 mb-4">{member.description}</p>
                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-400">Chuyên môn:</div>
                                <ul className="list-disc list-inside text-gray-300">
                                    {member.specialties.map((specialty, idx) => (
                                        <li key={idx}>{specialty}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission Statement */}
            <div className="py-16 text-center">
                <h2 className="text-3xl font-bold text-white mb-8">
                    Sứ mệnh của chúng tôi
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                    Chúng tôi cam kết mang đến những thông tin và dịch vụ chăm sóc sức khỏe 
                    chất lượng cao nhất cho trẻ em Việt Nam, góp phần xây dựng một thế hệ 
                    tương lai khỏe mạnh và hạnh phúc.
                </p>
            </div>
        </div>
    );
};