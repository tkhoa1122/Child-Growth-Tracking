import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Navbar } from './sections/Navbar';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaCamera } from 'react-icons/fa';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const DetailFamilyProfile = () => {
    // Dữ liệu mẫu cho thông tin chủ hộ
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

    // Dữ liệu mẫu cho thành viên
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

    // Dữ liệu BMI với biến động
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
        },
        {
            id: 4,
            date: "2024-04-15",
            weight: 29,
            height: 123,
            bmi: 19.2,
            comment: "Thừa cân nhẹ"
        },
        {
            id: 5,
            date: "2024-05-15",
            weight: 33,
            height: 124,
            bmi: 21.5,
            comment: "Béo phì độ I"
        }
    ];

    // Cập nhật màu sắc và style cho comment dựa trên BMI
    const getBmiStatusColor = (bmi) => {
        if (bmi < 13) return 'bg-red-100 text-red-800'; // Suy dinh dưỡng
        if (bmi < 16) return 'bg-orange-100 text-orange-800'; // Thiếu cân
        if (bmi < 18.5) return 'bg-green-100 text-green-800'; // Bình thường
        if (bmi < 20) return 'bg-yellow-100 text-yellow-800'; // Thừa cân nhẹ
        return 'bg-red-100 text-red-800'; // Béo phì
    };

    // Cập nhật màu cho biểu đồ
    const chartData = {
        labels: bmiData.map(data => data.date),
        datasets: [
            {
                label: 'Chỉ số BMI',
                data: bmiData.map(data => data.bmi),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointBackgroundColor: bmiData.map(data => {
                    if (data.bmi < 13) return '#EF4444'; // red
                    if (data.bmi < 16) return '#F97316'; // orange
                    if (data.bmi < 18.5) return '#22C55E'; // green
                    if (data.bmi < 20) return '#EAB308'; // yellow
                    return '#EF4444'; // red
                }),
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 6
            }
        ]
    };

    // Thêm các đường tham chiếu cho biểu đồ
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ theo dõi chỉ số BMI'
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 13,
                        yMax: 13,
                        borderColor: '#EF4444',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            content: 'Suy dinh dưỡng',
                            enabled: true
                        }
                    },
                    line2: {
                        type: 'line',
                        yMin: 16,
                        yMax: 16,
                        borderColor: '#F97316',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            content: 'Thiếu cân',
                            enabled: true
                        }
                    },
                    line3: {
                        type: 'line',
                        yMin: 18.5,
                        yMax: 18.5,
                        borderColor: '#22C55E',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            content: 'Bình thường',
                            enabled: true
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Chỉ số BMI'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Ngày ghi nhận'
                }
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />
            
            <main className="flex-grow pt-32 pb-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section 1: Chủ hộ Profile */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="flex flex-col md:flex-row">
                            {/* Left Side - Avatar Section */}
                            <div className="md:w-1/3 bg-gradient-to-b from-blue-500 to-blue-600 p-8">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img 
                                            src={defaultProfile.avatarUrl} 
                                            alt="Profile" 
                                            className="w-64 h-64 rounded-lg border-4 border-white shadow-lg object-cover"
                                        />
                                        <button className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all">
                                            <FaCamera className="w-5 h-5 text-blue-500" />
                                        </button>
                                    </div>
                                    <h1 className="mt-6 text-3xl font-bold text-white text-center">
                                        {defaultProfile.firstName} {defaultProfile.lastName}
                                    </h1>
                                    <p className="mt-2 text-blue-100">@{defaultProfile.userName}</p>
                                </div>
                            </div>

                            {/* Right Side - Profile Information */}
                            <div className="md:w-2/3 p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin chủ hộ</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* User ID */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaUser className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">User ID</p>
                                            <p className="text-lg font-semibold text-gray-700">{defaultProfile.userId}</p>
                                        </div>
                                    </div>

                                    {/* Username */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaUser className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Username</p>
                                            <p className="text-lg font-semibold text-gray-700">{defaultProfile.userName}</p>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaUser className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                                            <p className="text-lg font-semibold text-gray-700">
                                                {defaultProfile.firstName} {defaultProfile.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaEnvelope className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="text-lg font-semibold text-gray-700">{defaultProfile.email}</p>
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaCalendar className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                                            <p className="text-lg font-semibold text-gray-700">{defaultProfile.dateOfBirth}</p>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaVenusMars className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Giới tính</p>
                                            <p className="text-lg font-semibold text-gray-700">{defaultProfile.gender}</p>
                                        </div>
                                    </div>

                                    {/* Address - Full Width */}
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg md:col-span-2">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                            <FaMapMarkerAlt className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                                            <p className="text-lg font-semibold text-gray-700">{defaultProfile.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <div className="mt-6 flex justify-end">
                                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                        Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Member Detail */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin thành viên</h2>
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                {/* Member Avatar */}
                                <div className="w-full md:w-1/3">
                                    <div className="relative">
                                        <img 
                                            src={memberDetail.avatarUrl} 
                                            alt="Member Profile" 
                                            className="w-full rounded-lg shadow-lg object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Member Information */}
                                <div className="w-full md:w-2/3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Member ID */}
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                                <FaUser className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">Member ID</p>
                                                <p className="text-lg font-semibold text-gray-700">{memberDetail.memberId}</p>
                                            </div>
                                        </div>

                                        {/* Full Name */}
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                                <FaUser className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                                                <p className="text-lg font-semibold text-gray-700">
                                                    {memberDetail.firstName} {memberDetail.lastName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                                <FaVenusMars className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">Giới tính</p>
                                                <p className="text-lg font-semibold text-gray-700">{memberDetail.gender}</p>
                                            </div>
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                                <FaCalendar className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                                                <p className="text-lg font-semibold text-gray-700">{memberDetail.dateOfBirth}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-center p-4 bg-gray-50 rounded-lg md:col-span-2">
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                                                <FaMapMarkerAlt className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                                                <p className="text-lg font-semibold text-gray-700">{memberDetail.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Button */}
                                    <div className="mt-6 flex justify-end">
                                        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                            Chỉnh sửa thông tin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BMI Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-12">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Theo dõi chỉ số BMI
                                </h2>
                                <p className="text-blue-100">
                                    Thông tin theo dõi chỉ số BMI theo thời gian
                                </p>
                            </div>
                            
                            <div className="p-8">
                                {/* BMI Stats Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm text-blue-500 mb-1">Chỉ số BMI hiện tại</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {bmiData[bmiData.length - 1].bmi.toFixed(1)}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-sm text-green-500 mb-1">Cân nặng hiện tại</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {bmiData[bmiData.length - 1].weight} kg
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <p className="text-sm text-purple-500 mb-1">Chiều cao hiện tại</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {bmiData[bmiData.length - 1].height} cm
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <p className="text-sm text-orange-500 mb-1">Đánh giá</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {bmiData[bmiData.length - 1].comment}
                                        </p>
                                    </div>
                                </div>

                                {/* BMI Table */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        STT
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ngày ghi chép
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cân nặng (kg)
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Chiều cao (cm)
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        BMI
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nhận xét
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {bmiData.map((data) => (
                                                    <tr key={data.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {data.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {data.date}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {data.weight}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {data.height}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span className={`px-3 py-1 rounded-full ${getBmiStatusColor(data.bmi)}`}>
                                                                {data.bmi.toFixed(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span className={`px-3 py-1 rounded-full ${getBmiStatusColor(data.bmi)}`}>
                                                                {data.comment}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* BMI Chart */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Biểu đồ theo dõi BMI
                                    </h3>
                                    <div className="h-96">
                                        <Line 
                                            data={chartData} 
                                            options={{
                                                ...chartOptions,
                                                plugins: {
                                                    ...chartOptions.plugins,
                                                    legend: {
                                                        position: 'top',
                                                        labels: {
                                                            font: {
                                                                size: 14
                                                            }
                                                        }
                                                    }
                                                },
                                                elements: {
                                                    line: {
                                                        borderWidth: 3,
                                                        tension: 0.3
                                                    },
                                                    point: {
                                                        radius: 6,
                                                        hoverRadius: 8
                                                    }
                                                }
                                            }} 
                                        />
                                    </div>
                                </div>

                                {/* Add New Record Button */}
                                <div className="mt-8 flex justify-end">
                                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Thêm ghi chép mới
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

