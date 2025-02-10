export const Projects = () => {
    return (
        <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="py-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Dự án của chúng tôi
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Project Card 1 */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Dự án 1</h3>
                            <p className="text-gray-400">Mô tả chi tiết về dự án 1</p>
                        </div>
                    </div>

                    {/* Project Card 2 */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Dự án 2</h3>
                            <p className="text-gray-400">Mô tả chi tiết về dự án 2</p>
                        </div>
                    </div>

                    {/* Project Card 3 */}
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Dự án 3</h3>
                            <p className="text-gray-400">Mô tả chi tiết về dự án 3</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 