import { useEffect, useState } from 'react';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import { FaCalendarAlt, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import axios from '../../Utils/Axios';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState({
        type: 'all', // all, today, week, month
        date: null   // Ngày được chọn từ lịch
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('Appointment');
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFilter(prev => ({ ...prev, date }));
    };

    const filteredAppointments = appointments.filter(appointment => {
        const { type, date } = filter;
        const appointmentDate = new Date(appointment.appointmentDate);

        // Lọc theo loại (all, today, week, month)
        if (type === 'today') {
            const today = new Date();
            if (appointmentDate.toDateString() !== today.toDateString()) {
                return false;
            }
        } else if (type === 'week') {
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(today.setDate(today.getDate() + 6));
            if (appointmentDate < startOfWeek || appointmentDate > endOfWeek) {
                return false;
            }
        } else if (type === 'month') {
            const today = new Date();
            if (appointmentDate.getMonth() !== today.getMonth() || appointmentDate.getFullYear() !== today.getFullYear()) {
                return false;
            }
        }

        // Lọc theo ngày được chọn từ lịch
        if (date && appointmentDate.toDateString() !== new Date(date).toDateString()) {
            return false;
        }

        return true;
    });

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-2xl text-indigo-600" />
                        <h2 className="text-xl font-bold text-gray-800">Quản lý cuộc hẹn</h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                            Thêm cuộc hẹn mới
                        </button>
                        <select className="border rounded-lg px-4 py-2 text-gray-600">
                            <option value="all">Tất cả cuộc hẹn</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hẹn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.appointmentId}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{appointment.childName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-3">
                                            {appointment.status === 'Pending' && (
                                                <>
                                                    <button className="text-green-600 hover:text-green-900">
                                                        <FaCheck />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            <button className="text-blue-600 hover:text-blue-900">
                                                Chi tiết
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default AppointmentManagement;