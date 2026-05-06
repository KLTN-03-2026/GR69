
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../assets/admin/css/all.min.css';
import '../assets/admin/css/style.css';


function AdminLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login");
    }
    function renderInfor() {
        if (token && user) {
            return (
                <>
                    <div className="user-info-wrapper">
                        <div className="avatar">
                            <img src={user.avatar} alt="" />
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-status"><span className="dot" /> Online</div>
                        </div>
                    </div>
                </>
            );
        }
    }
    return (
        <>
            <div className="wrapper">
                <div id="sidebar">
                    <div className="sidebar-header">
                        <h4>FISHMARKET</h4>
                        <span>Quản lý cửa hàng</span>
                    </div>
                    <nav className="d-flex flex-column mb-auto">
                        <NavLink to="/admin" end className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-layer-group" /></span>
                            Tổng quan
                        </NavLink>
                        <NavLink to="/admin/product-management" className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-fish" /></span>
                            Quản lý Sản phẩm
                        </NavLink>
                        <NavLink to="/admin/orders-management" className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-box-open" /></span>
                            Quản lý Đơn hàng
                        </NavLink>
                        <NavLink to="/admin/users-management" className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-user-group" /></span>
                            Quản lý Người dùng
                        </NavLink>
                        <NavLink to="/admin/category-management" className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-folder-open" /></span>
                            Quản lý Danh mục
                        </NavLink>
                        <NavLink to="/admin/voucher-management" className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-ticket" /></span>
                            Quản lý Voucher
                        </NavLink>
                        <NavLink to="/admin/admin-profile" className={({ isActive }) =>
                            "nav-item-custom " + (isActive ? "active" : "")
                        }>
                            <span className="icon-wrapper" style={{ color: '#e7e7ee' }}><i className="fa-solid fa-user-shield" /></span>
                            Tài khoản của tôi
                        </NavLink>
                    </nav>
                    <div className="sidebar-footer">
                        <div className="user-profile">
                            {renderInfor()}
                            <Link to="/admin/admin-profile" className="profile-settings-btn" title="Cài đặt tài khoản">
                                <i className="fa-solid fa-gear" />
                            </Link>
                        </div>
                        <a onClick={handleLogout} className="btn-logout w-100 text-center mt-2 d-block py-2 text-decoration-none">Đăng xuất</a>
                    </div>
                </div>
                <div className="main-content">
                    <div className="top-navbar">
                        <div className="sys-title">Hệ thống quản trị cửa hàng hải sản online</div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
export default AdminLayout;