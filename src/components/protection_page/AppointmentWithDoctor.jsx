import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'moment/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Header } from '../Header';
import { Footer } from '../Footer';
import api from '../Utils/Axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUser, FaUserMd } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

moment.locale('vi');
moment.tz.setDefault('Asia/Ho_Chi_Minh');
const localizer = momentLocalizer(moment);

const AppointmentWithDoctor = () => {
    const { userId } = useParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [parentInfo, setParentInfo] = useState({
        parentId: '',
        accountId: '',
        firstName: '',
        lastName: ''
    });
    const [appointmentForm, setAppointmentForm] = useState({
        fullName: '',
        doctorId: '',
        childId: '',
        appointmentTime: '',
        description: ''
    });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    // Fetch thông tin parent và children
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch thông tin parent từ accountId
                const parentResponse = await api.get(`/Parent/by-accountId/${userId}`);
                const parentData = parentResponse.data;
                setParentInfo({
                    parentId: parentData.parentId,
                    accountId: parentData.accountId,
                    firstName: parentData.account.firstName,
                    lastName: parentData.account.lastName
                });

                // Set fullName từ thông tin account
                setAppointmentForm(prev => ({
                    ...prev,
                    fullName: `${parentData.account.firstName} ${parentData.account.lastName}`
                }));

                // Fetch danh sách trẻ em dựa theo parentId
                const childrenResponse = await api.get(`/Parent/parents/${parentData.parentId}/children`);
                setChildren(childrenResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    // Thêm useEffect mới để fetch lịch sử đặt lịch
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoadingHistory(true);
                const response = await api.get(`/Appointment/appoiment-byid/${parentInfo.parentId}`);
                setAppointmentHistory(response.data);
            } catch (error) {
                toast.error('Không thể tải lịch sử đặt lịch');
            } finally {
                setLoadingHistory(false);
            }
        };

        if (parentInfo.parentId) {
            fetchHistory();
        }
    }, [parentInfo.parentId]);

    // Thêm useEffect mới để fetch danh sách bác sĩ
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
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

    // Kiểm tra thời gian có hợp lệ không
    const isTimeSlotValid = (time) => {
        if (!selectedDate) return false;
        
        const now = moment();
        const slotTime = moment(selectedDate).set({
            hour: parseInt(time.split(':')[0]),
            minute: parseInt(time.split(':')[1]),
            second: 0
        });

        return slotTime.isAfter(now);
    };

    // Danh sách các khung giờ có thể đặt lịch
    const timeSlots = [
        "08:00", "09:00", "10:00", "11:00",
        "13:00", "14:00", "15:00", "16:00"
    ];

    // Xử lý style cho các ngày trong calendar
    const dayPropGetter = (date) => {
        const today = moment().startOf('day');
        const isSelected = selectedDate && 
            moment(date).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD');
        
        if (moment(date).isBefore(today)) {
            return {
                style: {
                    backgroundColor: '#f0f0f0',
                    cursor: 'not-allowed',
                    color: '#9ca3af'
                }
            };
        }
        
        if (isSelected) {
            return {
                style: {
                    backgroundColor: '#22c55e', // green-500
                    color: 'white',
                    fontWeight: 'bold'
                }
            };
        }
        
        return {};
    };

    const handleDateSelect = (date) => {
        // Kiểm tra nếu ngày được chọn là ngày trong quá khứ
        if (moment(date).isBefore(moment().startOf('day'))) {
            toast.error('Không thể chọn ngày trong quá khứ');
            return;
        }
        
        setSelectedDate(date);
        setAppointmentForm(prev => ({
            ...prev,
            appointmentTime: ''
        }));
    };

    // Custom Toolbar Component
    const CustomToolbar = (toolbar) => {
        return (
            <div className="flex justify-between items-center mb-4 p-2">
                <div className="flex space-x-1">
                    <button 
                        type="button" 
                        onClick={() => toolbar.onNavigate('PREV')}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    >
                        Tháng trước
                    </button>
                    <button 
                        type="button" 
                        onClick={() => toolbar.onNavigate('TODAY')}
                        className="px-4 py-2 text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50"
                    >
                        Hôm nay
                    </button>
                    <button 
                        type="button" 
                        onClick={() => toolbar.onNavigate('NEXT')}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50"
                    >
                        Tháng sau
                    </button>
                </div>
                <span className="text-lg font-semibold text-gray-700">
                    {moment(toolbar.date).format('MMMM YYYY')}
                </span>
            </div>
        );
    };

    // Calendar props với các cấu hình
    const calendarProps = {
        localizer,
        events: [],
        defaultDate: new Date(),
        style: { height: 400 },
        views: ['month'],
        defaultView: "month",
        selectable: true,
        onSelectSlot: ({start}) => handleDateSelect(start),
        className: "bg-white rounded-lg p-4 text-black",
        dayPropGetter: dayPropGetter,
        date: currentDate,
        onNavigate: (date) => {
            setCurrentDate(date);
        },
        components: {
            toolbar: CustomToolbar
        },
        messages: {
            next: "Tháng sau",
            previous: "Tháng trước",
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày"
        },
        formats: {
            dateFormat: 'DD',
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd',
            dayRangeHeaderFormat: ({ start, end }) => 
                `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM/YYYY')}`
        }
    };

    // Thêm CSS tùy chỉnh cho calendar
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .rbc-calendar {
                background-color: white;
                border-radius: 0.5rem;
                padding: 1rem;
            }
            .rbc-month-view {
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
            }
            .rbc-header {
                padding: 0.75rem;
                font-weight: 600;
                color: #374151;
                background-color: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
            }
            .rbc-date-cell {
                padding: 0.5rem;
                font-size: 0.875rem;
            }
            .rbc-today {
                background-color: #f0fdf4 !important;
            }
            .rbc-off-range-bg {
                background-color: #f9fafb;
            }
            .rbc-month-row {
                border-top: none;
            }
            .rbc-day-bg {
                transition: all 0.2s ease-in-out;
            }
            .rbc-day-bg:hover:not(.disabled-day) {
                background-color: #f0fdf4;
                cursor: pointer;
            }
            .rbc-toolbar {
                margin-bottom: 1rem;
            }
            .rbc-toolbar button {
                color: #374151;
                background-color: white;
                border: 1px solid #e5e7eb;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                transition: all 0.2s ease-in-out;
            }
            .rbc-toolbar button:hover {
                background-color: #f9fafb;
            }
            .rbc-toolbar button.rbc-active {
                background-color: #22c55e;
                color: white;
                border-color: #22c55e;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!appointmentForm.doctorId || !appointmentForm.childId || !selectedDate || !appointmentForm.appointmentTime) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            // Xử lý scheduledTime
            const scheduledTime = moment(selectedDate)
                .set({
                    hour: parseInt(appointmentForm.appointmentTime.split(':')[0]),
                    minute: parseInt(appointmentForm.appointmentTime.split(':')[1]),
                    second: 0
                })
                .tz('Asia/Ho_Chi_Minh')
                .utc()
                .toISOString();

            // Tạo createdAt
            const createdAt = moment().utc().toISOString();

            const requestBody = {
                doctorId: appointmentForm.doctorId,
                parentId: parentInfo.parentId,
                childId: appointmentForm.childId,
                status: "Pending",
                scheduledTime: scheduledTime, // Đổi tên trường theo API
                createdAt: createdAt
            };

            // Đổi endpoint API
            const response = await api.post('/Parent/appointments/create', requestBody);

            if (response.status === 200) {
                toast.success('Đặt lịch thành công!');
                // Reset form
                setSelectedDate(null);
                setAppointmentForm(prev => ({
                    ...prev,
                    doctorId: '',
                    childId: '',
                    appointmentTime: ''
                }));
                
                // Tải lại lịch sử NGAY LẬP TỨC
                try {
                    const historyResponse = await api.get(`/Appointment/appoiment-byid/${parentInfo.parentId}`);
                    setAppointmentHistory(historyResponse.data);
                } catch (historyError) {
                    console.error('Lỗi khi tải lại lịch sử:', historyError);
                    toast.error('Không thể cập nhật lịch sử');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.title 
                || error.response?.data?.errors?.join(', ') 
                || 'Đặt lịch thất bại';
            toast.error(errorMessage);
            console.error('Chi tiết lỗi:', error.response?.data);
        }
    };

    const handleAppointmentClick = async (appointmentId) => {
        try {
            const response = await api.get(`/Appointment/${appointmentId}`);
            const appointment = response.data;
            
            // Chuyển đổi thời gian từ UTC sang múi giờ Việt Nam
            const utcMoment = moment.utc(appointment.appointmentDate);
            const localTime = utcMoment.tz('Asia/Ho_Chi_Minh');

            setSelectedAppointmentId(appointmentId);
            setSelectedDate(localTime.toDate());
            setAppointmentForm({
                fullName: `${parentInfo.firstName} ${parentInfo.lastName}`,
                doctorId: appointment.doctorId,
                childId: appointment.childId,
                appointmentTime: localTime.format('HH:mm') // Hiển thị giờ theo múi giờ Việt Nam
            });
            
            // Cuộn lên phần form để người dùng dễ dàng chỉnh sửa
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast.error('Không thể tải thông tin đặt lịch');
            console.error('Chi tiết lỗi:', error.response?.data);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedAppointmentId || !appointmentForm.doctorId || !appointmentForm.childId || !selectedDate || !appointmentForm.appointmentTime) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            // Chuyển đổi thời gian từ giờ địa phương sang UTC trước khi gửi API
            const localDateTime = moment(selectedDate)
                .set({
                    hour: parseInt(appointmentForm.appointmentTime.split(':')[0]),
                    minute: parseInt(appointmentForm.appointmentTime.split(':')[1]),
                    second: 0
                })
                .tz('Asia/Ho_Chi_Minh');

            const utcDateTime = localDateTime.utc().toISOString();

            const response = await api.put(`/Appointment/${selectedAppointmentId}`, {
                scheduledTime: utcDateTime,
                status: 0
            });

            if (response.status === 200) {
                toast.success('Cập nhật thành công!');
                // Reset form và tải lại lịch sử
                setSelectedAppointmentId(null);
                setSelectedDate(null);
                setAppointmentForm({
                    fullName: '',
                    doctorId: '',
                    childId: '',
                    appointmentTime: ''
                });
                // Tải lại lịch sử đặt lịch
                const historyResponse = await api.get(`/Appointment/appoiment-byid/${parentInfo.parentId}`);
                setAppointmentHistory(historyResponse.data);
            }
        } catch (error) {
            toast.error('Cập nhật thất bại: ' + (error.response?.data?.title || 'Lỗi hệ thống'));
        }
    };

    const handleDelete = async () => {
        if (!selectedAppointmentId) return;

        try {
            const response = await api.delete(`/Appointment/${selectedAppointmentId}`);
            if (response.status === 200) {
                toast.success('Đã xóa cuộc hẹn!');
                // Reset và tải lại dữ liệu
                setSelectedAppointmentId(null);
                setSelectedDate(null);
                const historyResponse = await api.get(`/Appointment/appoiment-byid/${parentInfo.parentId}`);
                setAppointmentHistory(historyResponse.data);
            }
        } catch (error) {
            toast.error('Xóa thất bại: ' + (error.response?.data?.title || 'Lỗi hệ thống'));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F3D9' }}>
                <div className="text-center">
                    <div className="spinner-border text-blue-500" role="status">
                        <span className="sr-only">Đang tải...</span>
                    </div>
                    <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 pt-20">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                        <h1 className="text-3xl font-bold text-black">Đặt Lịch Hẹn</h1>
                    </div>

                    {/* Thông tin người đặt lịch */}
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            Đặt lịch cho: <span className="font-semibold">{parentInfo.firstName} {parentInfo.lastName}</span>
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                            Parent ID: <span className="font-mono">{parentInfo.parentId}</span>
                        </p>
                        <p className="text-gray-600 text-sm">
                            Account ID: <span className="font-mono">{parentInfo.accountId}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Calendar Section */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Chọn ngày hẹn
                            </h2>
                            <Calendar {...calendarProps} />
                        </div>

                        {/* Appointment Form Section */}
                        {selectedDate && (
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Chi tiết cuộc hẹn
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Ngày đã chọn */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày đã chọn
                                        </label>
                                        <div className="bg-white p-3 rounded-md border border-gray-200 text-gray-700">
                                            {moment(selectedDate).format('dddd, DD/MM/YYYY')}
                                        </div>
                                    </div>

                                    {/* Chọn giờ hẹn */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn giờ hẹn
                                        </label>
                                        <select
                                            value={appointmentForm.appointmentTime}
                                            onChange={(e) => setAppointmentForm(prev => ({
                                                ...prev,
                                                appointmentTime: e.target.value
                                            }))}
                                            className="w-full p-2 border rounded text-gray-700"
                                            required
                                        >
                                            <option value="">Chọn giờ</option>
                                            {timeSlots.map(time => (
                                                <option 
                                                    key={time} 
                                                    value={time}
                                                    disabled={!isTimeSlotValid(time)}
                                                >
                                                    {time}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Họ và tên (disabled) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên cha/mẹ
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                                            value={appointmentForm.fullName}
                                        />
                                    </div>

                                    {/* Chọn thông tin trẻ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn thông tin trẻ muốn đặt lịch
                                        </label>
                                        <select
                                            required
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                            value={appointmentForm.childId}
                                            onChange={(e) => setAppointmentForm(prev => ({
                                                ...prev,
                                                childId: e.target.value
                                            }))}
                                        >
                                            <option value="">Chọn trẻ</option>
                                            {children.map((child) => (
                                                <option key={child.childId} value={child.childId}>
                                                    {`${child.firstName} ${child.lastName}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Chọn bác sĩ */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            <FaUserMd className="inline mr-2" />
                                            Bác sĩ
                                        </label>
                                        <select
                                            value={appointmentForm.doctorId}
                                            onChange={(e) => setAppointmentForm({...appointmentForm, doctorId: e.target.value})}
                                            className="w-full p-2 border rounded  text-gray-700"
                                            required
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                                    {`${doctor.firstName} ${doctor.lastName}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Trạng thái */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái
                                        </label>
                                        <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                            Đang chờ xác nhận
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        {selectedAppointmentId ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="px-6 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                                                    onClick={handleDelete}
                                                >
                                                    Xóa cuộc hẹn
                                                </button>
                                                <button
                                                    type="button"
                                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                                    onClick={handleUpdate}
                                                >
                                                    Lưu thay đổi
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="px-6 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                                                    onClick={() => setSelectedDate(null)}
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                                                >
                                                    Xác nhận đặt lịch
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* New Appointment History Section */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-black">Lịch sử đặt lịch</h2>
                    </div>

                    {loadingHistory ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-blue-500" role="status">
                                <span className="sr-only">Đang tải...</span>
                            </div>
                        </div>
                    ) : appointmentHistory.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            Chưa có lịch sử đặt lịch
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phụ huynh</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trẻ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hẹn</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointmentHistory.map((appointment) => (
                                        <tr 
                                            key={appointment.appointmentId}
                                            onClick={() => handleAppointmentClick(appointment.appointmentId)}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.doctorName || `${appointment.doctorId}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.parentName || `${appointment.parentId}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.childName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.appointmentDate?.startsWith('0001-01-01') 
                                                    ? 'Chưa có ngày hẹn'
                                                    : moment.utc(appointment.appointmentDate) // Parse từ UTC
                                                        .tz('Asia/Ho_Chi_Minh') // Chuyển đổi sang múi giờ Việt Nam
                                                        .format('DD/MM/YYYY HH:mm')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                      appointment.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                      'bg-red-100 text-red-800'}`}>
                                                    {appointment.status === 'Pending' ? 'Đang chờ' :
                                                     appointment.status === 'Approved' ? 'Đã duyệt' : 
                                                     'Đã hủy'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        duration: 3000,
                        style: {
                            background: 'red',
                        },
                    },
                }}
            />
        </div>
    );
};

export default AppointmentWithDoctor;
