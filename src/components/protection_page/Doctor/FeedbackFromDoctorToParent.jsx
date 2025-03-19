import React, { useEffect, useState } from 'react';
import axios from '../../Utils/Axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import { toast } from 'react-toastify';

const FeedbackFromDoctorToParent = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [responseContent, setResponseContent] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
                console.log("User ID từ localStorage:", storedUserId);
                fetchDoctorInfo(storedUserId);
            } else {
                console.error('Không tìm thấy userId trong localStorage.');
                navigate('/login');
            }
        } else {
            console.error('Người dùng chưa được xác thực. Vui lòng đăng nhập.');
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const fetchFeedbacks = async (doctorId) => {
        try {
            const response = await axios.get(`/feedback/get-list-feedback-by-doctorId/${doctorId}`);
            if (Array.isArray(response.data)) {
                setFeedbacks(response.data);
            } else {
                console.error('Dữ liệu không phải là một mảng:', response.data);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const fetchDoctorInfo = async (userId) => {
        console.log("Fetching doctor info for userId:", userId);
        try {
            const response = await axios.get(`/Doctor/${userId}`);
            setDoctorInfo(response.data);
            fetchFeedbacks(response.data.doctorId);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin bác sĩ:', error);
        }
    };

    const handleRowClick = (feedback) => {
        if (!feedback.feedbackContentResponse || feedback.feedbackContentResponse === 'string') {
            setSelectedFeedback(feedback);
            setResponseContent(feedback.feedbackContentResponse || '');
        }
    };

    const handleUpdateFeedback = async () => {
        if (!selectedFeedback) return;

        try {
            const response = await axios.put(`/feedback/update-feedback/${selectedFeedback.feedbackId}`, {
                feedbackContentResponse: responseContent
            });

            if (response.status === 200) {
                toast.success('Cập nhật phản hồi thành công!');
                fetchFeedbacks(doctorInfo.doctorId);
                setSelectedFeedback(null);
            }
        } catch (error) {
            toast.error('Lỗi khi cập nhật phản hồi: ' + error.message);
        }
    };

    return (
        <DoctorLayout>
            <div className="container mx-auto mt-10 p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Danh sách phản hồi từ bác sĩ</h1>
                {userId && <p className="text-center text-gray-600">User ID: {userId}</p>}
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
                    <table className="w-full max-w-none border-collapse border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-3 px-4 border-b text-left">STT</th>
                                <th className="py-3 px-4 border-b text-left w-40">Ngày tạo</th>
                                <th className="py-3 px-4 border-b text-left w-35">Feedback ID</th>
                                <th className="py-3 px-4 border-b text-left w-110">Nội dung yêu cầu</th>
                                <th className="py-3 px-4 border-b text-left w-100">Tên phản hồi</th>
                                <th className="py-3 px-4 border-b text-left w-30">Chiều cao</th>
                                <th className="py-3 px-4 border-b text-left w-30">Cân nặng</th>
                                <th className="py-3 px-4 border-b text-left">BMI</th>
                                <th className="py-3 px-4 border-b text-left w-70">Nội dung phản hồi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.length > 0 ? (
                                feedbacks
                                    .filter(feedback => !feedback.feedbackContentResponse || feedback.feedbackContentResponse === 'string')
                                    .map((feedback, index) => (
                                        <tr key={feedback.feedbackId} className="hover:bg-blue-100 transition duration-200 cursor-pointer" onClick={() => handleRowClick(feedback)}>
                                            <td className="py-3 px-4 border-b text-gray-700">{index + 1}</td>
                                            <td className="py-3 px-4 border-b text-gray-700">
                                                {new Date(feedback.feedbackCreateDate).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }).replace(/\//g, '-')}
                                            </td>
                                            <td className="py-3 px-4 border-b text-gray-700">
                                                {feedback.feedbackId.length > 8 ? feedback.feedbackId.slice(0, 8) + "..." : feedback.feedbackId}
                                            </td>
                                            <td className="py-3 px-4 border-b text-gray-700">{feedback.feedbackContentRequest}</td>
                                            <td className="py-3 px-4 border-b text-gray-700">{feedback.feedbackName}</td>
                                            <td className="py-3 px-4 border-b text-gray-700">{feedback.report.height} cm</td>
                                            <td className="py-3 px-4 border-b text-gray-700">{feedback.report.weight} kg</td>
                                            <td className="py-3 px-4 border-b text-gray-700">{feedback.report.bmi.toFixed(1)}</td>
                                            <td className="py-3 px-4 border-b text-gray-700">
                                                {feedback.feedbackContentResponse && feedback.feedbackContentResponse !== 'string'
                                                    ? feedback.feedbackContentResponse
                                                    : 'Chờ phản hồi từ bác sĩ'}
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4 text-gray-500">Không có phản hồi nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedFeedback && (
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg text-gray-500">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa phản hồi</h2>
                        <textarea
                            className="w-full p-3 border rounded-lg"
                            rows="4"
                            value={responseContent}
                            onChange={(e) => setResponseContent(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                                onClick={handleUpdateFeedback}
                            >
                                Cập nhật
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                                onClick={() => setSelectedFeedback(null)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default FeedbackFromDoctorToParent;
