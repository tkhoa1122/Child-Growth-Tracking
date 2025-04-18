import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaStar, FaUserMd } from 'react-icons/fa';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Thêm hàm helper để format ngày
const formatDate = (date) => {
    // Nếu chuỗi ngày đã ở định dạng DD-MM-YYYY
    if (typeof date === 'string' && date.includes('-') && !date.includes('T')) {
        const parts = date.split('-');
        if (parts.length === 3) {
            // Kiểm tra xem có phải định dạng hợp lệ không
            if (!isNaN(parseInt(parts[0])) && !isNaN(parseInt(parts[1])) && !isNaN(parseInt(parts[2]))) {
                return `${parts[0]}-${parts[1]}-${parts[2]}`;
            }
        }
    }
    
    // Nếu là chuỗi ISO hoặc đối tượng Date
    try {
        const momentDate = moment(date);
        if (momentDate.isValid()) {
            return momentDate.format('DD-MM-YYYY');
        }
    } catch (error) {
        console.error('Lỗi khi xử lý ngày:', error);
    }
    
    // Nếu không xử lý được, thử chuyển đổi bằng convertToValidDate
    try {
        const validDate = convertToValidDate(date);
        return moment(validDate).format('DD-MM-YYYY');
    } catch (error) {
        console.error('Lỗi khi chuyển đổi ngày:', error, date);
        return 'Ngày không hợp lệ';
    }
};

// Thêm hàm convertToValidDate để xử lý chuyển đổi ngày chính xác
const convertToValidDate = (dateString) => {
    // Nếu là chuỗi ISO hoặc đối tượng Date, sử dụng trực tiếp
    if (dateString instanceof Date || (typeof dateString === 'string' && dateString.includes('T'))) {
        return new Date(dateString);
    }
    
    // Nếu là định dạng DD-MM-YYYY, chuyển đổi sang MM-DD-YYYY cho JavaScript
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            // Chuyển từ DD-MM-YYYY sang MM-DD-YYYY
            return new Date(`${parts[1]}-${parts[0]}-${parts[2]}`);
        }
    }
    
    // Trường hợp khác, sử dụng moment để phân tích
    return moment(dateString).toDate();
};

// Thêm hàm tính tuổi
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Thêm hàm tính tuổi tại thời điểm báo cáo
const calculateAgeAtReport = (dob, reportDate) => {
    const birthDate = new Date(dob);
    const recordDate = new Date(reportDate);
    let age = recordDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = recordDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && recordDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

const DetailChildByChildId = () => {
    const { childId, parentId } = useParams();
    const [childData, setChildData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serviceStatus, setServiceStatus] = useState({ 
        isValid: false, 
        loading: true 
    });
    const [showReportForm, setShowReportForm] = useState(false);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment());
    const [bmi, setBmi] = useState(null);
    const [comment, setComment] = useState('');
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);
    const [showDoctorConsultForm, setShowDoctorConsultForm] = useState(false);
    const [showEditReport, setShowEditReport] = useState(false);
    const [editHeight, setEditHeight] = useState('');
    const [editWeight, setEditWeight] = useState('');
    const [editDate, setEditDate] = useState(moment());
    const [consultationData, setConsultationData] = useState({
        description: '',
        urgency: 'normal',
        preferredDateTime: moment()
    });
    const [products, setProducts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        doctorId: '',
        feedbackName: '',
        feedbackContentRequest: '',
    });
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
    const [reportName, setReportName] = useState("BMI Report");
    const [reportMark, setReportMark] = useState('');
    const [reportContent, setReportContent] = useState('');
    const [reportCreateDate, setReportCreateDate] = useState(new Date().toISOString());
    const [reportIsActive, setReportIsActive] = useState('Active');
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 9;

    // Đặt hàm disabledDate vào trong component để có thể truy cập childData
    const disabledDate = (current) => {
        if (!childData || !current) return false;
        
        try {
            // Chuyển đổi ngày sinh của trẻ thành đối tượng moment
            const birthDate = moment(childData.dob);
            // Tính ngày sinh nhật 1 tuổi
            const oneYearAfterBirth = birthDate.add(1, 'years');
            // Lấy ngày hiện tại
            const today = moment().endOf('day');
            
            // Không cho phép chọn ngày trước khi trẻ đủ 1 tuổi và sau ngày hiện tại
            return current < oneYearAfterBirth || current > today;
        } catch (error) {
            console.error('Lỗi kiểm tra ngày:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch child data
                const childResponse = await api.get(`/Parent/${childId}/parent/${parentId}`);
                setChildData(childResponse.data);

                // Check service rights
                const serviceResponse = await api.get(`/serviceorder/CheckServiceRights/${parentId}`);
                setServiceStatus({
                    isValid: serviceResponse.data.isValid,
                    loading: false
                });
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                toast.error('Lỗi kết nối hệ thống!');
            } finally {
                setLoading(false);
                setServiceStatus(prev => ({ ...prev, loading: false }));
            }
        }

        fetchData();
    }, [childId, parentId]);

    // Tính toán BMI khi thay đổi chiều cao/cân nặng
    useEffect(() => {
        if (height && weight) {
            const heightInMeter = parseFloat(height) / 100;
            const calculatedBmi = parseFloat(weight) / (heightInMeter * heightInMeter);
            setBmi(calculatedBmi.toFixed(2));
            
            // Đưa ra nhận xét
            setComment(getBmiCategory(calculatedBmi));
        }
    }, [height, weight]);

    // Thêm useEffect để fetch reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get(`reports/child/${childId}`);
                if (response.status === 200) {
                    // Hiển thị trực tiếp dữ liệu từ API trả về mà không cần lọc
                    setReports(response.data);
                }
            } catch (error) {
                console.error('Lỗi tải báo cáo:', error);
                toast.error('Không thể tải báo cáo.');
            } finally {
                setReportsLoading(false);
            }
        };

        fetchReports(); // Gọi hàm fetchReports khi component được mount
    }, [childId]);

    // Xử lý dữ liệu cho biểu đồ
    useEffect(() => {
        if (reports.length > 0) {
            console.log('Reports trước khi sắp xếp:', reports.map(r => ({
                id: r.reportId,
                date: r.reportCreateDate,
                type: typeof r.reportCreateDate
            })));
            
            // Sắp xếp báo cáo theo thời gian với hàm chuyển đổi ngày đúng
            const sortedReports = [...reports].sort((a, b) => {
                const dateA = convertToValidDate(a.reportCreateDate);
                const dateB = convertToValidDate(b.reportCreateDate);
                console.log(`So sánh: ${a.reportCreateDate} -> ${dateA} và ${b.reportCreateDate} -> ${dateB}`);
                return dateA - dateB;
            });

            // Xử lý từng ngày trước khi tạo labels
            const labels = sortedReports.map(report => {
                const formattedDate = formatDate(report.reportCreateDate);
                console.log(`Định dạng ngày: ${report.reportCreateDate} -> ${formattedDate}`);
                return formattedDate;
            });

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Chỉ số BMI',
                        data: sortedReports.map(report => report.bmi),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        tension: 0.1,
                    },
                ],
            };

            setChartData(chartData);
        }
    }, [reports]);

    // Thêm useEffect để fetch danh sách bác sĩ
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoadingDoctors(true);
                const response = await api.get('/Doctor/get-all');
                setDoctors(response.data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách bác sĩ:', error);
                toast.error('Không thể tải danh sách bác sĩ');
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await api.get(`/feedback/get-list-feedback-by-childId/${childId}`);
                if (response.status === 200) {
                    setFeedbacks(response.data);
                }
            } catch (error) {
                console.error('Lỗi tải phản hồi:', error);
                toast.error('Không thể tải danh sách phản hồi.');
            } finally {
                setLoadingFeedbacks(false);
            }
        };

        fetchFeedbacks();
    }, [childId]);

    const handleMakeReport = () => {
        if (!serviceStatus.isValid) {
            toast.error('Vui lòng mua dịch vụ để sử dụng tính năng này!');
            return;
        }
        setShowReportForm(true);
    };

    const handleSubmitReport = async () => {
        try {
            const reportData = {
                childId: childData.childId,
                height: parseFloat(height),
                weight: parseFloat(weight),
                reportCreateDate: selectedDate.format('YYYY-MM-DD'),
                reportIsActive: "1",
                reportMark: comment,
                reportContent: `Báo cáo BMI ngày ${selectedDate.format('DD-MM-YYYY')}`,
                reportName: reportName,
                bmi: parseFloat(bmi)
            };

            const response = await api.post('/reports/create-kid-bmi', reportData);
            
            if (response.status === 200) {
                toast.success('Tạo báo cáo thành công!');
                // Reset form
                setHeight('');
                setWeight('');
                setSelectedDate(moment());
                setBmi(null);
                setComment('');
                setShowReportForm(false);
            }
        } catch (error) {
            console.error('Lỗi khi tạo báo cáo:', error);
            toast.error(error.response?.data?.message || 'Tạo báo cáo thất bại!');
        }
    };

    const handleRefreshReports = async () => {
        try {
            setReportsLoading(true);
            const response = await api.get(`reports/child/${childId}`);
            if (response.status === 200) {
                setReports(response.data);
                updateChartData(response.data);
            }
        } catch (error) {
            console.error('Lỗi tải báo cáo:', error);
            toast.error('Không thể tải báo cáo.');
        } finally {
            setReportsLoading(false);
        }
    };

    const updateChartData = (reports) => {
        if (reports.length > 0) {
            const sortedReports = [...reports].sort((a, b) => {
                const dateA = convertToValidDate(a.reportCreateDate);
                const dateB = convertToValidDate(b.reportCreateDate);
                return dateA - dateB;
            });

            const chartData = {
                labels: sortedReports.map(report => formatDate(report.reportCreateDate)),
                datasets: [
                    {
                        label: 'Chỉ số BMI',
                        data: sortedReports.map(report => report.bmi),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        tension: 0.1,
                    },
                ],
            };

            setChartData(chartData);
        }
    };

    const handleSelectReport = (report) => {
        setSelectedReport(report);
        // Reset các state khác khi chọn report mới
        setShowProductSuggestions(false);
        setShowDoctorConsultForm(false);
        setShowEditReport(false);
        fetchProducts(report.reportMark);
    };

    const handleShowProducts = () => {
        if (!selectedReport) {
            toast.warning('Vui lòng chọn một báo cáo trước');
            return;
        }
        setShowProductSuggestions(true);
        setShowDoctorConsultForm(false);
        setShowEditReport(false);
    };

    const handleShowConsultForm = () => {
        if (!selectedReport) {
            toast.warning('Vui lòng chọn một báo cáo trước');
            return;
        }
        setShowDoctorConsultForm(true);
        setShowProductSuggestions(false);
        setShowEditReport(false);
    };

    const handleShowEditForm = () => {
        if (!selectedReport) {
            toast.warning('Vui lòng chọn một báo cáo trước');
            return;
        }
        setEditHeight(selectedReport.height);
        setEditWeight(selectedReport.weight);
        setEditDate(moment(selectedReport.reportCreateDate));
        setShowEditReport(true);
        setShowProductSuggestions(false);
        setShowDoctorConsultForm(false);
    };

    const handleSubmitConsultation = async () => {
        try {
            const consultData = {
                reportId: selectedReport.reportId,
                childId: childId,
                description: consultationData.description,
                urgency: consultationData.urgency,
                preferredDateTime: consultationData.preferredDateTime.format('YYYY-MM-DD HH:mm:ss')
            };

            await api.post('/consultation/create', consultData);
            toast.success('Đã gửi yêu cầu tham vấn thành công!');
            setShowDoctorConsultForm(false);
            setConsultationData({
                description: '',
                urgency: 'normal',
                preferredDateTime: moment()
            });
        } catch (error) {
            toast.error('Không thể gửi yêu cầu tham vấn: ' + error.response?.data?.message);
        }
    };

    const fetchProducts = async (productType) => {
        try {
            const response = await api.get(`/Product/get-by-type/${productType}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        }
    };

    const handleUpdateReport = async () => {
        try {
            const requestData = {
                childId: childData.childId,
                height: parseFloat(editHeight),
                weight: parseFloat(editWeight),
                date: editDate.format('YYYY-MM-DD')
            };

            const response = await api.put(`/reports/${selectedReport.reportId}`, requestData);

            if (response.status === 200) {
                toast.success('Cập nhật thành công!');
                await handleRefreshReports();
                setShowEditReport(false);
                setSelectedReport(null);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            const feedbackRequest = {
                reportId: selectedReport.reportId,
                doctorId: feedbackData.doctorId,
                feedbackContentRequest: feedbackData.feedbackContentRequest,
                feedbackIsActive: true,
                feedbackName: feedbackData.feedbackName,
                feedbackContentResponse: "string"
            };

            const response = await api.post('/feedback/create-feedback', feedbackRequest);
            
            if (response.status === 200) {
                toast.success('Gửi yêu cầu tham vấn thành công!');
                setShowDoctorConsultForm(false);
                // Reset form
                setFeedbackData({
                    doctorId: '',
                    feedbackName: '',
                    feedbackContentRequest: '',
                });
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại!');
        }
    };

    // Hàm xóa báo cáo
    const handleDeleteReport = async (reportId) => {
        if (!reportId) return; // Kiểm tra xem reportId có hợp lệ không

        try {
            const response = await api.delete(`/reports/${reportId}`);
            if (response.status === 204) {
                toast.success('Xoá báo cáo thành công!'); // Hiển thị thông báo thành công
                await handleRefreshReports(); // Gọi lại hàm handleRefreshReports để làm mới danh sách báo cáo
            } else {
                toast.error('Không thể xoá báo cáo.'); // Thông báo lỗi nếu không phải 204
            }
        } catch (error) {
            console.error('Lỗi khi xoá báo cáo:', error);
            toast.error('Không thể xoá báo cáo.'); // Thông báo lỗi nếu có lỗi xảy ra
        }
    };

    // Thêm hàm kiểm tra ngày hợp lệ
    const isDateValid = (date) => {
        if (!childData || !date) return false;
        
        try {
            const birthDate = moment(childData.dob);
            const oneYearAfterBirth = birthDate.add(1, 'years');
            const today = moment().endOf('day');
            
            return date >= oneYearAfterBirth && date <= today;
        } catch (error) {
            console.error('Lỗi kiểm tra ngày:', error);
            return false;
        }
    };

    const handleRefreshFeedbacks = async () => {
        setLoadingFeedbacks(true);
        try {
            const response = await api.get(`/feedback/get-list-feedback-by-childId/${childId}`);
            if (response.status === 200) {
                setFeedbacks(response.data);
            }
        } catch (error) {
            console.error('Lỗi tải phản hồi:', error);
            toast.error('Không thể tải danh sách phản hồi.');
        } finally {
            setLoadingFeedbacks(false);
        }
    };

    // Tính toán số trang
    const totalPages = Math.ceil(reports.length / reportsPerPage);

    // Lấy báo cáo cho trang hiện tại
    const getCurrentPageReports = () => {
        const indexOfLastReport = currentPage * reportsPerPage;
        const indexOfFirstReport = indexOfLastReport - reportsPerPage;
        return reports.slice(indexOfFirstReport, indexOfLastReport);
    };

    // Thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-[#F8F3D9]">
            <Header />
            
            <main className="container mx-auto p-4 md:p-6 pt-20">
                {/* Header Section */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pt-20">
                    Thông tin chi tiết trẻ
                </h1>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : childData ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-48 h-48">
                                    <img
                                        src={(childData.gender === 'Female' 
                                            ? '/Images/girl.png' 
                                            : '/Images/boy.png')}
                                        alt="Child avatar"
                                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                        onError={(e) => {
                                            e.target.src = '/Images/default-child.png';
                                        }}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {childData.lastName} {childData.firstName}
                                </h2>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-4">
                                {/* <InfoRow label="Mã phụ huynh" value={childData.parentId} />
                                <InfoRow label="Mã trẻ" value={childData.childId} /> */}
                                <InfoRow label="Giới tính" value={childData.gender == 'Male' ? 'Nam' : 'Nữ'} />
                                <InfoRow 
                                    label="Ngày sinh" 
                                    value={moment(childData.dob).format('DD-MM-YYYY')} 
                                />
                                <InfoRow 
                                    label="Tuổi của trẻ" 
                                    value={`${calculateAge(childData.dob)} tuổi`} 
                                />
                            </div>
                        </div>

                        {/* Report Button Container */}
                        <div className="px-6 pb-6 mt-6 border-t border-gray-100">
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleMakeReport}
                                    disabled={serviceStatus.loading || loading || !serviceStatus.isValid}
                                    className={`px-8 py-3 rounded-lg font-semibold text-sm md:text-base transition-all
                                        ${serviceStatus.isValid 
                                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg' 
                                            : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300'}
                                        ${(serviceStatus.loading || loading) ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {serviceStatus.loading || loading 
                                        ? 'Đang kiểm tra...' 
                                        : `Tạo báo cáo (${serviceStatus.isValid ? 'Khả dụng' : 'Vô hiệu'})`}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-red-500 font-medium">Không tìm thấy thông tin trẻ</p>
                    </div>
                )}

                {/* Thêm form báo cáo inline */}
                {showReportForm && (
                    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-black">Thông tin báo cáo</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                            <div className='hidden'>
                                <label className="block text-sm font-medium mb-1 text-black">Tên báo cáo</label>
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={(e) => setReportName(e.target.value || "BMI Report")}
                                    className="w-full p-2 border rounded"
                                    placeholder="Nhập tên báo cáo"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Chiều cao (cm)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value >= 0 ? e.target.value : 0)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Nhập chiều cao"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Cân nặng (kg)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value >= 0 ? e.target.value : 0)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Nhập cân nặng"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Ngày ghi nhận</label>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    format="DD-MM-YYYY"
                                    className="w-full"
                                    disabledDate={disabledDate}
                                    placeholder="Chọn ngày ghi nhận"
                                />
                                {childData && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        *Chỉ được chọn ngày từ {moment(childData.dob).add(1, 'years').format('DD-MM-YYYY')} đến {moment().format('DD-MM-YYYY')}
                                    </p>
                                )}
                            </div>
                            
                            {bmi && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-black">Chỉ số BMI</label>
                                    <div className="p-2 border rounded bg-gray-50">
                                        <span className={`font-medium ${getBmiTextClass(parseFloat(bmi))}`}>{bmi}</span>
                                        <span className="ml-2 text-sm text-gray-600">({comment})</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => {
                                    setShowReportForm(false);
                                    setHeight('');
                                    setWeight('');
                                    setSelectedDate(moment());
                                    setBmi(null);
                                    setComment('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                disabled={!height || !weight || !selectedDate}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Tạo báo cáo
                            </button>
                        </div>
                    </div>
                )}

                {/* Thêm phần biểu đồ */}
                {chartData && (
                    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-green-500">Biểu đồ theo dõi BMI</h3>
                        <div className="h-96">
                            <Line
                                data={{
                                    ...chartData,
                                    labels: chartData.labels.map(date => formatDate(date))
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Diễn biến chỉ số BMI theo thời gian'
                                        }
                                    },
                                    scales: {
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Chỉ số BMI'
                                            }
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Ngày đo'
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Section lịch sử báo cáo */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-green-500">Lịch sử báo cáo BMI</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleRefreshReports}
                                disabled={reportsLoading}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Tải lại
                            </button>
                            <button
                                onClick={handleShowProducts}
                                className={`px-4 py-2 rounded ${selectedReport ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'} text-white`}
                            >
                                Sản phẩm gợi ý
                            </button>
                            <button
                                onClick={handleShowConsultForm}
                                className={`px-4 py-2 rounded ${selectedReport ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-300'} text-white`}
                            >
                                Tham vấn bác sĩ
                            </button>
                            <button
                                onClick={handleShowEditForm}
                                className={`px-4 py-2 rounded ${selectedReport ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300'} text-white`}
                            >
                                Chỉnh sửa báo cáo
                            </button>
                            {/* Nút Xoá báo cáo */}
                            <button
                                onClick={() => handleDeleteReport(selectedReport?.reportId)}
                                disabled={!selectedReport}
                                className={`px-4 py-2 rounded ${selectedReport ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300'} text-white`}
                            >
                                Xoá báo cáo
                            </button>
                        </div>
                    </div>
                    
                    {/* Form tham vấn bác sĩ */}
                    {showDoctorConsultForm && selectedReport && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-black">
                            <h4 className="text-lg font-semibold mb-4">Tham vấn bác sĩ</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        <FaUserMd className="inline mr-2" />
                                        Bác sĩ
                                    </label>
                                    {loadingDoctors ? (
                                        <div className="w-full p-2 border rounded bg-gray-100">
                                            Đang tải danh sách bác sĩ...
                                        </div>
                                    ) : (
                                        <select
                                            value={feedbackData.doctorId}
                                            onChange={(e) => setFeedbackData(prev => ({
                                                ...prev,
                                                doctorId: e.target.value
                                            }))}
                                            className="w-full p-2 border rounded text-gray-700"
                                            required
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                                    {`${doctor.firstName} ${doctor.lastName}`}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tiêu đề tham vấn</label>
                                    <input
                                        type="text"
                                        value={feedbackData.feedbackName}
                                        onChange={(e) => setFeedbackData(prev => ({
                                            ...prev,
                                            feedbackName: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        placeholder="Nhập tiêu đề ngắn gọn"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Nội dung tham vấn</label>
                                    <textarea
                                        value={feedbackData.feedbackContentRequest}
                                        onChange={(e) => setFeedbackData(prev => ({
                                            ...prev,
                                            feedbackContentRequest: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        rows="4"
                                        placeholder="Mô tả chi tiết vấn đề cần tham vấn"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => {
                                            setShowDoctorConsultForm(false);
                                            setFeedbackData({
                                                doctorId: '',
                                                feedbackName: '',
                                                feedbackContentRequest: '',
                                            });
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSubmitFeedback}
                                        disabled={!feedbackData.doctorId || !feedbackData.feedbackName || !feedbackData.feedbackContentRequest}
                                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Gửi yêu cầu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form chỉnh sửa báo cáo */}
                    {showEditReport && selectedReport && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-black">
                            <h4 className="text-lg font-semibold mb-4">Chỉnh sửa chi tiết báo cáo</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Chỉnh sửa chiều cao (cm)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editHeight}
                                        onChange={(e) => setEditHeight(e.target.value >= 0 ? e.target.value : 0)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Chỉnh sửa cân nặng (kg)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editWeight}
                                        onChange={(e) => setEditWeight(e.target.value >= 0 ? e.target.value : 0)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Chỉnh sửa ngày đo</label>
                                    <DatePicker
                                        format="DD-MM-YYYY"
                                        value={editDate}
                                        onChange={setEditDate}
                                        className="w-full"
                                        disabledDate={(current) => !isDateValid(current)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setShowEditReport(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdateReport}
                                    disabled={!isDateValid(editDate)}
                                    className={`px-4 py-2 ${isDateValid(editDate) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300'} text-white rounded`}
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    )}

                    {reportsLoading ? (
                        <div className="flex justify-center py-4 text-black">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : reports.length > 0 && childData ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
                                {getCurrentPageReports().map((report) => (
                                    <div
                                        key={report.reportId}
                                        onClick={() => handleSelectReport(report)}
                                        onDoubleClick={() => handleShowEditForm()}
                                        className={`bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                            selectedReport?.reportId === report.reportId ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between hidden">
                                                <span className="font-medium">Mã báo cáo:</span>
                                                <span>{report.reportId}</span>
                                            </div>
                                            <div className="flex justify-between hidden ">
                                                <span className="font-medium">Tên báo cáo:</span>
                                                <span>{report.reportName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Chiều cao:</span>
                                                <span>{report.height} cm</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Cân nặng:</span>
                                                <span>{report.weight} kg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">BMI:</span>
                                                <span className={getBmiTextClass(report.bmi)}>
                                                    {report.bmi.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between hidden">
                                                <span className="font-medium">Độ tuổi ghi nhận:</span>
                                                <span>
                                                    {calculateAgeAtReport(childData.dob, report.reportContent.split(' ')[3])} tuổi
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Nhận xét:</span>
                                                <span className="text-sm text-gray-600">{report.reportMark}</span>
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="font-medium">Ngày tạo:</span>
                                                <span className="text-sm text-gray-500">
                                                    {moment(report.reportCreateDate).format('DD-MM-YYYY')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Phân trang */}
                            {reports.length > reportsPerPage && (
                                <div className="flex justify-center mt-6">
                                    <nav className="inline-flex rounded-md shadow">
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-l-md ${
                                                currentPage === 1 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                                            } border border-gray-300 focus:outline-none`}
                                        >
                                            &lt;&lt;
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 ${
                                                currentPage === 1 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                                            } border-t border-b border-gray-300 focus:outline-none`}
                                        >
                                            &lt;
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Tính toán số trang hiển thị
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-1 ${
                                                        currentPage === pageNum
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white text-blue-500 hover:bg-blue-50'
                                                    } border-t border-b border-gray-300 focus:outline-none`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                                            } border-t border-b border-gray-300 focus:outline-none`}
                                        >
                                            &gt;
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-r-md ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                                            } border border-gray-300 focus:outline-none`}
                                        >
                                            &gt;&gt;
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-600">Không có báo cáo nào.</p>
                    )}
                </div>

                {/* Section sản phẩm gợi ý */}
                {showProductSuggestions && selectedReport && (
                    <section className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sản phẩm gợi ý</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <div key={product.productListId} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                    <div className="h-48 bg-gray-200">
                                        <img 
                                            src={`../../../public/Images/${product.imageUrl}`}
                                            alt={product.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {product.productName}
                                        </h3>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl font-bold text-red-600">
                                                {product.price.toLocaleString()}đ
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                product.productType === 'Gầy độ III (Rất gầy) - Nguy cơ cao' ? 'bg-blue-100 text-blue-800' :
                                                product.productType === 'Gầy độ II - Nguy cơ vừa' ? 'bg-green-100 text-green-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                                {product.productType}
                                            </span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <FaStar className="text-yellow-400" />
                                            <span className="ml-1 text-gray-600">{product.rating}</span>
                                        </div>
                                        <div className="space-y-2 text-sm text-black">
                                            <p><span className="font-medium">Độ tuổi:</span> {product.minAge} - {product.maxAge} tuổi</p>
                                            <p><span className="font-medium">Thương hiệu:</span> {product.brand}</p>
                                            <p><span className="font-medium">Khuyến nghị:</span> {product.recommendedBy}</p>
                                        </div>
                                        <div className="mt-4 border-t pt-4">
                                            <p className="text-gray-600 text-sm">
                                                {product.productDescription}
                                            </p>
                                        </div>
                                        {/* <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
                                            Xem chi tiết
                                        </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Section hiển thị danh sách phản hồi dưới dạng thẻ card */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-green-500">Danh sách phản hồi</h3>
                    
                    {/* Nút tải lại */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleRefreshFeedbacks} // Hàm để tải lại danh sách phản hồi
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Tải lại
                        </button>
                    </div>

                    {loadingFeedbacks ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {feedbacks.map(feedback => (
                                <div key={feedback.feedbackId} className="bg-white rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                                    <h4 className="font-semibold text-2xl text-blue-600">{feedback.feedbackName}</h4>
                                    <p className="text-m text-gray-700">Nội dung yêu cầu: <span className="font-medium">{feedback.feedbackContentRequest}</span></p>
                                    <p className="text-m text-gray-500">Ngày tạo: {moment(feedback.feedbackCreateDate).format('DD-MM-YYYY')}</p>
                                    <p className="text-m text-gray-500">Trạng thái: <span className={feedback.feedbackIsActive ? 'text-green-500' : 'text-red-500'}>{feedback.feedbackIsActive ? 'Hoạt động' : 'Không hoạt động'}</span></p>
                                    <p className="text-m text-gray-700">Nội dung phản hồi: <span className="italic">{feedback.feedbackContentResponse === 'string' ? 'Đang chờ phản hồi từ bác sĩ' : feedback.feedbackContentResponse }</span></p>
                                    <p className="text-m text-gray-700 hidden">Mã báo cáo: <span className="font-medium">{feedback.report.reportId}</span></p>
                                    <p className="text-m text-gray-700 mt-4">Đánh giá báo cáo: <span className="font-medium">{feedback.report.reportMark}</span></p>
                                    <p className="text-m text-gray-500">Ngày tạo báo cáo: {moment(feedback.report.reprotCreateDate).format('DD-MM-YYYY')}</p>
                                    <p className="text-m text-gray-700">Chiều cao: <span className="italic">{feedback.report.height}</span></p>
                                    <p className="text-m text-gray-700">Cân nặng: <span className="italic">{feedback.report.weight}</span></p>
                                    <p className="text-m text-gray-700">BMI: <span className="italic">{feedback.report.bmi.toFixed(2)}</span></p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
};

// Helper component
const InfoRow = ({ label, value }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 border-b border-gray-100">
        <span className="text-gray-600 font-medium min-w-[120px]">{label}</span>
        <span className="text-gray-800 break-words max-w-[70%]">{value || '---'}</span>
    </div>
);

// Thêm hàm helper cho màu BMI
const getBmiTextClass = (bmi) => {
    if (bmi < 16.0) return 'text-blue-800 font-bold'; // Gầy độ III - Nguy cơ cao
    if (bmi < 16.9) return 'text-blue-600'; // Gầy độ II - Nguy cơ vừa
    if (bmi < 18.4) return 'text-blue-400'; // Gầy độ I - Nguy cơ thấp
    if (bmi < 24.9) return 'text-green-500'; // Cân nặng bình thường
    if (bmi < 29.9) return 'text-yellow-500'; // Thừa cân - Nguy cơ tăng nhẹ
    if (bmi < 34.9) return 'text-orange-500'; // Béo phì độ I - Nguy cơ trung bình
    if (bmi < 39.9) return 'text-red-500'; // Béo phì độ II - Nguy cơ cao
    return 'text-red-800 font-bold'; // Béo phì độ III - Nguy cơ rất cao
};

// Thêm hàm để phân loại BMI theo mô tả
const getBmiCategory = (bmi) => {
    if (bmi < 16.0) return "Gầy độ III (Rất gầy) - Nguy cơ cao";
    if (bmi < 16.9) return "Gầy độ II - Nguy cơ vừa";
    if (bmi < 18.4) return "Gầy độ I - Nguy cơ thấp";
    if (bmi < 24.9) return "Cân nặng bình thường - Bình thường";
    if (bmi < 29.9) return "Thừa cân - Nguy cơ tăng nhẹ";
    if (bmi < 34.9) return "Béo phì độ I - Nguy cơ trung bình";
    if (bmi < 39.9) return "Béo phì độ II - Nguy cơ cao";
    return "Béo phì độ III - Nguy cơ rất cao";
};

export default DetailChildByChildId;
