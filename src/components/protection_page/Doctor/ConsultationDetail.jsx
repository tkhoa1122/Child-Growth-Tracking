import { useState } from 'react';
import { Header } from '../../Header';
import { Footer } from '../../Footer';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaUserCircle } from 'react-icons/fa';
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
import { DoctorLayout } from '../../layouts/DoctorLayout';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const ConsultationDetail = () => {
    const [replyContent, setReplyContent] = useState('');
    
    // Copy data từ DetailFamilyProfile
    const defaultProfile = {
        userId: "USR001",
        userName: "johndoe123",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        gender: "Nam",
        email: "john.doe@example.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        avatarUrl: "/Images/avatar.jpg"
    };

    const memberDetail = {
        memberId: "MEM001",
        avatarUrl: "/Images/avtfe.jpg",
        firstName: "Alice",
        lastName: "Doe",
        gender: "Nữ",
        dateOfBirth: "2015-05-15",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        relationship: "Con gái"
    };

    // Copy BMI data và functions
    const bmiData = [
        {
            id: 1,
            date: "2024-01-15",
            weight: 18,
            height: 120,
            bmi: 12.5,
            comment: "Suy dinh dưỡng"
        },
        {
            id: 2,
            date: "2024-02-15",
            weight: 22,
            height: 121,
            bmi: 15.0,
            comment: "Thiếu cân"
        },
        {
            id: 3,
            date: "2024-03-15",
            weight: 25,
            height: 122,
            bmi: 16.8,
            comment: "Cân nặng bình thường"
        }
    ];

    const getBmiStatusColor = (bmi) => {
        if (bmi < 13) return 'bg-red-100 text-red-800';
        if (bmi < 16) return 'bg-orange-100 text-orange-800';
        if (bmi < 18.5) return 'bg-green-100 text-green-800';
        if (bmi < 20) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const chartData = {
        labels: bmiData.map(data => data.date),
        datasets: [{
            label: 'Chỉ số BMI',
            data: bmiData.map(data => data.bmi),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ theo dõi BMI'
            }
        }
    };

    // Thông tin yêu cầu tư vấn
    const consultationRequest = {
        id: "REQ001",
        date: "2024-03-20",
        subject: "Tư vấn về tình trạng dinh dưỡng",
        content: "Con tôi gần đây có dấu hiệu biếng ăn và không tăng cân. Tôi muốn được tư vấn về chế độ dinh dưỡng phù hợp.",
        status: "Pending",
        urgency: "Medium"
    };

    return (
        <DoctorLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Chi tiết yêu cầu tư vấn
                            </h1>
                            <p className="text-gray-600">Ngày yêu cầu: {consultationRequest.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full ${
                            consultationRequest.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {consultationRequest.status}
                        </span>
                    </div>
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Parent Profile */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin phụ huynh</h2>
                        <div className="flex items-center mb-4">
                            <img src={defaultProfile.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">{`${defaultProfile.firstName} ${defaultProfile.lastName}`}</h3>
                                <p className="text-gray-600">{defaultProfile.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="flex items-center text-gray-600">
                                <FaCalendar className="mr-2" />
                                Ngày sinh: {defaultProfile.dateOfBirth}
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaVenusMars className="mr-2" />
                                Giới tính: {defaultProfile.gender}
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="mr-2" />
                                Địa chỉ: {defaultProfile.address}
                            </p>
                        </div>
                    </div>

                    {/* Child Profile */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin trẻ</h2>
                        <div className="flex items-center mb-4">
                            <img src={memberDetail.avatarUrl} alt="Child" className="w-20 h-20 rounded-full object-cover" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">{`${memberDetail.firstName} ${memberDetail.lastName}`}</h3>
                                <p className="text-gray-600">{memberDetail.relationship}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="flex items-center text-gray-600">
                                <FaCalendar className="mr-2" />
                                Ngày sinh: {memberDetail.dateOfBirth}
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaVenusMars className="mr-2" />
                                Giới tính: {memberDetail.gender}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BMI Chart and History */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử BMI</h2>
                    
                    {/* Latest BMI Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-500 mb-1">BMI Hiện tại</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {bmiData[bmiData.length - 1].bmi.toFixed(1)}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-500 mb-1">Cân nặng (kg)</p>
                            <p className="text-2xl font-bold text-green-600">
                                {bmiData[bmiData.length - 1].weight}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-500 mb-1">Chiều cao (cm)</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {bmiData[bmiData.length - 1].height}
                            </p>
                        </div>
                    </div>

                    {/* BMI Chart */}
                    <div className="h-80 mb-6">
                        <Line data={chartData} options={chartOptions} />
                    </div>

                    {/* BMI History Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cân nặng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chiều cao</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bmiData.map((data) => (
                                    <tr key={data.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.weight} kg</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.height} cm</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.bmi.toFixed(1)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getBmiStatusColor(data.bmi)}`}>
                                                {data.comment}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Consultation Request Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Nội dung yêu cầu tư vấn</h2>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">{consultationRequest.subject}</h3>
                        <p className="text-gray-600">{consultationRequest.content}</p>
                    </div>
                </div>

                {/* Reply Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Phản hồi tư vấn</h2>
                    
                    {/* Formatting Toolbar */}
                    <div className="border-b border-gray-200 pb-2 mb-4">
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded text-black">
                                <strong>B</strong>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded text-black">
                                <i>I</i>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded text-black">
                                <u>U</u>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <select className="border rounded px-2 py-1 text-black bg-white">
                                <option>Normal text</option>
                                <option>Heading 1</option>
                                <option>Heading 2</option>
                            </select>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="mb-4">
                        <textarea
                            className="w-full min-h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                            placeholder="Nhập nội dung tư vấn của bạn..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            style={{ color: 'black' }}
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black">
                            Lưu nháp
                        </button>
                        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Gửi phản hồi
                        </button>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};