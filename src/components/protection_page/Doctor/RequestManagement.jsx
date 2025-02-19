import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { DoctorLayout } from '../../layouts/DoctorLayout';

export const RequestManagement = () => {
    const requests = [
        {
            id: 1,
            patientName: "Alice Doe",
            age: "10 years",
            date: "2024-03-20",
            status: "Pending",
            problem: "Skin rash and itching",
            urgency: "Medium"
        },
        // ... thêm requests khác
    ];

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Quản lý yêu cầu tư vấn</h2>
                    <div className="relative">
                        <FaBell className="text-2xl text-gray-600" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuổi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày yêu cầu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vấn đề</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.problem}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/consultation-detail`}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Xem chi tiết
                                        </Link>
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