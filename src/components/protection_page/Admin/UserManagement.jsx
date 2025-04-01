import { useState, useEffect } from 'react';
import { useAuth } from '../../Utils/AuthContext';
import api from '../../Utils/Axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const { userRole } = useAuth();
    const [users, setUsers] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState({
        users: true,
        children: true
    });
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        gender: '',
        dobSort: '',
        ageGroup: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const userItemsPerPage = 5;
    const [selectedChildReports, setSelectedChildReports] = useState([]);
    const [showReportSection, setShowReportSection] = useState(false);
    const [reportCurrentPage, setReportCurrentPage] = useState(1);
    const reportItemsPerPage = 9;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch parents data
                const parentsResponse = await api.get('/Manager/parents');
                setUsers(parentsResponse.data);

                // Fetch children data
                const childrenResponse = await api.get('/Manager/children');
                setChildren(childrenResponse.data);

                setLoading({ users: false, children: false });
            } catch (err) {
                setError(err.message);
                setLoading({ users: false, children: false });
            }
        };

        if (userRole === 'Manager') {
            fetchData();
        }
    }, [userRole]);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options).replace(/\//g, ' - ');
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDeleteChild = async (childId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa trẻ này?')) return;

        try {
            const response = await api.delete(`/Manager/children/${childId}`);
            if (response.status === 200) {
                // Cập nhật lại danh sách children
                setChildren(prev => prev.filter(child => child.childId !== childId));
                alert('Xóa thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            alert('Xóa thất bại: ' + error.message);
        }
    };

    const checkAgeGroup = (age, group) => {
        switch (group) {
            case 'toddler': return age >= 1 && age <= 5;
            case 'kids': return age > 5 && age <= 13;
            case 'teen': return age > 13 && age <= 18;
            default: return true;
        }
    };

    const filteredChildren = children
        .filter(child => {
            const age = calculateAge(child.dob);
            return (
                (!filters.gender || child.gender === filters.gender) &&
                checkAgeGroup(age, filters.ageGroup)
            );
        })
        .sort((a, b) => {
            if (filters.dobSort === 'asc') {
                return new Date(a.dob) - new Date(b.dob);
            }
            if (filters.dobSort === 'desc') {
                return new Date(b.dob) - new Date(a.dob);
            }
            return 0;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentChildren = filteredChildren.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const userIndexOfLastItem = userCurrentPage * userItemsPerPage;
    const userIndexOfFirstItem = userIndexOfLastItem - userItemsPerPage;
    const currentUsers = users.slice(userIndexOfFirstItem, userIndexOfLastItem);

    const userTotalPages = Math.ceil(users.length / userItemsPerPage);

    const handleUserPageChange = (pageNumber) => {
        setUserCurrentPage(pageNumber);
    };

    const reportIndexOfLastItem = reportCurrentPage * reportItemsPerPage;
    const reportIndexOfFirstItem = reportIndexOfLastItem - reportItemsPerPage;
    const currentReports = selectedChildReports.slice(reportIndexOfFirstItem, reportIndexOfLastItem);

    const reportTotalPages = Math.ceil(selectedChildReports.length / reportItemsPerPage);

    const handleReportPageChange = (pageNumber) => {
        setReportCurrentPage(pageNumber);
    };

    const handleCheckReport = async (childId) => {
        try {
            const response = await api.get(`/reports/${childId}`);
            if (response.status === 200) {
                setSelectedChildReports(response.data);
                setShowReportSection(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('Trẻ chưa có báo cáo');
            } else {
                toast.error(error.response?.data?.message || 'Đã xảy ra lỗi');
            }
        }
    };

    if (loading.users || loading.children) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-12">
            {/* User Management Table */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black">Quản lý danh sách người dùng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avartar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã tài khoản</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã cha mẹ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên phụ huynh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden">Dịch vụ đã mua</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user, index) => (
                                <tr key={user.parentId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <img
                                            src="/Images/avatar.jpg"
                                            alt="User avatar"
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.accountId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.parentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.account ? `${user.account.firstName} ${user.account.lastName}` : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden">
                                        {user.serviceOrders?.length || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination for User Management */}
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handleUserPageChange(1)}
                            disabled={userCurrentPage === 1}
                            className={`px-3 py-1 rounded-l-md ${
                                userCurrentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border border-gray-300 focus:outline-none`}
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handleUserPageChange(userCurrentPage - 1)}
                            disabled={userCurrentPage === 1}
                            className={`px-3 py-1 ${
                                userCurrentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border-t border-b border-gray-300 focus:outline-none`}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: userTotalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handleUserPageChange(i + 1)}
                                className={`px-3 py-1 ${
                                    userCurrentPage === i + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                } border-t border-b border-gray-300 focus:outline-none`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handleUserPageChange(userCurrentPage + 1)}
                            disabled={userCurrentPage === userTotalPages}
                            className={`px-3 py-1 ${
                                userCurrentPage === userTotalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border-t border-b border-gray-300 focus:outline-none`}
                        >
                            &gt;
                        </button>
                        <button
                            onClick={() => handleUserPageChange(userTotalPages)}
                            disabled={userCurrentPage === userTotalPages}
                            className={`px-3 py-1 rounded-r-md ${
                                userCurrentPage === userTotalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border border-gray-300 focus:outline-none`}
                        >
                            &gt;&gt;
                        </button>
                    </nav>
                </div>
            </div>

            {/* Children Management Table */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-black">Quản lý danh sách trẻ</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Gender Filter */}
                        <select
                            className="px-4 py-2 border rounded-lg text-black"
                            value={filters.gender}
                            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                        >
                            <option value="">Tất cả giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </select>

                        {/* Age Group Filter */}
                        <select
                            className="px-3 py-2 border rounded-lg text-sm text-black"
                            value={filters.ageGroup}
                            onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
                        >
                            <option value="">Tất cả độ tuổi</option>
                            <option value="toddler">Trẻ mới biết đi (1-5 tuổi)</option>
                            <option value="kids">Trẻ em (6-13 tuổi)</option>
                            <option value="teen">Vị thành niên (13-18 tuổi)</option>
                        </select>

                        {/* Date of Birth Sort */}
                        <select
                            className="px-4 py-2 border rounded-lg text-black"
                            value={filters.dobSort}
                            onChange={(e) => setFilters(prev => ({ ...prev, dobSort: e.target.value }))}
                        >
                            <option value="">Sắp xếp ngày sinh</option>
                            <option value="asc">Cũ nhất → Mới nhất</option>
                            <option value="desc">Mới nhất → Cũ nhất</option>
                        </select>

                        <button
                            onClick={() => setFilters({
                                gender: '',
                                dobSort: '',
                                ageGroup: ''
                            })}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Khôi phục bộ lọc
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['STT', 'Mã cha mẹ', 'Mã trẻ', 'Avatar', 'Tên',
                                    'Họ', 'Giới tính', 'Tuổi', 'Ngày tháng năm sinh', 'TG tạo thông tin',
                                    'TG chỉnh sửa thông tin', 'Tiện ích'].map((header, idx) => (
                                        <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            {header}
                                        </th>
                                    ))}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentChildren.map((child, index) => (
                                <tr key={child.childId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.parentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.childId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <img
                                            src={child.gender === 'Female'
                                                ? '/Images/girl.png'
                                                : '/Images/boy.png'}
                                            alt="Child"
                                            className="h-12 w-12 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/Images/default-child.png';
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.gender == 'Female' ? 'Nữ' : 'Nam'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {calculateAge(child.dob)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(child.dob)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(child.dateCreateAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(child.dateUpdateAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button
                                            onClick={() => handleCheckReport(child.childId)}
                                            className="px-4 py-2 mr-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Kiểm tra báo cáo SK
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChild(child.childId)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-200 transition-colors duration-200"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-l-md ${
                                currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border border-gray-300 focus:outline-none`}
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 ${
                                currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border-t border-b border-gray-300 focus:outline-none`}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 ${
                                    currentPage === i + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                } border-t border-b border-gray-300 focus:outline-none`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border-t border-b border-gray-300 focus:outline-none`}
                        >
                            &gt;
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-r-md ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                            } border border-gray-300 focus:outline-none`}
                        >
                            &gt;&gt;
                        </button>
                    </nav>
                </div>
            </div>

            {/* Report Management By Child Id */}
            {showReportSection && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-green-500">Báo cáo theo mã của trẻ</h3>
                        <button
                            onClick={() => setShowReportSection(false)}
                            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 transition-colors"
                        >
                            Đã xem báo cáo
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentReports.map(report => (
                            <div key={report.reportId} className="bg-white rounded-lg p-4 shadow-lg">
                                <p className="text-m text-gray-700">Chiều cao: <span className="font-medium">{report.height} cm</span></p>
                                <p className="text-m text-gray-700">Cân nặng: <span className="font-medium">{report.weight} kg</span></p>
                                <p className="text-m text-gray-700">BMI: <span className="font-medium">{report.bmi.toFixed(2)}</span></p>
                                <p className="text-m text-gray-700">Đánh giá: <span className="font-medium">{report.reportMark}</span></p>
                                <p className="text-m text-gray-700">Nội dung: <span className="font-medium">{report.reportContent}</span></p>
                                <p className="text-m text-gray-700">Ngày tạo: <span className="font-medium">{moment(report.reportCreateDate).format('DD-MM-YYYY')}</span></p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination for Reports */}
                    <div className="flex justify-center mt-4">
                        <nav className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => handleReportPageChange(1)}
                                disabled={reportCurrentPage === 1}
                                className={`px-3 py-1 rounded-l-md ${
                                    reportCurrentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                } border border-gray-300 focus:outline-none`}
                            >
                                &lt;&lt;
                            </button>
                            <button
                                onClick={() => handleReportPageChange(reportCurrentPage - 1)}
                                disabled={reportCurrentPage === 1}
                                className={`px-3 py-1 ${
                                    reportCurrentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                } border-t border-b border-gray-300 focus:outline-none`}
                            >
                                &lt;
                            </button>
                            {Array.from({ length: reportTotalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handleReportPageChange(i + 1)}
                                    className={`px-3 py-1 ${
                                        reportCurrentPage === i + 1
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-blue-500 hover:bg-blue-50'
                                    } border-t border-b border-gray-300 focus:outline-none`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handleReportPageChange(reportCurrentPage + 1)}
                                disabled={reportCurrentPage === reportTotalPages}
                                className={`px-3 py-1 ${
                                    reportCurrentPage === reportTotalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                } border-t border-b border-gray-300 focus:outline-none`}
                            >
                                &gt;
                            </button>
                            <button
                                onClick={() => handleReportPageChange(reportTotalPages)}
                                disabled={reportCurrentPage === reportTotalPages}
                                className={`px-3 py-1 rounded-r-md ${
                                    reportCurrentPage === reportTotalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                } border border-gray-300 focus:outline-none`}
                            >
                                &gt;&gt;
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
