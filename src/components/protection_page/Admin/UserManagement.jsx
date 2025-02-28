import { useState, useEffect } from 'react';
import { useAuth } from '../../Utils/AuthContext';
import api from '../../Utils/Axios';

const UserManagement = () => {
    const { userRole } = useAuth();
    const [users, setUsers] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState({
        users: true,
        children: true
    });
    const [error, setError] = useState(null);

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
        return new Date(dateString).toLocaleDateString('vi-VN', options);
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

    if (loading.users || loading.children) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-12">
            {/* User Management Table */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black">User Management</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Orders</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user, index) => (
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
                                        {user.serviceOrders?.length || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Children Management Table */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black">Children Management</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['STT', 'Parent ID', 'Child ID', 'Image', 'First Name', 
                                'Last Name', 'Gender', 'Date Of Birth', 'Create Time', 
                                'Update Time', 'Action'].map((header, idx) => (
                                    <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {children.map((child, index) => (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.gender}</td>
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
                                            onClick={() => handleDeleteChild(child.childId)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
