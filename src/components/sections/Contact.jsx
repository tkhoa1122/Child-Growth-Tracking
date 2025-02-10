export const Contact = () => {
    return (
        <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="py-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Liên Hệ
                </h1>
                <div className="max-w-2xl mx-auto">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Họ và tên</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                placeholder="Nhập họ và tên của bạn"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Tin nhắn</label>
                            <textarea 
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                rows="4"
                                placeholder="Nhập tin nhắn của bạn"
                            ></textarea>
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Gửi tin nhắn
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
