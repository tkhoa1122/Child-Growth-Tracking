import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaPlus, FaBell, FaComments } from 'react-icons/fa';
import {OwnHeader} from '../layouts/OwnHeader';
import { Footer } from '../Footer';

export const DoctorLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100">
            <OwnHeader />
            
            <div className="flex pt-16">
                {/* Sidebar Menu */}
                <div className="w-64 bg-indigo-600 min-h-screen p-4 fixed">
                    <div className="space-y-4">
                        <Link
                            to="/doctor-dashboard"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/doctor-dashboard'
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-800'
                            }`}
                        >
                            <FaUserMd />
                            <span>Thông tin cá nhân</span>
                        </Link>
                        <Link
                            to="/doctor-dashboard/products"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/doctor-dashboard/products'
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-800'
                            }`}
                        >
                            <FaPlus />
                            <span>Quản lý sản phẩm</span>
                        </Link>
                        <Link
                            to="/doctor-dashboard/appointments"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/doctor-dashboard/appointments'
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-800'
                            }`}
                        >
                            <FaCalendarAlt />
                            <span>Quản lý cuộc hẹn</span>
                        </Link>
                        <Link
                            to="/doctor-dashboard/requests"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname.includes('/doctor-dashboard/requests') || 
                                location.pathname.includes('/consultation-detail')
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-800'
                            }`}
                        >
                            <FaBell />
                            <span>Quản lý yêu cầu tư vấn</span>
                        </Link>
                        <Link
                            to="/doctor-dashboard/feedback"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/doctor-dashboard/feedback'
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-800'
                            }`}
                        >
                            <FaComments />
                            <span>Quản lý feedback</span>
                        </Link>
                        <Link
                            to="/feedback-from-doctor-to-parent"
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                location.pathname === '/feedback-from-doctor-to-parent'
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-800'
                            }`}
                        >
                            <FaComments />
                            <span>Quản lý các tham vấn</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-64 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}; 