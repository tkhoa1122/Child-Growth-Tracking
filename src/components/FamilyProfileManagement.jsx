import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Navbar } from './sections/Navbar';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaCamera, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const FamilyProfileManagement = () => {
    // Dữ liệu mẫu
    const defaultProfile = {
        userId: "USR001",
        userName: "johndoe123",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        gender: "Nam",
        email: "john.doe@example.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        avatarUrl: "/Images/avatar.jpg" // Đặt ảnh trong thư mục public/images
    };

    // Dữ liệu mẫu cho danh sách thành viên
    const [familyMembers] = useState([
        {
            id: 1,
            avatarUrl: "/Images/avtfe.jpg",
            firstName: "Alice",
            lastName: "Doe",
            gender: "Nữ",
            dateOfBirth: "2015-05-15"
        },
        {
            id: 2,
            avatarUrl: "/Images/avatar.jpg",
            firstName: "Bob",
            lastName: "Doe",
            gender: "Nam",
            dateOfBirth: "2018-03-20"
        },
        {
            id: 3,
            avatarUrl: "/Images/avtfe.jpg",
            firstName: "Kim",
            lastName: "Doe",
            gender: "Nữ",
            dateOfBirth: "2009-05-16"
        },
        {
            id: 4,
            avatarUrl: "/Images/avatar.jpg",
            firstName: "Henry",
            lastName: "Doe",
            gender: "Nam",
            dateOfBirth: "2017-03-04"
        }
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navbar />
            
            <main className="flex-grow pt-32 pb-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>
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
                                <div className="mt-8 flex justify-end">
                                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                        Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Family Members Section */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Danh sách thành viên gia đình
                                </h2>
                                <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                    <FaPlus className="w-4 h-4 mr-2" />
                                    Thêm thành viên
                                </button>
                            </div>

                            {/* Members List */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thành viên
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Giới tính
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày sinh
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {familyMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            <Link to={`/child-bmi/${member.id}`}>
                                                                <img
                                                                    className="h-12 w-12 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                                                    src={member.avatarUrl}
                                                                    alt={`${member.firstName} ${member.lastName}`}
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {member.firstName} {member.lastName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{member.gender}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{member.dateOfBirth}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <FaEdit className="w-5 h-5" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900">
                                                            <FaTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
