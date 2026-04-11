import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";

interface ProfileForm {
    name: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    avatar?: File | null;
}
interface UpdateProfileResponse {
    success: boolean;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        gender?: string;
        birthday?: string;
        avatar?: string;
    };
}
function AdminProfile() {

    const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

    const [input, setInput] = useState<ProfileForm>({
        name: "",
        email: "",
        phone: "",
        gender: "",
        birthday: "",
        avatar: null
    });
    const [preview, setPreview] = useState<string>("");

    function formatDate(dateString?: string) {
        return dateString ? dateString.split("T")[0] : "";
    }

    useEffect(() => {
        if (userLocal && Object.keys(userLocal).length > 0) {
            setInput({
                name: userLocal.name || "",
                email: userLocal.email || "",
                phone: userLocal.phone || "",
                gender: userLocal.gender ?? "",
                birthday: formatDate(userLocal.birthday), // xử lý undefined
                avatar: null
            });

            setPreview(
                userLocal.avatar
                    ? "http://localhost:8000/" + userLocal.avatar
                    : "/img/default.png"
            );
        }
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }
    function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setInput(prev => ({
                ...prev,
                avatar: file
            }));
            setPreview(URL.createObjectURL(file));
        }
    }



    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("email", input.email);
        formData.append("phone", input.phone);
        formData.append("gender", input.gender);
        formData.append("birthday", input.birthday);

        if (input.avatar) {
            formData.append("avatar", input.avatar);
        }

        axiosClient.post<UpdateProfileResponse>("/user/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                const user = res.data.user;

                alert("Cap nhat thanh cong");
                localStorage.setItem("user", JSON.stringify(user));

                setInput(prev => ({
                    ...prev,
                    ...user,
                    gender: user.gender ?? "",
                    birthday: formatDate(user.birthday),
                    avatar: null
                }));

                setPreview(
                    userLocal.avatar
                        ? "http://localhost:8000/" + userLocal.avatar
                        : "/img/default.png"
                );
            })
            .catch((err) => {
                console.log(err);
                alert(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật!");
            });

    }

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

        if (password.new !== password.confirm) {
            alert("Mật khẩu không khớp");
            return;
        }

        axiosClient.put("/user/password", {
            current_password: password.current,
            password: password.new,
            password_confirmation: password.confirm
        })
            .then(() => {
            alert("Đổi mật khẩu thành công");
            setPassword({ current: "", new: "", confirm: "" });
        })
            .catch(() => {
                alert("Mật khẩu cũ không đúng");
            });
    }
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="header-actions mb-4">
                    <h4 className="page-title-custom m-0 text-dark fw-bold">Thông tin cá nhân</h4>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-section text-center">
                            <h5 className="section-title text-start">Ảnh đại diện</h5>
                            <img src={preview} alt="Avatar" className="avatar-preview" />
                            <div className="mt-3">
                                <label htmlFor="avatarUpload" className="btn btn-outline-primary btn-sm px-3">
                                    <i className="fa-solid fa-camera me-1" /> Thay đổi ảnh
                                </label>
                                <input type="file" id="avatarUpload" className="d-none" accept="image/*" onChange={handleAvatar} />
                            </div>
                            <p className="text-muted mt-2" style={{ fontSize: '12px' }}>Định dạng: JPEG, PNG. Kích thước tối đa 2MB.</p>
                            <hr className="my-4 text-muted opacity-25" />
                            <div className="text-start">
                                <p className="mb-1"><i className="fa-solid fa-shield-halved text-success me-2" /><strong>Vai trò:</strong> Quản trị viên (Admin)</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="form-section mb-4">
                            <h5 className="section-title">Hồ sơ cá nhân</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label-custom">Tên</label>
                                        <input type="text" name="name" value={input.name} onChange={handleChange} className="form-control bg-light" placeholder="Tên" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label-custom">Email *</label>
                                        <input type="email" name="email" value={input.email} onChange={handleChange} className="form-control" id="email" required />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="gender" className="form-label-custom">Giới tính</label>
                                        <select className="form-select" id="gender" name="gender" value={input.gender || ""} onChange={handleChange}>
                                            <option value="">-- Chọn giới tính --</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="birthday" className="form-label-custom">Ngày sinh</label>
                                        <input type="date" className="form-control" id="birthday" name="birthday" value={input.birthday || ""} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label-custom">Số điện thoại *</label>
                                        <input type="text" name="phone" value={input.phone} onChange={handleChange} className="form-control" id="phone" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-teal px-4" style={{ backgroundColor: "#1abc9c" }}>Lưu thông tin</button>
                            </form>
                        </div>

                        <div className="form-section">
                            <h5 className="section-title">Đổi mật khẩu</h5>
                            <form onSubmit={handleChangePassword}>
                                <div className="row mb-3">
                                    <label htmlFor="currentPassword" className="col-md-3 col-form-label form-label-custom">Mật khẩu hiện tại</label>
                                    <div className="col-md-9">
                                        <input type="password" name="current" value={password.current} onChange={handlePasswordChange} className="form-control" id="currentPassword" placeholder="Nhập mật khẩu cũ" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="newPassword" className="col-md-3 col-form-label form-label-custom">Mật khẩu mới</label>
                                    <div className="col-md-9">
                                        <input type="password" name="new" value={password.new} onChange={handlePasswordChange} className="form-control" id="newPassword" placeholder="Nhập mật khẩu mới" />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <label htmlFor="confirmPassword" className="col-md-3 col-form-label form-label-custom">Nhập lại mật khẩu</label>
                                    <div className="col-md-9">
                                        <input type="password" name="confirm" value={password.confirm} onChange={handlePasswordChange} className="form-control" id="confirmPassword" placeholder="Xác nhận mật khẩu mới" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3" />
                                    <div className="col-md-9">
                                        <button type="submit" className="btn btn-secondary px-4">Đổi mật khẩu</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminProfile;