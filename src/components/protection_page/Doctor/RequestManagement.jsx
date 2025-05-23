import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import axios from '../../Utils/Axios';

export const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState('all'); // Bộ lọc cho trạng thái

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                //lấy doctorId từ localStorage
                const accountId = localStorage.getItem('userId');
                const responseId = await axios.get(`Doctor/${accountId}`);
                const currentDoctorId = responseId.data.doctorId;

                // Lấy danh sách feedback
                const feedbackResponse = await axios.get('feedback/get-list-feedback');
                const relevantFeedbacks = feedbackResponse.data.filter(f => f.doctorId === currentDoctorId);
                const reportIds = relevantFeedbacks.map(f => f.reportId);
                
                // Lấy các yêu cầu đang chờ và đã xử lý
                const pendingResponse = await axios.get('reports/pending');
                const activeResponse = await axios.get('reports/active');

                // Kiểm tra và chuyển đổi dữ liệu nếu cần
                const pendingData = Array.isArray(pendingResponse.data) ? pendingResponse.data : [];
                const activeData = Array.isArray(activeResponse.data) ? activeResponse.data : [];

                // Kết hợp các yêu cầu và lọc theo reportId
                const allRequests = [
                    ...pendingData.filter(request => reportIds.includes(request.reportId)),
                    ...activeData.filter(request => reportIds.includes(request.reportId))
                ];
                console.log(allRequests)
                
                // Lấy thông tin trẻ từ API Parent/child-info/{childId}
                const requestsWithChildInfo = await Promise.all(allRequests.map(async (request) => {
                    const childInfoResponse = await axios.get(`Parent/child-info/${request.childId}`);
                    console.log(childInfoResponse);
                    return {
                        ...request,
                        firstName: childInfoResponse.data.firstName,
                        lastName: childInfoResponse.data.lastName,
                        gender: childInfoResponse.data.gender,
                    };
                }));

                setRequests(requestsWithChildInfo);
                setUnreadCount(requestsWithChildInfo.length);
            } catch (error) {
                console.error('Error fetching requests:', error);
                // Có thể thêm thông báo cho người dùng ở đây
            }
        };

        fetchRequests();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredRequests = requests.filter(request => {
        if (filter === 'all') return true;
        return filter === 'pending' ? request.reportIsActive === "0" : request.reportIsActive === "1";
    });

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Quản lý yêu cầu tư vấn</h2>
                    <div className="relative">
                        <FaBell className="text-2xl text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Bộ lọc trạng thái:</label>
                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        className="border rounded-lg px-4 py-2 text-gray-600"
                    >
                        <option value="all">Tất cả</option>
                        <option value="pending">Chưa xử lý</option>
                        <option value="active">Đã xử lý</option>
                    </select>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chiều cao</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cân nặng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                                        Không có dữ liệu để hiển thị!
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request.reportId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${request.firstName} ${request.lastName}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.height} cm</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.weight} kg</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.bmi.toFixed(1)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                request.reportIsActive === "0" ? 'bg-yellow-100 text-yellow-800' :
                                                request.reportIsActive === "1" ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {request.reportIsActive === "1" ? "Active" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link 
                                                to={`/consultation-detail/${request.childId}?reportId=${request.reportId}`} 
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DoctorLayout>
    );
};