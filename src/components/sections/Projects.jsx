import { Header } from '../Header';
import { Footer } from '../Footer';
import { Navbar } from './Navbar';
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
import { useState } from 'react';
import { BMIBlog } from '../sections/BMIBlog';

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
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [bmiResult, setBmiResult] = useState(null);
    const [currentBMIPoint, setCurrentBMIPoint] = useState(null);

    // Thêm hàm kiểm tra form hợp lệ
    const isFormValid = () => {
        return weight !== '' &&
            height !== '' &&
            age !== '' &&
            Number(weight) > 0 &&
            Number(height) > 0 &&
            Number(age) >= 0 &&
            Number(age) <= 18;
    };

    const calculateBMI = (e) => {
        e.preventDefault(); // Thêm dòng này để ngăn form reload
        if (!isFormValid()) {
            return;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // Cập nhật điểm BMI hiện tại
        setCurrentBMIPoint(parseFloat(bmi.toFixed(1)));

        let category = '';
        let message = '';

        // Phân loại BMI theo tiêu chuẩn quốc tế WHO
        if (bmi < 16) {
            category = 'Gầy độ III';
            message = 'Bạn đang trong tình trạng gầy nghiêm trọng, cần tăng cân và tham khảo ý kiến bác sĩ.';
        } else if (bmi < 17) {
            category = 'Gầy độ II';
            message = 'Bạn đang trong tình trạng gầy vừa, cần có chế độ ăn uống tốt hơn.';
        } else if (bmi < 18.5) {
            category = 'Gầy độ I';
            message = 'Bạn hơi gầy, nên tăng cường dinh dưỡng.';
        } else if (bmi < 25) {
            category = 'Bình thường';
            message = 'Chúc mừng! Bạn có chỉ số BMI bình thường.';
        } else if (bmi < 30) {
            category = 'Thừa cân';
            message = 'Bạn đang thừa cân, nên điều chỉnh chế độ ăn uống và tập thể dục.';
        } else if (bmi < 35) {
            category = 'Béo phì độ I';
            message = 'Bạn đang trong tình trạng béo phì, cần có kế hoạch giảm cân.';
        } else if (bmi < 40) {
            category = 'Béo phì độ II';
            message = 'Bạn đang trong tình trạng béo phì nghiêm trọng, nên tham khảo ý kiến bác sĩ.';
        } else {
            category = 'Béo phì độ III';
            message = 'Bạn đang trong tình trạng béo phì rất nghiêm trọng, cần tham khảo ý kiến bác sĩ ngay.';
        }

        setBmiResult({
            bmi: bmi.toFixed(1),
            category,
            message
        });
    };

    const resetForm = () => {
        setWeight('');
        setHeight('');
        setAge('');
        setGender('male');
        setBmiResult(null);
        setCurrentBMIPoint(null);
    };

    // Data cho biểu đồ BMI theo tuổi (0-18 tuổi) - Nam
    const bmiBoyData = {
        labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
        datasets: [
            {
                label: 'Thấp',
                data: [13, 14.5, 14, 13.5, 13.8, 14, 14.5, 15, 16, 17],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false
            },
            {
                label: 'Bình thường',
                data: [15, 16.5, 16, 15.5, 16, 16.5, 17, 18, 19, 20],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false
            },
            {
                label: 'Cao',
                data: [17, 18.5, 18, 17.5, 18, 19, 20, 21, 22, 23],
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                fill: false
            },
            ...(currentBMIPoint && age ? [{
                label: 'BMI hiện tại',
                data: Array(10).fill(null).map((_, i) => i * 2 === parseInt(age) ? currentBMIPoint : null),
                pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                pointBorderColor: 'rgba(255, 0, 0, 1)',
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false
            }] : [])
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
                fill: false
            },
            {
                label: 'Bình thường',
                data: [15, 16, 15.5, 15, 15.5, 16, 16.5, 17, 17.5, 18],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false
            },
            {
                label: 'Cao',
                data: [17, 18, 17.5, 17, 17.5, 18, 18.5, 19, 19.5, 20],
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                fill: false
            },
            ...(currentBMIPoint && age ? [{
                label: 'BMI hiện tại',
                data: Array(10).fill(null).map((_, i) => i * 2 === parseInt(age) ? currentBMIPoint : null),
                pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                pointBorderColor: 'rgba(255, 0, 0, 1)',
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false
            }] : [])
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
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(1) + ' BMI';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'BMI'
                },
                min: 12,
                max: 24
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
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <Navbar />

            <main className="flex-grow">
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

                {/* BMI Calculator Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Calculator Form */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        Tính Chỉ Số BMI
                                    </h2>
                                    <form onSubmit={calculateBMI} className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Cân nặng (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={weight}
                                                    onChange={(e) => setWeight(e.target.value)}
                                                    className="w-full p-2 border rounded text-gray-700"
                                                    placeholder="Ví dụ: 60"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Chiều cao (cm)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    className="w-full p-2 border rounded text-gray-700"
                                                    placeholder="Ví dụ: 170"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Tuổi
                                                </label>
                                                <input
                                                    type="number"
                                                    value={age}
                                                    onChange={(e) => setAge(e.target.value)}
                                                    className="w-full p-2 border rounded text-gray-700"
                                                    placeholder="Ví dụ: 15"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Giới tính</label>
                                                <select
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    className="w-full p-2 border rounded text-gray-700"
                                                >
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                                            >
                                                Tính BMI
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
                                            >
                                                Làm mới
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* BMI Result and Blog */}
                            <div className="space-y-8">
                                {bmiResult && (
                                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
                                            <h3 className="text-xl font-semibold text-white">
                                                Kết Quả BMI
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="text-center mb-6">
                                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                                    {bmiResult.bmi}
                                                </div>
                                                <div className="text-lg font-medium text-gray-600">
                                                    {bmiResult.category}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-center">
                                                {bmiResult.message}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị BMI Blog khi có kết quả */}
                                {bmiResult && <BMIBlog bmiValue={parseFloat(bmiResult.bmi)} />}
                            </div>
                        </div>
                    </div>
                </section>

                {/* BMI Categories Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                            Phân Loại BMI
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-yellow-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-yellow-700 mb-2">Thiếu cân</h3>
                                <p className="text-yellow-600">BMI {'<'} 18.5</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-green-700 mb-2">Bình thường</h3>
                                <p className="text-green-600">BMI 18.5 - 24.9</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-orange-700 mb-2">Thừa cân</h3>
                                <p className="text-orange-600">BMI 25 - 29.9</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-red-700 mb-2">Béo phì</h3>
                                <p className="text-red-600">BMI ≥ 30</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BMI Chart Section - Luôn hiển thị ở dưới cùng */}
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
                                        <Line options={options} data={gender === 'male' ? bmiBoyData : bmiGirlData} />
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
                                        <Line options={options} data={gender === 'female' ? bmiGirlData : bmiBoyData} />
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