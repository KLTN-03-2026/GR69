import { useEffect, useState } from "react";
import axiosClient from "../../../services/axiosClient";

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
function MyInfor() {
    const BASE_URL = "http://127.0.0.1:8000/";
    const [input, setInput] = useState<ProfileForm>({
        name: "",
        email: "",
        phone: "",
        gender: "",
        birthday: "",
        avatar: null
    });
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user && Object.keys(user).length > 0) {
            setInput({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender ?? "",
                birthday: formatDate(user.birthday),
                avatar: null
            });

            setPreview(
                user.avatar
                    ? BASE_URL + user.avatar
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


    function formatDate(dateString?: string) {
        return dateString ? dateString.split("T")[0] : "";
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
                console.log(res.data.user);
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
                    user.avatar
                        ? user.avatar
                        : "/img/default.png"
                );
            })
            .catch((err) => {
                console.log(err);
                alert(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật!");
            });

    }
    return (
        <>
            <div>
                <div className="avatar-section">
                    <label htmlFor="avatarUpload" className="avatar-wrapper">
                        <img
                            src={preview}
                            alt="Avatar User"
                            className="avatar-img"
                        />
                        <div className="avatar-upload-icon">
                            <i className="fa fa-camera" />
                        </div>
                    </label>
                    <input type="file" id="avatarUpload" className="d-none" accept="image/*" onChange={handleAvatar} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label className="form-label">Họ và tên:</label>
                            <input type="text" name="name" value={input.name} onChange={handleChange} className="form-control bg-light" placeholder="Tên" />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="form-label">Số điện thoại:</label>
                            <input type="text" name="phone" value={input.phone} onChange={handleChange} className="form-control" id="phone" required />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="form-label">Email (không được thay đổi)</label>
                            <input type="email" name="email" value={input.email} className="form-control" id="email" readOnly />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="form-label">Ngày sinh</label>
                            <input type="date" className="form-control" id="birthday" name="birthday" value={input.birthday || ""} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="form-label">Giới tính</label>
                            <select className="form-select" id="gender" name="gender" value={input.gender || ""} onChange={handleChange}>
                                <option value="">-- Chọn giới tính --</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-update" style={{ backgroundColor: "#0066cc", color: "#fff" }}>CẬP NHẬT</button>
                </form>
            </div>
        </>
    );
}
export default MyInfor;