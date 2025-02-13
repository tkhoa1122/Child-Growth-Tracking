import { Header } from '../Header';
import { Footer } from '../Footer';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { FaChild, FaChartLine, FaHeartbeat, FaBrain } from 'react-icons/fa';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const backgroundImageUrl = '/Images/background.jpg';

export const Projects = () => {
    // Data cho biểu đồ BMI theo tuổi (0-18 tuổi) - Nam
    const bmiBoyData = {
        labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
        datasets: [
            {
                label: 'Thấp',
                data: [13, 14.5, 14, 13.5, 13.8, 14, 14.5, 15, 16, 17],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Bình thường',
                data: [15, 16.5, 16, 15.5, 16, 16.5, 17, 18, 19, 20],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Cao',
                data: [17, 18.5, 18, 17.5, 18, 19, 20, 21, 22, 23],
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
            },
        ],
    };

    // Data cho biểu đồ BMI theo tuổi (0-18 tuổi) - Nữ
    const bmiGirlData = {
        labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
        datasets: [
            {
                label: 'Thấp',
                data: [13, 14, 13.5, 13, 13.5, 14, 14.5, 15, 15.5, 16],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
                label: 'Bình thường',
                data: [15, 16, 15.5, 15, 15.5, 16, 16.5, 17, 17.5, 18],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Cao',
                data: [17, 18, 17.5, 17, 17.5, 18, 18.5, 19, 19.5, 20],
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ BMI theo độ tuổi',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'BMI'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tuổi'
                }
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
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
                        Dự án Sức khỏe Nhi khoa
                    </h1>
                    <p className="text-xl text-gray-200 max-w-4xl mx-auto">
                        Theo dõi và đánh giá sự phát triển của trẻ em từ 0-18 tuổi
                        thông qua các chỉ số sức khỏe quan trọng
                    </p>
                </div>
            </section>

            <main className="flex-grow bg-gray-50 pt-8">
                {/* Projects Grid */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Project 1: BMI Tracker */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <FaChartLine className="text-blue-700 text-3xl mr-4" />
                                        <h3 className="text-2xl text-blue-700 font-bold">BMI Tracker cho bé trai</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        Theo dõi chỉ số BMI cho bé trai từ 0-18 tuổi, 
                                        giúp phát hiện sớm các vấn đề về cân nặng và chiều cao.
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <Line options={options} data={bmiBoyData} />
                                    </div>
                                </div>
                            </div>

                            {/* Project 2: BMI Tracker for Girls */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <FaChartLine className="text-pink-500 text-3xl mr-4" />
                                        <h3 className="text-2xl text-pink-500 font-bold">BMI Tracker cho bé gái</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        Theo dõi chỉ số BMI cho bé gái từ 0-18 tuổi, 
                                        đảm bảo sự phát triển cân đối và khỏe mạnh.
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <Line options={options} data={bmiGirlData} />
                                    </div>
                                </div>
                            </div>

                            {/* Project 3: Dinh dưỡng theo độ tuổi */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <FaHeartbeat className="text-green-500 text-3xl mr-4" />
                                        <h3 className="text-2xl text-green-500 font-bold">Dinh dưỡng theo độ tuổi</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        Hướng dẫn chi tiết về chế độ dinh dưỡng phù hợp cho từng độ tuổi,
                                        giúp trẻ phát triển toàn diện.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Sơ sinh - 12 tháng: Chế độ bú mẹ và ăn dặm</li>
                                        <li>1-3 tuổi: Thực đơn đa dạng, giàu dinh dưỡng</li>
                                        <li>4-10 tuổi: Bữa ăn cân bằng, tăng cường vận động</li>
                                        <li>11-18 tuổi: Dinh dưỡng cho giai đoạn phát triển</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Project 4: Phát triển trí tuệ */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <FaBrain className="text-purple-500 text-3xl mr-4" />
                                        <h3 className="text-2xl text-purple-500 font-bold">Phát triển trí tuệ</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        Theo dõi và hỗ trợ phát triển trí tuệ của trẻ qua các giai đoạn,
                                        kèm theo các hoạt động kích thích phát triển.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>0-2 tuổi: Phát triển giác quan cơ bản</li>
                                        <li>2-6 tuổi: Phát triển ngôn ngữ và tư duy</li>
                                        <li>6-12 tuổi: Kỹ năng học tập và sáng tạo</li>
                                        <li>12-18 tuổi: Tư duy trừu tượng và logic</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}; 