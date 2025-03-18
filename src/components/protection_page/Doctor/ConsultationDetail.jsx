import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import axios from '../../Utils/Axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const ConsultationDetail = () => {
    const { childId } = useParams();
    const [parentInfo, setParentInfo] = useState(null);
    const [childInfo, setChildInfo] = useState(null);
    const [bmiReports, setBmiReports] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [doctorFeedback, setDoctorFeedback] = useState('');
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (!childId) {
            console.error("childId is missing in the URL");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Parent Info
                const parentInfoResponse = await axios.get(`Parent/parent-info/${childId}`);
                const parentData = parentInfoResponse.data;

                let parentAccountInfo = null;
                if (parentData?.accountId) {
                    const parentAccountResponse = await axios.get(`Parent/by-accountId/${parentData.accountId}`);
                    parentAccountInfo = parentAccountResponse.data.account;
                }

                // Fetch Child Info
                const childInfoResponse = await axios.get(`Parent/child-info/${childId}`);
                const childData = childInfoResponse.data;
                
                // Fetch BMI Reports - Lấy tất cả report của trẻ
                const bmiReportsResponse = await axios.get(`reports/child/${childId}`);
                const bmiReportsData = Array.isArray(bmiReportsResponse.data) ? bmiReportsResponse.data : [];

                // Cập nhật state
                setParentInfo(parentAccountInfo ? {
                    firstName: parentAccountInfo.firstName,
                    lastName: parentAccountInfo.lastName,
                    email: parentAccountInfo.email,
                    phoneNumber: parentAccountInfo.phoneNumber,
                    address: parentAccountInfo.address,
                    imageUrl: parentAccountInfo.imageUrl
                } : null);

                setChildInfo({
                    firstName: childData.firstName,
                    lastName: childData.lastName,
                    dateOfBirth: childData.dob || childData.dateOfBirth,
                    gender: childData.gender,
                    imageUrl: childData.imageUrl
                });

                // Sắp xếp reports theo thời gian tạo, mới nhất lên đầu
                const sortedReports = bmiReportsData.sort((a, b) => 
                    new Date(b.reportCreateDate) - new Date(a.reportCreateDate)
                );

                setBmiReports(sortedReports.map(report => ({
                    reportCreateDate: report.reportCreateDate,
                    weight: report.weight,
                    height: report.height,
                    bmi: report.bmi,
                    reportMark: report.reportMark,
                    reportIsActive: report.reportIsActive // Thêm trạng thái report
                })));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [childId]);

    // Hàm lấy feedback
    const fetchFeedback = async () => {
        try {
            const response = await axios.get('feedback/get-list-feedback');
            const feedbackData = response.data.find(f => f.report.childId === childId);
            if (feedbackData) {
                // Lấy isResponsed từ report.feedbacks
                const isResponsed = feedbackData.report.feedbacks[0]?.isResponsed || false;
                setFeedback({
                    ...feedbackData,
                    isResponsed: isResponsed
                });
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    // Hàm gửi feedback của bác sĩ
    const handleSubmitFeedback = async () => {
        try {
            if (!doctorFeedback.trim()) {
                setNotification({
                    show: true,
                    message: 'Vui lòng nhập phản hồi',
                    type: 'error'
                });
                return;
            }

            // Cập nhật feedback
            await axios.put(`feedback/update-feedback/${feedback.feedbackId}`, {
                feedbackContentRequest: feedback.feedbackContentRequest,
                feedbackName: feedback.feedbackName,
                feedbackContentResponse: doctorFeedback
            });

            // Cập nhật trạng thái feedback
            await axios.put(`feedback/change-active-feedback/${feedback.feedbackId}`);

            setNotification({
                show: true,
                message: 'Gửi phản hồi thành công!',
                type: 'success'
            });

            // Lấy lại dữ liệu feedback mới nhất
            await fetchFeedback();

            // Lấy lại danh sách BMI Reports để cập nhật UI
            const bmiReportsResponse = await axios.get(`reports/child/${childId}`);
            const bmiReportsData = Array.isArray(bmiReportsResponse.data) ? bmiReportsResponse.data : [];
            const filteredBmiReports = bmiReportsData.filter(report =>
                report.reportIsActive === 'Pending' || report.reportIsActive === 'Active'
            );
            setBmiReports(filteredBmiReports.map(report => ({
                reportCreateDate: report.reportCreateDate,
                weight: report.weight,
                height: report.height,
                bmi: report.bmi,
                reportMark: report.reportMark
            })));
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setNotification({
                show: true,
                message: 'Đã xảy ra lỗi khi gửi phản hồi',
                type: 'error'
            });
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [childId]);

    const getBmiStatusColor = (bmi) => {
        // Gầy độ III (< 16)
        if (bmi < 16) return 'bg-red-100 text-red-800';
        
        // Gầy độ II (16 - 16.99)
        if (bmi < 17) return 'bg-orange-100 text-orange-800';
        
        // Gầy độ I (17 - 18.49)
        if (bmi < 18.5) return 'bg-yellow-100 text-yellow-800';
        
        // Bình thường (18.5 - 24.99)
        if (bmi < 25) return 'bg-green-100 text-green-800';
        
        // Thừa cân (25 - 29.99)
        if (bmi < 30) return 'bg-blue-100 text-blue-800';
        
        // Béo phì độ I (30 - 34.99)
        if (bmi < 35) return 'bg-purple-100 text-purple-800';
        
        // Béo phì độ II (35 - 39.99)
        if (bmi < 40) return 'bg-pink-100 text-pink-800';
        
        // Béo phì độ III (≥ 40)
        return 'bg-red-200 text-red-900';
    };
    
    // Thêm hàm mới để lấy text đánh giá
    const getBmiStatusText = (bmi) => {
        if (bmi < 16) return 'Gầy độ III - Nguy cơ cao';
        if (bmi < 17) return 'Gầy độ II - Nguy cơ vừa';
        if (bmi < 18.5) return 'Gầy độ I - Nguy cơ thấp';
        if (bmi < 25) return 'Cân nặng bình thường';
        if (bmi < 30) return 'Thừa cân - Nguy cơ tăng nhẹ';
        if (bmi < 35) return 'Béo phì độ I - Nguy cơ trung bình';
        if (bmi < 40) return 'Béo phì độ II - Nguy cơ cao';
        return 'Béo phì độ III - Nguy cơ rất cao';
    };

    const filteredBmiReports = bmiReports.filter(report => {
        const reportDate = new Date(report.reportCreateDate);
        return (!startDate || reportDate >= startDate) && (!endDate || reportDate <= endDate);
    });

    const chartData = {
        labels: filteredBmiReports.map(report => new Date(report.reportCreateDate).toLocaleDateString()),
        datasets: [{
            label: 'Chỉ số BMI',
            data: filteredBmiReports.map(report => report.bmi),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Biểu đồ theo dõi BMI' }
        }
    };

    // Thêm hàm format date vào đầu component
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

    return (
        <DoctorLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chi tiết yêu cầu tư vấn</h1>
                            <p className="text-gray-600">
                                Ngày yêu cầu: {bmiReports[0]?.reportCreateDate ? new Date(bmiReports[0].reportCreateDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full ${
                            bmiReports[0]?.reportIsActive === "0" ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {bmiReports[0]?.reportIsActive === "0" ? 'Pending' : 'Active'}
                        </span>
                    </div>
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Parent Profile */}
                    {parentInfo && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin phụ huynh</h2>
                            <div className="flex items-center mb-4">
                                <img src={parentInfo.imageUrl || "/Images/avatar.jpg"} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-black">{`${parentInfo.firstName} ${parentInfo.lastName}`}</h3>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="flex items-center text-gray-600">
                                    <FaMapMarkerAlt className="mr-2 text-green-500" />
                                    Địa chỉ: {parentInfo.address}
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <FaEnvelope className="mr-2 text-blue-500" />
                                    Email: {parentInfo.email}
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <FaPhone className="mr-2 text-blue-500" />
                                    Số điện thoại: {parentInfo.phoneNumber}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Child Profile */}
                    {childInfo && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin trẻ</h2>
                            <div className="flex items-center mb-4">
                                <img src={childInfo.imageUrl} alt="Child" className="w-20 h-20 rounded-full object-cover" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-black">{`${childInfo.firstName} ${childInfo.lastName}`}</h3>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="flex items-center text-gray-600">
                                    <FaCalendar className="mr-2 text-blue-500" />
                                    Ngày sinh: {childInfo.dateOfBirth}
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <FaVenusMars className={`mr-2 ${childInfo.gender === 'Nam' ? 'text-blue-500' : 'text-pink-500'}`} />
                                    Giới tính: {childInfo.gender}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* BMI Chart and History */}
                {bmiReports.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử BMI</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-500 mb-1">BMI Hiện tại</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {bmiReports[bmiReports.length - 1].bmi.toFixed(1)}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-500 mb-1">Cân nặng (kg)</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {bmiReports[bmiReports.length - 1].weight}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-500 mb-1">Chiều cao (cm)</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {bmiReports[bmiReports.length - 1].height}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Bộ lọc theo ngày</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                                    <input
                                        type="date"
                                        value={startDate ? startDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => {
                                            if (!e.target.value) {
                                                setStartDate(null);
                                                return;
                                            }
                                            const newDate = new Date(e.target.value);
                                            if (!isNaN(newDate.getTime())) {
                                                setStartDate(newDate);
                                            }
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                                    <input
                                        type="date"
                                        value={endDate ? endDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => {
                                            if (!e.target.value) {
                                                setEndDate(null);
                                                return;
                                            }
                                            const newDate = new Date(e.target.value);
                                            if (!isNaN(newDate.getTime())) {
                                                setEndDate(newDate);
                                            }
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-96 mb-6">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cân nặng (kg)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chiều cao (cm)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bmiReports.map((report, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDateTime(report.reportCreateDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.weight}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.height}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.bmi ? report.bmi.toFixed(1) : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBmiStatusColor(report.bmi)}`}>
                                                    {getBmiStatusText(report.bmi)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Feedback Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Phản hồi</h2>

                    {feedback ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Phản hồi từ phụ huynh:</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-800">{feedback.feedbackName}</h4>
                                    <p className="text-gray-600 mt-2">{feedback.feedbackContentRequest}</p>
                                </div>
                            </div>

                            {!feedback.isResponsed ? (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phản hồi của bác sĩ:</h3>
                                        <textarea
                                            value={doctorFeedback}
                                            onChange={(e) => setDoctorFeedback(e.target.value)}
                                            className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                            placeholder="Nhập phản hồi của bạn..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmitFeedback}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Gửi phản hồi
                                    </button>
                                </>
                            ) : (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Phản hồi của bác sĩ:</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-gray-600">{feedback.feedbackContentResponse}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-600">Chưa có phản hồi từ phụ huynh</p>
                    )}
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {notification.type === 'success' ? (
                            <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
                        ) : (
                            <FaTimesCircle className="w-6 h-6 text-red-500 mr-2" />
                        )}
                        <span className={`font-medium ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                            {notification.message}
                        </span>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

