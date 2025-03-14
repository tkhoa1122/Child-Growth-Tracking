import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import { FaStar, FaReply, FaArrowRight } from 'react-icons/fa';
import axios from '../../Utils/Axios';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const navigate = useNavigate();

    // Hàm lấy danh sách feedback
    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('feedback/get-list-feedback');
            // Lọc các feedback có feedbackIsActive là false
            const inactiveFeedbacks = response.data.result.filter(f => f.feedbackIsActive === false);
            setFeedbacks(inactiveFeedbacks);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Hàm chuyển hướng đến trang chi tiết tư vấn
    const handleViewConsultation = (childId) => {
        navigate(`/consultation-detail/${childId}`);
    };

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Quản lý đánh giá</h2>
                    <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-400" />
                        <span className="font-bold text-xl">4.8</span>
                        <span className="text-gray-500">(256 đánh giá)</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {feedbacks.map((feedback) => (
                        <div key={feedback.feedbackId} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{feedback.feedbackName}</h3>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(feedback.feedbackCreateDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleViewConsultation(feedback.report.childId)}
                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                                >
                                    <span>Xem chi tiết</span>
                                    <FaArrowRight />
                                </button>
                            </div>
                            <p className="text-gray-700 mb-4">{feedback.feedbackContentRequest}</p>
                            
                            {feedback.feedbackContentResponse && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-blue-800">
                                        <span className="font-semibold">Phản hồi của bạn:</span> {feedback.feedbackContentResponse}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default FeedbackManagement;