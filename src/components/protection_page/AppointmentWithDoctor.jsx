import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Header } from '../Header';
import { Footer } from '../Footer';
import api from '../Utils/Axios';
import { toast } from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUser, FaClipboardList } from 'react-icons/fa';

const localizer = momentLocalizer(moment);

const AppointmentWithDoctor = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [view, setView] = useState('week');
    const [date, setDate] = useState(new Date());
    const [appointmentDetails, setAppointmentDetails] = useState({
        title: '',
        description: '',
        childId: '',
        doctorId: ''
    });

    // Thêm hàm kiểm tra thời gian hợp lệ
    const handleSelect = (slotInfo) => {
        const now = new Date();
        
        // Kiểm tra nếu thời gian bắt đầu nhỏ hơn thời gian hiện tại
        if (slotInfo.start < now) {
            toast.error('Không thể đặt lịch cho thời gian đã qua');
            return;
        }
        
        setSelectedSlot(slotInfo);
        setShowModal(true);
    };

    // Hàm để vô hiệu hóa các ngày trong quá khứ
    const minTime = new Date();
    minTime.setHours(8, 0, 0); // Đặt giờ bắt đầu là 8:00

    const maxTime = new Date();
    maxTime.setHours(17, 0, 0); // Đặt giờ kết thúc là 17:00

    // Xử lý khi thay đổi view (tuần/tháng/ngày)
    const handleViewChange = (newView) => {
        setView(newView);
    };

    // Xử lý khi chuyển đổi thời gian (tuần trước/sau, tháng trước/sau)
    const handleNavigate = (newDate) => {
        setDate(newDate);
    };

    // Tùy chỉnh thanh công cụ của lịch
    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToCurrent = () => {
            toolbar.onNavigate('TODAY');
        };

        const label = () => {
            const date = moment(toolbar.date);
            return (
                <span className="text-lg font-semibold text-gray-700">
                    {date.format('MMMM YYYY')}
                </span>
            );
        };

        return (
            <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <button
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                        onClick={goToBack}
                    >
                        Trước
                    </button>
                    <button
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                        onClick={goToCurrent}
                    >
                        Hôm nay
                    </button>
                    <button
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                        onClick={goToNext}
                    >
                        Sau
                    </button>
                </div>
                <div className="text-gray-900">{label()}</div>
                <div className="flex items-center space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md ${
                            toolbar.view === 'month' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => toolbar.onView('month')}
                    >
                        Tháng
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            toolbar.view === 'week' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => toolbar.onView('week')}
                    >
                        Tuần
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            toolbar.view === 'day' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => toolbar.onView('day')}
                    >
                        Ngày
                    </button>
                </div>
            </div>
        );
    };

    // Xử lý khi tạo cuộc hẹn mới
    const handleCreateAppointment = async () => {
        try {
            const response = await api.post('/appointments', {
                ...appointmentDetails,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end
            });

            if (response.status === 201) {
                setEvents([
                    ...events,
                    {
                        title: appointmentDetails.title,
                        start: selectedSlot.start,
                        end: selectedSlot.end,
                        ...appointmentDetails
                    }
                ]);
                toast.success('Đặt lịch hẹn thành công!');
                setShowModal(false);
            }
        } catch (error) {
            toast.error('Đặt lịch hẹn thất bại: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Header />
            <div className="container mx-auto p-4 pt-20">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center mb-6">
                        <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                        <h1 className="text-3xl font-bold text-black">Đặt Lịch Hẹn</h1>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center text-black mb-4">
                            <FaClipboardList className="text-blue-500 mr-2" />
                            <span className="font-medium">Hướng dẫn:</span>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-6">
                            <li>Chọn một khoảng thời gian trên lịch để đặt hẹn</li>
                            <li>Điền đầy đủ thông tin trong form đặt lịch</li>
                            <li>Xác nhận thông tin và hoàn tất đặt lịch</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-inner p-4">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            selectable
                            onSelectSlot={handleSelect}
                            step={30}
                            timeslots={2}
                            defaultView="week"
                            view={view}
                            date={date}
                            onView={handleViewChange}
                            onNavigate={handleNavigate}
                            min={minTime}
                            max={maxTime}
                            className="text-black"
                            components={{
                                toolbar: CustomToolbar
                            }}
                            dayPropGetter={date => {
                                const now = new Date();
                                now.setHours(0, 0, 0, 0);
                                if (date < now) {
                                    return {
                                        style: {
                                            backgroundColor: '#f0f0f0',
                                            cursor: 'not-allowed'
                                        }
                                    };
                                }
                            }}
                            slotPropGetter={date => {
                                const now = new Date();
                                if (date < now) {
                                    return {
                                        style: {
                                            backgroundColor: '#f0f0f0',
                                            cursor: 'not-allowed'
                                        }
                                    };
                                }
                            }}
                            views={['month', 'week', 'day']}
                        />
                    </div>
                </div>

                {/* Modal đặt lịch */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg w-[500px] shadow-xl">
                            <div className="flex items-center mb-6">
                                <FaClock className="text-blue-500 text-xl mr-3" />
                                <h2 className="text-2xl font-bold text-black">Chi Tiết Lịch Hẹn</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thời gian đã chọn
                                    </label>
                                    <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                                        <p>Bắt đầu: {moment(selectedSlot.start).format('DD/MM/YYYY HH:mm')}</p>
                                        <p>Kết thúc: {moment(selectedSlot.end).format('DD/MM/YYYY HH:mm')}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề cuộc hẹn
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder="Nhập tiêu đề cuộc hẹn"
                                        value={appointmentDetails.title}
                                        onChange={(e) => setAppointmentDetails({
                                            ...appointmentDetails,
                                            title: e.target.value
                                        })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả chi tiết
                                    </label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        rows="4"
                                        placeholder="Nhập mô tả chi tiết về cuộc hẹn"
                                        value={appointmentDetails.description}
                                        onChange={(e) => setAppointmentDetails({
                                            ...appointmentDetails,
                                            description: e.target.value
                                        })}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                        onClick={handleCreateAppointment}
                                    >
                                        Xác nhận đặt lịch
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AppointmentWithDoctor;
