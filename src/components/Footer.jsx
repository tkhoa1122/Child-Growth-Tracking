import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-white text-lg font-bold mb-4">Về SWP_G3_P5.tech</h3>
                        <p className="text-sm leading-relaxed">
                            Chúng tôi là nền tảng chia sẻ kiến thức và kinh nghiệm về công nghệ, 
                            lập trình và phát triển phần mềm. Sứ mệnh của chúng tôi là đem đến 
                            giá trị cho cộng đồng IT Việt Nam.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-4 pt-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                               className="text-gray-400 hover:text-blue-500 transition-colors">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-pink-500 transition-colors">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-blue-600 transition-colors">
                                <FaLinkedin size={24} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-white transition-colors">
                                <FaGithub size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Liên Kết Nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                    Về Chúng Tôi
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                                    Dịch Vụ
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="text-gray-400 hover:text-white transition-colors">
                                    Dự Án
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Liên Hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Dịch Vụ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/web-development" className="text-gray-400 hover:text-white transition-colors">
                                    Phát Triển Web
                                </Link>
                            </li>
                            <li>
                                <Link to="/mobile-development" className="text-gray-400 hover:text-white transition-colors">
                                    Phát Triển Mobile
                                </Link>
                            </li>
                            <li>
                                <Link to="/ui-ux-design" className="text-gray-400 hover:text-white transition-colors">
                                    UI/UX Design
                                </Link>
                            </li>
                            <li>
                                <Link to="/consulting" className="text-gray-400 hover:text-white transition-colors">
                                    Tư Vấn Giải Pháp
                                </Link>
                            </li>
                            <li>
                                <Link to="/training" className="text-gray-400 hover:text-white transition-colors">
                                    Đào Tạo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Thông Tin Liên Hệ</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <span>123 Đường Dài, Huyện Ngắn, HCM</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-gray-400" />
                                <span>+84 123 456 789</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-gray-400" />
                                <span>thonglyngocse@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-gray-400" />
                                <span>childtrackingsys@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                {/* <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-white text-lg font-bold mb-4 text-center">Đăng Ký Nhận Tin</h3>
                        <form className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Đăng Ký
                            </button>
                        </form>
                    </div>
                </div> */}

                {/* Bottom Footer */}
                <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-400">
                            © {currentYear} Thonglnse.tech. All rights reserved.
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Chính Sách Bảo Mật
                            </Link>
                            <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Điều Khoản Sử Dụng
                            </Link>
                            <Link to="/sitemap" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
