import { DoctorLayout } from '../../layouts/DoctorLayout';
import { FaCalendarAlt, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const AppointmentManagement = () => {
    const appointments = [
        {
            id: 1,
            patientName: "Emma Wilson",
            age: "4 years",
            date: "2024-03-21",
            time: "09:00 AM",
            type: "Khám định kỳ",
            status: "Confirmed",
            notes: "Tái khám sau 2 tuần điều trị",
            phone: "0123456789"
        },
        {
            id: 2,
            patientName: "Lucas Brown",
            age: "7 years",
            date: "2024-03-21",
            time: "10:30 AM",
            type: "Tư vấn dinh dưỡng",
            status: "Pending",
            notes: "Lần đầu khám",
            phone: "0987654321"
        },
        // Thêm các cuộc hẹn khác
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

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
                        <select className="border rounded-lg px-4 py-2">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuổi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày giờ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại khám</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{appointment.patientName}</div>
                                            <div className="text-sm text-gray-500">{appointment.phone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.age}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm text-gray-900">{appointment.date}</div>
                                            <div className="text-sm text-gray-500">{appointment.time}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{appointment.type}</td>
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