import { FaStar, FaEdit } from 'react-icons/fa';
import { DoctorLayout } from '../../layouts/DoctorLayout';

const DoctorDashboard = () => {
    const doctorInfo = {
        name: "Dr. Jackson Santos",
        specialty: "Dermatologist",
        hospital: "Texas Hospital",
        rating: 4.8,
        totalReviews: 256,
        experience: "15 years",
        email: "dr.jackson@hospital.com",
        phone: "+1 234 567 890",
        address: "123 Medical Center, Texas",
        education: "MD - Dermatology, Texas Medical University",
        certifications: ["Board Certified in Dermatology", "Advanced Pediatric Care"],
        bio: "Specialized in pediatric dermatology with 15 years of experience in treating various skin conditions in children."
    };

    return (
        <DoctorLayout>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-8">
                    {/* Avatar and Rating */}
                    <div className="w-1/3">
                        <div className="relative">
                            <img
                                src="/Images/avatar.jpg"
                                alt="Doctor"
                                className="w-full h-auto max-h-64 object-contain rounded-lg shadow"
                            />
                            <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                <FaEdit className="text-gray-600" />
                            </button>
                        </div>
                        <div className="mt-4 bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-center gap-2">
                                <FaStar className="text-yellow-400 text-xl" />
                                <span className="text-2xl font-bold">{doctorInfo.rating}</span>
                                <span className="text-gray-500">({doctorInfo.totalReviews} đánh giá)</span>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="w-2/3">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{doctorInfo.name}</h2>
                                <p className="text-gray-600">{doctorInfo.specialty} at {doctorInfo.hospital}</p>
                            </div>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Cập nhật thông tin
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Thông tin liên hệ</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><span className="font-medium">Email:</span> {doctorInfo.email}</p>
                                    <p><span className="font-medium">Điện thoại:</span> {doctorInfo.phone}</p>
                                    <p><span className="font-medium">Địa chỉ:</span> {doctorInfo.address}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Chuyên môn</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><span className="font-medium">Kinh nghiệm:</span> {doctorInfo.experience}</p>
                                    <p><span className="font-medium">Học vấn:</span> {doctorInfo.education}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Chứng chỉ</h3>
                            <div className="flex flex-wrap gap-2">
                                {doctorInfo.certifications.map((cert, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Giới thiệu</h3>
                            <p className="text-gray-600">{doctorInfo.bio}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboard;