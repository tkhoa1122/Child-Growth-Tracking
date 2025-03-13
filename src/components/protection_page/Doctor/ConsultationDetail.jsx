import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaPhone } from 'react-icons/fa';
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
    const [replyContent, setReplyContent] = useState('');

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
                console.log("Parent Data:", parentData);

                let parentAccountInfo = null;
                if (parentData?.accountId) {
                    const parentAccountResponse = await axios.get(`Parent/by-accountId/${parentData.accountId}`);
                    parentAccountInfo = parentAccountResponse.data.account;
                    console.log("parentAccountInfo:", parentAccountInfo);
                }


                // Fetch Child Info
                const childInfoResponse = await axios.get(`Parent/child-info/${childId}`);
                const childData = childInfoResponse.data;
                console.log("Child Data:", childData);

                // Fetch BMI Reports
                const bmiReportsResponse = await axios.get(`reports/child/${childId}`);
                const bmiReportsData = Array.isArray(bmiReportsResponse.data) ? bmiReportsResponse.data : [];
                console.log(bmiReportsData);
                
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

                setBmiReports(bmiReportsData.map(report => ({
                    reportCreateDate: report.reportCreateDate,
                    weight: report.weight,
                    height: report.height,
                    bmi: report.bmi,
                    reportMark: report.reportMark
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [childId]);

    const getBmiStatusColor = (bmi) => {
        if (bmi < 13) return 'bg-red-100 text-red-800';
        if (bmi < 16) return 'bg-orange-100 text-orange-800';
        if (bmi < 18.5) return 'bg-green-100 text-green-800';
        if (bmi < 20) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const chartData = {
        labels: bmiReports.map(report => report.reportCreateDate),
        datasets: [{
            label: 'Chỉ số BMI',
            data: bmiReports.map(report => report.bmi),
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

    return (
        <DoctorLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chi tiết yêu cầu tư vấn</h1>
                            <p className="text-gray-600">Ngày yêu cầu: {new Date().toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full bg-yellow-100 text-yellow-800`}>
                            Pending
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

                        <div className="h-96 mb-6">
                            <Line data={chartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Biểu đồ chỉ số BMI theo thời gian',
                                    },
                                },
                            }} />
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportCreateDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.weight}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.height}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.bmi ? report.bmi.toFixed(1) : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBmiStatusColor(report.bmi)}`}>
                                                    {report.reportMark}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

