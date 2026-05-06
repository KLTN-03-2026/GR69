import { useState } from "react";
import axiosClient from "../../../services/axiosClient";
import { toast } from "react-toastify";

function MyPassword() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setPassword(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();

        if (!password.current || !password.new || !password.confirm) {
            toast.warning("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password.new.length < 6) {
            toast.warning("Mật khẩu phải >= 6 ký tự");
            return;
        }

        if (password.new !== password.confirm) {
            toast.error("Mật khẩu không khớp");
            return;
        }

        setLoading(true); 

        axiosClient.put("/user/password", {
            current_password: password.current,
            password: password.new,
            password_confirmation: password.confirm
        })
            .then(() => {
                toast.success("Đổi mật khẩu thành công");

                localStorage.removeItem("user");
                localStorage.removeItem("token");

                setTimeout(() => {
                    window.location.href = "/auth/login";
                }, 1500);
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Có lỗi xảy ra";
                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    return (
        <>
            <form action="#" onSubmit={handleChangePassword}>
                <div className="password-box">
                    <div className="form-group mb-4">
                        <label htmlFor="currentPassword" className="form-label">Mật khẩu hiện tại:</label>
                        <input type="password" name="current" value={password.current} onChange={handlePasswordChange} className="form-control" id="currentPassword" placeholder="Nhập mật khẩu cũ" />

                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="newPassword" className="form-label">Mật khẩu mới:</label>
                        <input type="password" name="new" value={password.new} onChange={handlePasswordChange} className="form-control" id="newPassword" placeholder="Nhập mật khẩu mới" />

                    </div>
                    <div className="form-group mb-0">
                        <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu mới:</label>
                        <input type="password" name="confirm" value={password.confirm} onChange={handlePasswordChange} className="form-control" id="confirmPassword" placeholder="Xác nhận mật khẩu mới" />

                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-update" style={{backgroundColor: "#2d81d6",color: "#fff"}}>
                    {loading ? "Đang xử lý..." : "CẬP NHẬT"}
                </button>
            </form>
        </>
    );
}
export default MyPassword;