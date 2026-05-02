import { useEffect, useState } from "react";
import { adminDashboardService } from "../../services/admin/adminDashboadService";

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    birthday?: string;
    role: "user" | "admin";
    status: "active" | "blocked";
}
function UsersManagement() {
    const [data, setData] = useState<User[]>([]);

    useEffect(() => {
        adminDashboardService.getCustomers()
            .then((res) => {
                setData(res.data.customers.data);
                console.log(res.data.customers.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleToggle = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn thay đổi trạng thái user này?")) return;
        try {
            const res = await adminDashboardService.toggleUser(id);

            setData(prev =>
                prev.map(u =>
                    u.id === id
                        ? { ...u, status: res.data.status }
                        : u
                )
            );
        } catch {
            alert("Lỗi");
        }
    };
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="header-actions mb-4">
                    <h4 className="page-title-custom m-0 text-dark fw-bold">Quản lý Người dùng</h4>
                </div>
                <div className="table-responsive border border-light rounded bg-white">
                    <table className="table table-custom align-middle mb-0 user-table">
                        <thead className="bg-light-gray">
                            <tr>
                                <th style={{ width: "15%" }}>Tên</th>
                                <th style={{ width: "20%" }}>Email</th>
                                <th style={{ width: "12%" }}>Số điện thoại</th>
                                <th style={{ width: "15%" }}>Ngày sinh</th>
                                <th style={{ width: "10%" }}>Vai trò</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: "10%" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => {
                                return (
                                    <tr key={user.id}>
                                        <td className="fw-bold text-dark">{user.name}</td>
                                        <td className="text-muted">{user.email}</td>
                                        <td>{user.phone || "Chưa cập nhật"}</td>
                                        <td>{user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                                        </td>
                                        <td>
                                            <span className="badge-role badge-user">{user.role}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.status === "active" ? "bg-success" : "bg-danger"}`}>
                                                {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className={`btn btn-sm ${user.status === "active" ? "btn-danger" : "btn-success"}`}
                                                onClick={() => handleToggle(user.id)}
                                            >
                                                {user.status === "active" ? "Khóa" : "Mở"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default UsersManagement;