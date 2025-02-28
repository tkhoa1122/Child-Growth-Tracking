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
    const [filters, setFilters] = useState({
        gender: '',
        dobSort: '',
        ageGroup: ''
    });

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
        switch(group) {
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
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-black">Children Management</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Gender Filter */}
                        <select 
                            className="px-4 py-2 border rounded-lg text-black"
                            value={filters.gender}
                            onChange={(e) => setFilters(prev => ({...prev, gender: e.target.value}))}
                        >
                            <option value="">Tất cả giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </select>

                        {/* Age Group Filter */}
                        <select
                            className="px-3 py-2 border rounded-lg text-sm text-black"
                            value={filters.ageGroup}
                            onChange={(e) => setFilters({...filters, ageGroup: e.target.value})}
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
                            onChange={(e) => setFilters(prev => ({...prev, dobSort: e.target.value}))}
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
                            Reset Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['STT', 'Parent ID', 'Child ID', 'Image', 'First Name', 
                                'Last Name', 'Gender', 'Age', 'Date Of Birth', 'Create Time', 
                                'Update Time', 'Action'].map((header, idx) => (
                                    <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredChildren.map((child, index) => (
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
