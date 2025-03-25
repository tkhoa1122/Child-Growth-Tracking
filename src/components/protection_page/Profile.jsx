import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../Utils/Axios';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { toast, Toaster } from 'react-hot-toast';
import moment from 'moment';
import { DatePicker } from 'antd';

// Thêm hàm helper để format ngày
const formatDate = (date) => {
    return moment(date).format('DD-MM-YYYY');
};

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
    const [checkingRights, setCheckingRights] = useState(false);
    const [hasServiceRights, setHasServiceRights] = useState(false);
    const [deletingChild, setDeletingChild] = useState(false);
    const [latestOrder, setLatestOrder] = useState(null);
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

    // Thêm useEffect để kiểm tra quyền
    useEffect(() => {
        const fetchServiceRights = async () => {
            if (profileData?.parentId) {
                try {
                    setCheckingRights(true);
                    const response = await api.get(`/serviceorder/CheckServiceRights/${profileData.parentId}`);
                    setHasServiceRights(response.data.isValid);
                } catch (error) {
                    console.error('Lỗi kiểm tra quyền dịch vụ:', error);
                    toast.error('Không thể kiểm tra quyền đặt lịch');
                } finally {
                    setCheckingRights(false);
                }
            }
        };
        
        fetchServiceRights();
    }, [profileData?.parentId]);

    const fetchLatestOrder = async () => {
        try {
            const response = await api.get(`/serviceorder/GetLastestOrderByParentId/${profileData.parentId}`);
            if (response.data && response.data.status === 'Completed') {
                setLatestOrder(response.data);
            } else {
                setLatestOrder(null);
            }
        } catch (error) {
            console.error('Lỗi tải đơn hàng mới nhất:', error);
            setLatestOrder(null);
        }
    };

    useEffect(() => {
        if (profileData) {
            fetchLatestOrder();
        }
    }, [profileData]);

    // Sửa lại hàm kiểm tra ngày sinh
    const disabledDate = (current) => {
        if (!current) return false;
        
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 18; // 18 tuổi
        const maxYear = currentYear - 1;  // 1 tuổi
        const selectedYear = current.year();

        // Kiểm tra năm nằm trong khoảng cho phép
        return selectedYear < minYear || selectedYear > maxYear;
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

            if (response.status === 200) {
                toast.success('Tạo hồ sơ trẻ thành công!', {
                    duration: 3000, // Hiển thị trong 3 giây
                    position: 'top-right' // Vị trí hiển thị
                });
                // Làm mới danh sách trẻ
                const childrenResponse = await api.get(`/Parent/parents/${profileData.parentId}/children`);
                setChildren(childrenResponse.data);
                // Đóng form nhập
                setShowCreateChildForm(false);
                // Reset form
                setNewChild({
                    firstName: '',
                    lastName: '',
                    gender: 'Female',
                    dob: moment(),
                    imageUrl: 'string'
                });
            } else {
                toast.error('Tạo hồ sơ thất bại', {
                    duration: 3000,
                    position: 'top-right'
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tạo hồ sơ thất bại', {
                duration: 3000,
                position: 'top-right'
            });
            console.error('Lỗi khi tạo hồ sơ trẻ:', error);
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

    // Thêm hàm xử lý xóa trẻ
    const handleDeleteChild = async () => {
        if (!selectedChild?.childId) return;
        
        // Hiển thị confirm trước khi xóa
        if (!window.confirm('Bạn có chắc chắn muốn xóa thông tin trẻ này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setDeletingChild(true);
            const response = await api.delete(`/Parent/children/${selectedChild.childId}`);
            
            if (response.status === 200) {
                toast.success('Xóa thông tin trẻ thành công');
                // Cập nhật lại danh sách trẻ
                setChildren(children.filter(child => child.childId !== selectedChild.childId));
                // Đóng form chỉnh sửa
                setSelectedChild(null);
            }
        } catch (error) {
            console.error('Lỗi khi xóa thông tin trẻ:', error);
            toast.error(error.response?.data?.message || 'Xóa thông tin trẻ thất bại');
        } finally {
            setDeletingChild(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8F3D9' }}>
            <Toaster position="top-right" />
            <div className="container mx-auto p-4 text-black">
                <Header />
                <h1 className="text-2xl font-bold mb-4 text-black">Thông tin hồ sơ</h1>
                
                {/* Thông tin cơ bản */}
                <div className="bg-white rounded-lg shadow p-6 mb-4 text-black">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Thông tin tài khoản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cột 1: Avatar */}
                        <div className="flex flex-col items-center">
                            <img 
                                src={'/Images/avatar.jpg'}
                                alt="Avatar"
                                className="h-35 w-35 rounded-full object-cover mb-2"
                            />
                            <p className="font-medium text-gray-900">Avatar</p>
                        </div>
                        
                        {/* Cột 2: Họ và tên, Số điện thoại */}
                        <div className="flex flex-col justify-center ">
                            <p className="font-medium text-gray-900">Họ và tên:</p>
                            <p className="text-gray-800 mb-5">{profileData.account.firstName} {profileData.account.lastName}</p>
                            <p className="font-medium text-gray-900">Số điện thoại:</p>
                            <p className="text-gray-800">{profileData.account.phoneNumber}</p>
                        </div>
                        
                        {/* Cột 3: Email và Địa chỉ */}
                        <div className="flex flex-col justify-center">
                            <p className="font-medium text-gray-900">Email:</p>
                            <p className="text-gray-800 mb-5">{profileData.account.email}</p>
                            <p className="font-medium text-gray-900">Địa chỉ:</p>
                            <p className="text-gray-800">{profileData.account.address}</p>
                        </div>
                    </div>
                </div>

                {/* Thông tin khác */}
                <div className="bg-white rounded-lg shadow p-6 text-black">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Thông tin bổ sung</h2>
                    <div className="space-y-2">
                        <p className="text-gray-800 hidden ">
                            <span className="font-medium text-gray-900 ">Account ID:</span> {profileData.accountId}
                        </p>
                        <p className="text-gray-800 hidden">
                            <span className="font-medium text-gray-900 ">Parent ID:</span> {profileData.parentId}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-medium text-gray-900">Vai trò:</span> {profileData.account.role === 1 ? 'Phụ Huynh' : 'Khác'}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-medium text-gray-900">Ngày tạo tài khoản:</span> {moment(profileData.account.dateCreateAt).format('DD-MM-YYYY')}
                        </p>
                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-medium text-gray-900">Đơn hàng:</p>
                                <div className="space-x-2">
                                    <button 
                                        onClick={fetchLatestOrder}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Tải lại
                                    </button>
                                    {checkingRights ? (
                                        <button 
                                            className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
                                            disabled
                                        >
                                            Đang kiểm tra...
                                        </button>
                                    ) : hasServiceRights ? (
                                        <button 
                                            className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed"
                                            disabled
                                            title="Bạn đã có dịch vụ đang hoạt động"
                                        >
                                            Đã có dịch vụ
                                        </button>
                                    ) : (
                                        <Link 
                                            to="/buy-service" 
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Mua dịch vụ
                                        </Link>
                                    )}
                                    <Link 
                                        to={`/history-orders/${profileData.parentId}`} 
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Lịch sử đơn hàng
                                    </Link>
                                </div>
                            </div>
                            {latestOrder && latestOrder.status === 'Completed' && (
                                <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-2xl font-bold mb-4">Thông tin đơn hàng gần nhất</h2>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên gói</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng giá</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hết hạn</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{latestOrder.service.serviceName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{latestOrder.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(latestOrder.unitPrice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(latestOrder.totalPrice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(latestOrder.createDate).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(latestOrder.endDate).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{latestOrder.status}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Quản lý trẻ em */}
                <div className="bg-white rounded-lg shadow p-6 mt-4 mb-5">
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
                                className={`bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm ${
                                    checkingRights || !hasServiceRights ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title={!hasServiceRights ? "Bạn cần mua gói dịch vụ để đặt lịch" : ""}
                                onClick={(e) => {
                                    if (checkingRights || !hasServiceRights) {
                                        e.preventDefault();
                                    }
                                }}
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
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4">Tạo hồ sơ trẻ mới</h3>
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
                                        format="DD-MM-YYYY"
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
                                            {child.lastName} {child.firstName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">ID:</span> 
                                            <span className="text-gray-600 ml-1">{child.childId}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Giới tính:</span> 
                                            <span className="text-gray-600 ml-1">{child.gender == 'Female' ? 'Nữ' : 'Nam' }</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Ngày sinh:</span> 
                                            <span className="text-gray-600 ml-1">
                                                {formatDate(child.dob)}
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
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Chỉnh sửa thông tin trẻ</h3>
                                <button
                                    onClick={handleDeleteChild}
                                    disabled={deletingChild}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {deletingChild ? 'Đang xóa...' : 'Xóa thông tin trẻ'}
                                </button>
                            </div>
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
                                        format="DD-MM-YYYY"
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
               
            </div>
            <Footer />
        </div>
    );
};

export default Profile;