import { useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import backgroundImage from '../../assets/background.jpg';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic gửi form
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow bg-gray-50 pt-9">
                {/* Hero Section */}
                <section 
                    className="relative pt-32 pb-20 px-4"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative z-10 max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            Liên Hệ Với Chúng Tôi
                        </h1>
                        <p className="text-xl text-gray-200 max-w-4xl mx-auto">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. 
                            Hãy liên hệ ngay để được tư vấn chi tiết.
                        </p>
                    </div>
                </section>

                {/* Contact Info & Form Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-xl shadow-lg">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                        Thông Tin Liên Hệ
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <FaMapMarkerAlt className="text-blue-500 text-2xl mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Địa Chỉ</h3>
                                                <p className="text-gray-600">
                                                    123 Đường ABC, Quận XYZ<br />
                                                    TP. Hồ Chí Minh, Việt Nam
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <FaPhone className="text-blue-500 text-2xl mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Điện Thoại</h3>
                                                <p className="text-gray-600">
                                                    Hotline: (84) 123 456 789<br />
                                                    Support: (84) 987 654 321
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <FaEnvelope className="text-blue-500 text-2xl mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Email</h3>
                                                <p className="text-gray-600">
                                                    info@thonglnse.tech<br />
                                                    support@thonglnse.tech
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <FaClock className="text-blue-500 text-2xl mt-1" />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Giờ Làm Việc</h3>
                                                <p className="text-gray-600">
                                                    Thứ 2 - Thứ 6: 8:00 - 17:00<br />
                                                    Thứ 7: 8:00 - 12:00
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="bg-white p-8 rounded-xl shadow-lg">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                        Kết Nối Với Chúng Tôi
                                    </h2>
                                    <div className="flex space-x-6">
                                        <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                                            <FaFacebook size={32} />
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors">
                                            <FaTwitter size={32} />
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors">
                                            <FaLinkedin size={32} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-white p-8 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                    Gửi Tin Nhắn
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                            placeholder="Nhập họ và tên của bạn"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                            placeholder="Nhập tiêu đề"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Nội dung tin nhắn
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                                            placeholder="Nhập nội dung tin nhắn của bạn"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                    >
                                        Gửi Tin Nhắn
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
                            Vị Trí Của Chúng Tôi
                        </h2>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69765661533454!3d10.778789792319489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xc4b3b6340b710c99!2sIndependence%20Palace!5e0!3m2!1sen!2s!4v1647856687503!5m2!1sen!2s"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                className="rounded-xl shadow-lg"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
