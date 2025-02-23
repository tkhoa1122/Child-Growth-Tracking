import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FaUserShield, FaUsers, FaUserMd, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import DoctorManagement from './DoctorManagement';

const AdminDashboard = ({ activeTab: initialActiveTab = 'dashboard' }) => {
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    const adminInfo = {
        name: "Admin System",
        email: "admin@system.com",
        role: "Super Admin",
        lastLogin: "2024-03-20 15:30",
        status: "Active"
    };

    const statistics = {
        totalUsers: 1250,
        totalDoctors: 45,
        activeAppointments: 128,
        monthlyGrowth: "+15%",
        totalConsultations: 850
    };

    const renderDashboardContent = () => (
        <>
            {/* Admin Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{adminInfo.name}</h2>
                        <p className="text-gray-600">{adminInfo.role}</p>
                        <p className="text-gray-500 text-sm mt-2">Last login: {adminInfo.lastLogin}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                        adminInfo.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {adminInfo.status}
                    </span>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số người dùng</p>
                            <h3 className="text-2xl font-bold text-gray-800">{statistics.totalUsers}</h3>
                        </div>
                        <FaUsers className="text-3xl text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Tổng số bác sĩ</p>
                            <h3 className="text-2xl font-bold text-gray-800">{statistics.totalDoctors}</h3>
                        </div>
                        <FaUserMd className="text-3xl text-green-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Cuộc hẹn đang chờ</p>
                            <h3 className="text-2xl font-bold text-gray-800">{statistics.activeAppointments}</h3>
                        </div>
                        <FaCalendarCheck className="text-3xl text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <FaUserShield className="text-2xl text-blue-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-700">Thêm Admin</span>
                    </button>
                    <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <FaUserMd className="text-2xl text-green-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-700">Thêm Bác sĩ</span>
                    </button>
                    <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        <FaUsers className="text-2xl text-purple-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-700">Quản lý Users</span>
                    </button>
                    <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                        <FaChartLine className="text-2xl text-orange-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-700">Xem báo cáo</span>
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <AdminLayout>
            {/* Tab Navigation */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeTab === 'dashboard' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeTab === 'doctors' 
                                ? 'bg-blue-500 text-white' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Quản lý bác sĩ
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-100 rounded-lg">
                {activeTab === 'doctors' ? (
                    <DoctorManagement />
                ) : (
                    renderDashboardContent()
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard; 