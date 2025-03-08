import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { DatePicker } from 'antd';

const Profile = () => {
    const { accountId } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [childrenLoading, setChildrenLoading] = useState(true);
    const [serviceOrder, setServiceOrder] = useState(null);
    const [serviceOrderLoading, setServiceOrderLoading] = useState(true);
    const [showCreateChildForm, setShowCreateChildForm] = useState(false);
    const [newChild, setNewChild] = useState({
        firstName: '',
        lastName: '',
        gender: 'Female',
        dob: moment(),
        imageUrl: 'string'
    });
    const [creatingChild, setCreatingChild] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [editChildData, setEditChildData] = useState({
        firstName: '',
        lastName: '',
        gender: 'Female',
        dob: moment()
    });
    const [editingChild, setEditingChild] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile data
                const profileResponse = await api.get(`/Parent/by-accountId/${accountId}`);
                setProfileData(profileResponse.data);

                // Fetch children data
                if (profileResponse.data.parentId) {
                    const childrenResponse = await api.get(`/Parent/parents/${profileResponse.data.parentId}/children`);
                    setChildren(childrenResponse.data);
                }

                // Fetch service order
                if (profileResponse.data.parentId) {
                    const orderResponse = await api.get(`/serviceorder/GetLastestOrderByParentId/${profileResponse.data.parentId}`);
                    setServiceOrder(orderResponse.data);
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
            } finally {
                setLoading(false);
                setChildrenLoading(false);
                setServiceOrderLoading(false);
            }
        };

        fetchData();
    }, [accountId]);

    // Thêm hàm kiểm tra tuổi
    const disabledDate = (current) => {
        const today = moment();
        const minAgeDate = today.clone().subtract(18, 'years');
        const maxAgeDate = today.clone().subtract(1, 'year');
        return current > today || current < minAgeDate || current > maxAgeDate;
    };

    // Hàm xử lý tạo trẻ mới
    const handleCreateChild = async () => {
        try {
            setCreatingChild(true);
            const response = await api.post('/Parent/children', {
                parentId: profileData.parentId,
                ...newChild,
                dob: newChild.dob.format('YYYY-MM-DD')
            });

            if (response.status === 201) {
                toast.success('Tạo hồ sơ trẻ thành công!');
                // Làm mới danh sách
                const childrenResponse = await api.get(`/Parent/parents/${profileData.parentId}/children`);
                setChildren(childrenResponse.data);
                setShowCreateChildForm(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tạo hồ sơ thất bại');
        } finally {
            setCreatingChild(false);
        }
    };

    // Hàm xử lý khi click vào card trẻ
    const handleSelectChild = (child) => {
        setSelectedChild(child);
        setEditChildData({
            firstName: child.firstName,
            lastName: child.lastName,
            gender: child.gender,
            dob: moment(child.dob)
        });
    };

    // Hàm xử lý cập nhật thông tin
    const handleEditChild = async () => {
        try {
            setEditingChild(true);
            const response = await api.put(`/Parent/children/${selectedChild.childId}`, {
                ...editChildData,
                childId: selectedChild.childId,
                parentId: profileData.parentId,
                imageUrl: 'string',
                dob: editChildData.dob.format('YYYY-MM-DD')
            });

            if (response.status === 200) {
                toast.success('Cập nhật thông tin thành công!');
                // Làm mới danh sách trẻ
                const childrenResponse = await api.get(`/Parent/parents/${profileData.parentId}/children`);
                setChildren(childrenResponse.data);
                setSelectedChild(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setEditingChild(false);
        }
    };

    // Hàm xử lý tải lại danh sách trẻ
    const handleRefreshChildren = async () => {
        setChildrenLoading(true);
        try {
            const response = await api.get(`/Parent/parents/${profileData.parentId}/children`);
            setChildren(response.data);
            toast.success('Đã cập nhật danh sách trẻ');
        } catch (error) {
            toast.error('Tải lại thất bại');
            console.error('Lỗi tải danh sách trẻ:', error);
        } finally {
            setChildrenLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <div className="container mx-auto p-4 text-black">
                <Header />
                <h1 className="text-2xl font-bold mb-4 text-black">Thông tin hồ sơ</h1>
                
                {/* Thông tin cơ bản */}
                <div className="bg-white rounded-lg shadow p-6 mb-4 text-black">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Thông tin tài khoản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-gray-900">Họ và tên:</p>
                            <p className="text-gray-800">{profileData.account.firstName} {profileData.account.lastName}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Email:</p>
                            <p className="text-gray-800">{profileData.account.email}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Số điện thoại:</p>
                            <p className="text-gray-800">{profileData.account.phoneNumber}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Địa chỉ:</p>
                            <p className="text-gray-800">{profileData.account.address}</p>
                        </div>
                    </div>
                </div>

                {/* Thông tin khác */}
                <div className="bg-white rounded-lg shadow p-6 text-black">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Thông tin bổ sung</h2>
                    <div className="space-y-2">
                        <p className="text-gray-800 ">
                            <span className="font-medium text-gray-900">Account ID:</span> {profileData.accountId}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-medium text-gray-900">Parent ID:</span> {profileData.parentId}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-medium text-gray-900">Vai trò:</span> {profileData.account.role === 1 ? 'Parent' : 'Khác'}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-medium text-gray-900">Ngày tạo:</span> {new Date(profileData.account.dateCreateAt).toLocaleDateString()}
                        </p>
                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-medium text-gray-900">Service Orders:</p>
                                <div className="space-x-2">
                                    <Link 
                                        to="/buy-service" 
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Buy Order
                                    </Link>
                                    <Link 
                                        to={`/history-orders/${profileData.parentId}`} 
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        History Order
                                    </Link>
                                </div>
                            </div>
                            
                            {serviceOrderLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : serviceOrder ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buy Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 text-sm text-gray-900">{serviceOrder.serviceOrderId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{serviceOrder.serviceId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', { 
                                                        style: 'currency', 
                                                        currency: 'VND' 
                                                    }).format(serviceOrder.totalPrice)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {new Date(serviceOrder.createDate).toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }).split('/').join('-')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {new Date(serviceOrder.endDate).toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }).split('/').join('-')}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600">Không có service orders</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Quản lý trẻ em */}
                <div className="bg-white rounded-lg shadow p-6 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Quản lý trẻ em</h2>
                        <div className="space-x-2">
                            <button
                                onClick={handleRefreshChildren}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
                            >
                                Tải lại
                            </button>
                            <Link
                                to={`/appointment/${accountId}`}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Đặt Lịch
                            </Link>
                            <button
                                onClick={() => setShowCreateChildForm(!showCreateChildForm)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Tạo hồ sơ trẻ
                            </button>
                        </div>
                    </div>

                    {showCreateChildForm && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-medium mb-4">Thông tin trẻ mới</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Họ</label>
                                    <input
                                        type="text"
                                        value={newChild.lastName}
                                        onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên</label>
                                    <input
                                        type="text"
                                        value={newChild.firstName}
                                        onChange={(e) => setNewChild({...newChild, firstName: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giới tính</label>
                                    <select
                                        value={newChild.gender}
                                        onChange={(e) => setNewChild({...newChild, gender: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="Female">Nữ</option>
                                        <option value="Male">Nam</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={newChild.dob}
                                        onChange={(date) => setNewChild({...newChild, dob: date})}
                                        className="w-full"
                                        disabledDate={disabledDate}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setShowCreateChildForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleCreateChild}
                                    disabled={!newChild.firstName || !newChild.lastName || creatingChild}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {creatingChild ? 'Đang tạo...' : 'Tạo hồ sơ'}
                                </button>
                            </div>
                        </div>
                    )}

                    

                    {childrenLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : children.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {children.map((child) => (
                                <div
                                    key={child.childId}
                                    className={`bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                        selectedChild?.childId === child.childId ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSelectChild(child);
                                    }}
                                    onDoubleClick={() => navigate(`/child/${child.childId}/parent/${profileData.parentId}`)}
                                >
                                    <div className="flex items-center justify-center mb-4">
                                        <img 
                                            src={child.gender === 'Female' 
                                                ? '/Images/girl.png' 
                                                : '/Images/boy.png'} 
                                            alt="Child" 
                                            className="h-30 w-30 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/Images/default-child.png';
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-medium text-gray-900">
                                            {child.firstName} {child.lastName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">ID:</span> 
                                            <span className="text-gray-600 ml-1">{child.childId}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Giới tính:</span> 
                                            <span className="text-gray-600 ml-1">{child.gender}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Ngày sinh:</span> 
                                            <span className="text-gray-600 ml-1">
                                                {new Date(child.dob).toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 italic">Chưa có trẻ em nào được đăng ký</p>
                    )}

{selectedChild && (
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <h3 className="text-lg font-medium mb-4">Chỉnh sửa thông tin trẻ</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Họ</label>
                                    <input
                                        type="text"
                                        value={editChildData.lastName}
                                        onChange={(e) => setEditChildData({...editChildData, lastName: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên</label>
                                    <input
                                        type="text"
                                        value={editChildData.firstName}
                                        onChange={(e) => setEditChildData({...editChildData, firstName: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giới tính</label>
                                    <select
                                        value={editChildData.gender}
                                        onChange={(e) => setEditChildData({...editChildData, gender: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="Female">Nữ</option>
                                        <option value="Male">Nam</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={editChildData.dob}
                                        onChange={(date) => setEditChildData({...editChildData, dob: date})}
                                        className="w-full"
                                        disabledDate={disabledDate}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setSelectedChild(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleEditChild}
                                    disabled={!editChildData.firstName || !editChildData.lastName || editingChild}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {editingChild ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </div>
                    )}



                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Profile;