import { useState } from 'react';
import { FaWeight, FaRuler } from 'react-icons/fa';
import { Header } from '../Header';
import { Footer } from '../Footer';

export const BMIChecking = () => {
    const [formData, setFormData] = useState({
        weight: '',
        height: ''
    });

    const backgroundImageUrl = '/Images/background.jpg';
    const [bmiResult, setBmiResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateBMI = (e) => {
        e.preventDefault();
        const weight = parseFloat(formData.weight);
        const height = parseFloat(formData.height) / 100; // Chuyển cm sang m
        const bmi = weight / (height * height);

        let suggestion = '';
        let colorClass = '';

        if (bmi < 18.5) {
            suggestion = 'Thiếu cân - Cần tăng cường dinh dưỡng và tập thể dục đều đặn.';
            colorClass = 'text-yellow-600 bg-yellow-50';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            suggestion = 'Cân nặng bình thường - Duy trì chế độ ăn uống và vận động hiện tại.';
            colorClass = 'text-green-600 bg-green-50';
        } else if (bmi >= 25 && bmi < 29.9) {
            suggestion = 'Thừa cân - Cần giảm cân thông qua chế độ ăn uống và tập thể dục.';
            colorClass = 'text-orange-600 bg-orange-50';
        } else {
            suggestion = 'Béo phì - Cần có kế hoạch giảm cân và tham khảo ý kiến bác sĩ.';
            colorClass = 'text-red-600 bg-red-50';
        }

        setBmiResult({
            bmi: bmi.toFixed(1),
            suggestion,
            colorClass
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
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
                            Kiểm Tra Chỉ Số BMI
                        </h1>
                        <p className="text-xl text-gray-200 max-w-4xl mx-auto">
                        Công cụ tính BMI giúp bạn đánh giá tình trạng cân nặng
                        và theo dõi sức khỏe một cách hiệu quả
                        </p>
                    </div>
                </section>

                <section className="bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8">
                                <form onSubmit={calculateBMI} className="space-y-8">
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {/* Weight Input */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cân nặng (kg)
                                            </label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FaWeight className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleChange}
                                                    className="block w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg 
                                                    focus:ring-blue-500 focus:border-blue-500 transition-all
                                                    text-gray-900 placeholder-gray-500 bg-white"
                                                    placeholder="Ví dụ: 60"
                                                    required
                                                    min="1"
                                                    max="300"
                                                />
                                            </div>
                                        </div>

                                        {/* Height Input */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Chiều cao (cm)
                                            </label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FaRuler className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={handleChange}
                                                    className="block w-full pl-12 pr-4 py-3 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all 
                                                    text-gray-900 placeholder-gray-500 bg-white"
                                                    placeholder="Ví dụ: 170"
                                                    required
                                                    min="1"
                                                    max="300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Tính Chỉ Số BMI
                                        </button>
                                    </div>
                                </form>

                                {bmiResult && (
                                    <div className="mt-8">
                                        <div className={`rounded-lg p-6 ${bmiResult.colorClass}`}>
                                            <div className="flex flex-col items-center">
                                                <h3 className="text-2xl font-bold mb-2">
                                                    Chỉ số BMI của bạn: {bmiResult.bmi}
                                                </h3>
                                                <p className="text-center text-lg">
                                                    {bmiResult.suggestion}
                                                </p>
                                            </div>
                                        </div>

                                        {/* BMI Scale */}
                                        <div className="mt-8">
                                            <h4 className="text-lg font-medium text-gray-900 mb-4">
                                                Thang đo BMI
                                            </h4>
                                            <div className="grid grid-cols-4 gap-2 text-sm">
                                                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                                    <div className="font-medium text-yellow-600">Thiếu cân</div>
                                                    <div className="text-yellow-600">&lt; 18.5</div>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                                    <div className="font-medium text-green-600">Bình thường</div>
                                                    <div className="text-green-600">18.5 - 24.9</div>
                                                </div>
                                                <div className="bg-orange-50 p-3 rounded-lg text-center">
                                                    <div className="font-medium text-orange-600">Thừa cân</div>
                                                    <div className="text-orange-600">25 - 29.9</div>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded-lg text-center">
                                                    <div className="font-medium text-red-600">Béo phì</div>
                                                    <div className="text-red-600">&gt; 30</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}; 