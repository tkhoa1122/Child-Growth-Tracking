import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Utils/Axios';
import { FaKey, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordForUser = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', content: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', content: 'Mật khẩu mới và xác nhận không khớp' });
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(`/User/change-password/${accountId}`, formData);
            
            if (response.status === 200) {
                setMessage({ 
                    type: 'success', 
                    content: 'Đổi mật khẩu thành công!'
                });
                setTimeout(() => navigate('/profile'), 2000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.title || 'Lỗi khi đổi mật khẩu';
            setMessage({ type: 'error', content: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <FaKey className="text-blue-500" />
                    Đổi mật khẩu
                </h2>

                {message.content && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                        message.type === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {message.type === 'success' 
                            ? <FaCheckCircle /> 
                            : <FaTimesCircle />}
                        {message.content}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu cũ
                        </label>
                        <input
                            type={showPassword.old ? "text" : "password"}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-10"
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({...prev, old: !prev.old}))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu mới
                        </label>
                        <input
                            type={showPassword.new ? "text" : "password"}
                            required
                            minLength="6"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-10"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({...prev, new: !prev.new}))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type={showPassword.confirm ? "text" : "password"}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black pr-10"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({...prev, confirm: !prev.confirm}))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordForUser;
