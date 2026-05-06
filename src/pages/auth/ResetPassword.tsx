import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

function ResetPassword() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
        toast.error("Link không hợp lệ");
        return;
    }

    const [password, setPassword] = useState("");
    const [password_confirmation, setConfirm] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await authService.resetPassword({
                token,
                email,
                password,
                password_confirmation,
            });

            if (res.data.success) {
                toast.success("Đổi mật khẩu thành công");
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            toast.error("Lỗi reset mật khẩu");
        }
    };

    return (
        <div className="reset-box">
            <h2>Đổi mật khẩu mới</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input type="password" placeholder="Mật khẩu mới"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Nhập lại mật khẩu"
                        onChange={(e) => setConfirm(e.target.value)} />
                </div>

                <button className="reset-btn">
                    Xác nhận đổi mật khẩu
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;