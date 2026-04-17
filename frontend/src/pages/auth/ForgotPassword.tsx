import { useState } from "react";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email");
            return;
        }

        try {
            setLoading(true);

            const res = await authService.forgotPassword(email);

            if (res.data.success) {
                toast.success(res.data.message);
                setEmail("");
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            toast.error("Lỗi server hoặc email không tồn tại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-box">
            <h2>Quên mật khẩu</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button className="forgot-btn" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi link reset"}
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;