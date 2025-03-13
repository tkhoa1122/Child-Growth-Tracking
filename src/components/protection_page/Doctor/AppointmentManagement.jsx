import { useEffect, useState } from 'react';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import { FaCalendarAlt, FaCheck, FaTimes, FaClock, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from '../../Utils/Axios';
import './DoctorCSS/AppointmentManagement.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState({
        type: 'all', // all, today, week, month
        date: null,   // Ngày được chọn từ lịch
        status: 'all' // all, Pending, Confirmed, Cancelled
    });
    const [doctorId, setDoctorId] = useState('');
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });
    const [editingStatus, setEditingStatus] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        status: '',
        appointmentDate: null
    });

    // Hàm lấy doctorId từ API dựa vào userId
    const fetchDoctorId = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('Không tìm thấy userId trong localStorage');
                return;
            }
            
            const response = await axios.get(`Doctor/${userId}`);
            if (response.data && response.data.doctorId) {
                setDoctorId(response.data.doctorId);
                return response.data.doctorId;
            } else {
                console.error('Không tìm thấy doctorId trong response');
            }
        } catch (error) {
            console.error('Lỗi khi lấy doctorId:', error);
        }
        return null;
    };

    // Cập nhật hàm fetchAppointments để sử dụng doctorId
    const fetchAppointments = async () => {
        try {
            // Nếu chưa có doctorId, lấy doctorId trước
            let currentDoctorId = doctorId;
            if (!currentDoctorId) {
                currentDoctorId = await fetchDoctorId();
                if (!currentDoctorId) {
                    console.error('Không thể lấy doctorId');
                    return;
                }
            }
            
            // Gọi API lấy danh sách cuộc hẹn của bác sĩ
            const response = await axios.get(`Appointment/doctor/${currentDoctorId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách cuộc hẹn:', error);
            setNotification({
                show: true,
                message: 'Đã xảy ra lỗi khi tải danh sách cuộc hẹn.',
                type: 'error'
            });
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            await fetchAppointments();
        };

        initializeData();
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
        const { type, date, status } = filter;
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

        // Lọc theo trạng thái
        if (status !== 'all' && appointment.status !== status) {
            return false;
        }

        return true;
    });

    // Thêm enum hoặc object để quản lý các trạng thái
    const AppointmentStatus = {
        PENDING: 'Pending',
        CONFIRMED: 'Confirmed',
        CANCELLED: 'Cancelled'
    };

    const handleUpdate = async () => {
        try {
            if (!updateForm.appointmentDate || !updateForm.status) {
                setNotification({
                    show: true,
                    message: 'Vui lòng điền đầy đủ thông tin!',
                    type: 'error'
                });
                return;
            }

            // Chuyển đổi ngày sang múi giờ UTC và format lại --quan trọng--
            const selectedDate = new Date(updateForm.appointmentDate);
            const utcDate = new Date(Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDate.getSeconds()
            ));

            // Đóng gói dữ liệu với format mới
            const updateData = {
                appointmentDate: utcDate.toISOString(),
                status: updateForm.status
            };

            console.log('Update data:', updateData);

            const response = await axios.put(
                `Appointment/${editingAppointment.appointmentId}`, 
                updateData
            );

            await fetchAppointments();
            setNotification({
                show: true,
                message: 'Cập nhật cuộc hẹn thành công!',
                type: 'success'
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error details:', error.response?.data);
            setNotification({
                show: true,
                message: error.response?.data?.title || 'Đã xảy ra lỗi khi cập nhật cuộc hẹn.',
                type: 'error'
            });
        }
    };
    
    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setUpdateForm({
            status: appointment.status,
            appointmentDate: new Date(appointment.appointmentDate)
        });
        setIsModalOpen(true);
    };

    // Hàm xử lý xóa cuộc hẹn
    const handleDeleteAppointment = async (appointmentId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cuộc hẹn này?')) {
            try {
                await axios.delete(`Appointment/${appointmentId}`);
                setNotification({
                    show: true,
                    message: 'Xóa cuộc hẹn thành công!',
                    type: 'success'
                });
                fetchAppointments();
            } catch (error) {
                setNotification({
                    show: true,
                    message: 'Đã xảy ra lỗi khi xóa cuộc hẹn.',
                    type: 'error'
                });
            }
        }
    };

    return (
        <DoctorLayout>
            {/* Notification với z-index cao nhất */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    ) : (
                        <FaTimesCircle className="w-6 h-6 text-red-500 mr-2" />
                    )}
                    <span className={`font-medium ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {notification.message}
                    </span>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-2xl text-indigo-600" />
                        <h2 className="text-xl font-bold text-gray-800">Quản lý cuộc hẹn</h2>
                    </div>
                    <div className="flex gap-4">
                        <select
                            name="type"
                            value={filter.type}
                            onChange={handleFilterChange}
                            className="border rounded-lg px-4 py-2 text-gray-600"
                        >
                            <option value="all">Tất cả cuộc hẹn</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                        </select>
                        
                                <select
                            name="status"
                            value={filter.status}
                            onChange={handleFilterChange}
                            className="border rounded-lg px-4 py-2 text-gray-600"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="Pending">Đang chờ</option>
                            <option value="Confirmed">Đã xác nhận</option>
                            <option value="Cancelled">Đã hủy</option>
                        </select>
                        
                        <div className="datepicker-container">
                            <DatePicker
                                selected={filter.date}
                                onChange={handleDateChange}
                                className="datepicker-input"
                                placeholderText="Chọn ngày"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                popperClassName="react-datepicker-popper"
                                popperPlacement="bottom-start"
                            />
                            <FaCalendarAlt className="datepicker-icon" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hẹn</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Cập nhật trạng thái
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.appointmentId}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{appointment.childName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 justify-center">
                                            {appointment.status === AppointmentStatus.CONFIRMED && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setUpdateForm({
                                                                status: AppointmentStatus.CANCELLED,
                                                                appointmentDate: new Date(appointment.appointmentDate)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                        title="Cancel"
                                                    >
                                                        <FaTimes size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setUpdateForm({
                                                                status: AppointmentStatus.PENDING,
                                                                appointmentDate: new Date(appointment.appointmentDate)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                                                        title="Set as Pending"
                                                    >
                                                        <FaClock size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {appointment.status === AppointmentStatus.CANCELLED && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setUpdateForm({
                                                                status: AppointmentStatus.CONFIRMED,
                                                                appointmentDate: new Date(appointment.appointmentDate)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                                        title="Confirm"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setUpdateForm({
                                                                status: AppointmentStatus.PENDING,
                                                                appointmentDate: new Date(appointment.appointmentDate)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                        title="Set as Pending"
                                                    >
                                                        <FaClock />
                                                    </button>
                                                </>
                                            )}
                                            {appointment.status === AppointmentStatus.PENDING && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setUpdateForm({
                                                                status: AppointmentStatus.CONFIRMED,
                                                                appointmentDate: new Date(appointment.appointmentDate)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                                        title="Confirm"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setUpdateForm({
                                                                status: AppointmentStatus.CANCELLED,
                                                                appointmentDate: new Date(appointment.appointmentDate)
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                        title="Cancel"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={() => handleEdit(appointment)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                                title="Edit"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAppointment(appointment.appointmentId)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                                title="Delete"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Cập nhật - chỉ giữ lại một phiên bản */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 overflow-y-auto h-full w-full z-[90]">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Cập nhật cuộc hẹn</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm(prev => ({
                                        ...prev,
                                        status: e.target.value
                                    }))}
                                    className="w-full text-gray-500 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={AppointmentStatus.PENDING}>Pending</option>
                                    <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
                                    <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
                                </select>
                            </div>

                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày hẹn
                                </label>
                                <DatePicker
                                    selected={updateForm.appointmentDate}
                                    onChange={(date) => setUpdateForm(prev => ({
                                        ...prev,
                                        appointmentDate: date
                                    }))}
                                    className="w-full border text-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn ngày"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
};

export default AppointmentManagement;