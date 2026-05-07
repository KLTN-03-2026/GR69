import { NavLink, Outlet } from "react-router-dom";
import '../assets/main/css/login.css';

function AccountLayout() {
    return (
        <>
            <header className="header-top">
                <h3>
                    <a href="/">FISHMARKET</a>
                    <sup style={{ fontSize: '12px' }}>®</sup>
                </h3>
            </header>

            <div className="container mt-5 mb-5">
                <div className="row">

                    <div className="col-lg-3 col-md-4 mb-4">
                        <div className="account-sidebar">
                            <div className="user-profile-summary">
                                <div className="user-profile-info">
                                    <h4 className="user-name-title">Lê Bin</h4>
                                    <p className="user-email-text">lebin537@gmail.com</p>
                                </div>
                                <div className="avatar-circle-sm">LB</div>
                            </div>

                            <NavLink to="/account/my-orders" className={({isActive}) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Đơn hàng <i className="fa fa-file-text-o" />
                            </NavLink>

                            <NavLink to="/account/my-address" className={({isActive}) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Địa chỉ <i className="fa fa-map-marker" />
                            </NavLink>

                            <NavLink to="/account/my-info" className={({isActive}) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Chi tiết tài khoản <i className="fa fa-user" />
                            </NavLink>

                            <NavLink to="/account/my-password" className={({isActive}) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Đổi mật khẩu <i className="fa fa-lock" />
                            </NavLink>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-8 account-content">
                        <Outlet />
                    </div>

                </div>
            </div>
        </>
    );
}

export default AccountLayout;