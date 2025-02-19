import { DoctorLayout } from '../../layouts/DoctorLayout';
import { FaStar, FaReply } from 'react-icons/fa';

const FeedbackManagement = () => {
    const feedbacks = [
        {
            id: 1,
            patientName: "Sarah Johnson",
            rating: 5,
            date: "2024-03-15",
            comment: "Bác sĩ rất tận tâm và chuyên nghiệp. Con tôi rất thích bác sĩ.",
            response: "",
            status: "Pending"
        },
        {
            id: 2,
            patientName: "Michael Lee",
            rating: 4,
            date: "2024-03-14",
            comment: "Tư vấn rất chi tiết và dễ hiểu. Tuy nhiên thời gian chờ hơi lâu.",
            response: "Cảm ơn bạn đã góp ý. Chúng tôi sẽ cải thiện thời gian chờ đợi trong thời gian tới.",
            status: "Responded"
        },
        // Thêm các feedback khác
    ];

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
                        <div key={feedback.id} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{feedback.patientName}</h3>
                                    <p className="text-gray-500 text-sm">{feedback.date}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={i < feedback.rating ? "text-yellow-400" : "text-gray-300"} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">{feedback.comment}</p>
                            
                            {feedback.response ? (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-blue-800">
                                        <span className="font-semibold">Phản hồi của bạn:</span> {feedback.response}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập phản hồi của bạn..."
                                        className="flex-1 p-2 border rounded-lg"
                                    />
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                                        <FaReply />
                                        Gửi phản hồi
                                    </button>
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