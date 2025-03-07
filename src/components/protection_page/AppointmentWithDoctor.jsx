import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Header } from '../Header';
import { Footer } from '../Footer';
import api from '../Utils/Axios';
import { toast } from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUser, FaUserMd } from 'react-icons/fa';

moment.locale('vi');
const localizer = momentLocalizer(moment);

const AppointmentWithDoctor = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [children, setChildren] = useState([]);
    const [appointmentForm, setAppointmentForm] = useState({
        fullName: '',
        doctorId: '',
        childId: '',
        appointmentTime: '',
        description: ''
    });

    // Fetch danh sách bác sĩ và trẻ em
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsResponse, childrenResponse] = await Promise.all([
                    api.get('/doctors'),
                    api.get('/Parent/children')
                ]);
                setDoctors(doctorsResponse.data);
                setChildren(childrenResponse.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            }
        };
        fetchData();
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

    // Component Calendar với props để vô hiệu hóa ngày trong quá khứ
    const calendarProps = {
        localizer,
        events: [],
        style: { height: 400 },
        views: ['month'],
        defaultView: "month",
        selectable: true,
        onSelectSlot: ({start}) => handleDateSelect(start),
        className: "text-black",
        min: new Date(),
        // Vô hiệu hóa ngày trong quá khứ
        dayPropGetter: (date) => {
            const today = moment().startOf('day');
            if (moment(date).isBefore(today)) {
                return {
                    style: {
                        backgroundColor: '#f0f0f0',
                        cursor: 'not-allowed'
                    },
                    className: 'disabled-day'
                };
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !appointmentForm.appointmentTime) {
            toast.error('Vui lòng chọn ngày và giờ hẹn');
            return;
        }

        try {
            const appointmentDateTime = moment(selectedDate)
                .format('YYYY-MM-DD') + 'T' + appointmentForm.appointmentTime;

            const response = await api.post('/appointments', {
                ...appointmentForm,
                appointmentDateTime
            });

            if (response.status === 201) {
                toast.success('Đặt lịch hẹn thành công!');
                setSelectedDate(null);
                setAppointmentForm({
                    fullName: '',
                    doctorId: '',
                    childId: '',
                    appointmentTime: '',
                    description: ''
                });
            }
        } catch (error) {
            toast.error('Đặt lịch thất bại: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 pt-20">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                        <h1 className="text-3xl font-bold text-black">Đặt Lịch Hẹn</h1>
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
                                        <div className="grid grid-cols-4 gap-2">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    disabled={!isTimeSlotValid(time)}
                                                    className={`p-2 rounded-md text-center ${
                                                        appointmentForm.appointmentTime === time
                                                            ? 'bg-blue-500 text-white'
                                                            : !isTimeSlotValid(time)
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => setAppointmentForm(prev => ({
                                                        ...prev,
                                                        appointmentTime: time
                                                    }))}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chọn thông tin trẻ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn thông tin trẻ
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
                                                <option key={child.id} value={child.id}>
                                                    {child.firstName} {child.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Họ và tên */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                            value={appointmentForm.fullName}
                                            onChange={(e) => setAppointmentForm(prev => ({
                                                ...prev,
                                                fullName: e.target.value
                                            }))}
                                        />
                                    </div>

                                    {/* Chọn bác sĩ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn bác sĩ
                                        </label>
                                        <select
                                            required
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                            value={appointmentForm.doctorId}
                                            onChange={(e) => setAppointmentForm(prev => ({
                                                ...prev,
                                                doctorId: e.target.value
                                            }))}
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Nội dung */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nội dung
                                        </label>
                                        <textarea
                                            required
                                            rows="4"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                            value={appointmentForm.description}
                                            onChange={(e) => setAppointmentForm(prev => ({
                                                ...prev,
                                                description: e.target.value
                                            }))}
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            className="px-6 py-2.5 bg-red-500 text-white-700 rounded-md hover:bg-red-800 transition duration-200"
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
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AppointmentWithDoctor;
