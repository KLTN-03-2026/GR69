import { NavLink, Outlet } from "react-router-dom";
import '../assets/main/css/login.css';
import { useEffect, useState } from "react";

interface User {
    name: string;
    email: string;
    avatar?: string;
};
function AccountLayout() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const getAvatarUrl = (avatar?: string) => {
        const baseURL = "http://127.0.0.1:8000";
        if (!avatar || avatar.trim() === "") {
            return "/img/user-img/avatar-default.png";
        }
        if (avatar.startsWith("http")) {
            return avatar;
        }
        return `${baseURL}/${avatar}`;
    };
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
                                    <h4 className="user-name-title">{user?.name || "User"}</h4>
                                    <p className="user-email-text">{user?.email || "user@gmail.com"}</p>
                                </div>
                                <img
                                    src={getAvatarUrl(user?.avatar)}
                                    alt="avatar"
                                    className="avatar-circle-sm"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/img/user-img/avatar-default.png";
                                    }}
                                />
                            </div>

                            <NavLink to="/account/my-orders" className={({ isActive }) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Đơn hàng <i className="fa fa-file-text-o" />
                            </NavLink>

                            <NavLink to="/account/my-address" className={({ isActive }) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Địa chỉ <i className="fa fa-map-marker" />
                            </NavLink>

                            <NavLink to="/account/my-info" className={({ isActive }) => isActive ? "account-menu-item active" : "account-menu-item"}>
                                Chi tiết tài khoản <i className="fa fa-user" />
                            </NavLink>

                            <NavLink to="/account/my-password" className={({ isActive }) => isActive ? "account-menu-item active" : "account-menu-item"}>
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