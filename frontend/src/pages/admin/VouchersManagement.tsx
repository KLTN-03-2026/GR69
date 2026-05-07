import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminVoucherService } from "../../services/admin/adminVoucherService";

function VouchersManagement() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        adminVoucherService.getAll()
            .then((res) => {
                setData(res.data.coupons.data);
                console.log(res.data.coupons.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleDelete(id: number) {
        if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

        adminVoucherService.delete(id)
            .then(() => {
                setData(prev => prev.filter(item => item.id !== id));
                alert("Xóa thành công");
            })
            .catch(err => {
                console.log(err);
                alert("Xóa thất bại");
            });
    }
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="header-actions mb-4 d-flex justify-content-between align-items-center">
                    <h4 className="page-title-custom m-0 text-dark fw-bold">Quản lý Voucher</h4>
                    <div className="d-flex gap-3 align-items-center">
                        <Link to="/admin/add-voucher" className="btn btn-add-new text-white text-decoration-none" style={{ backgroundColor: '#1abc9c' }}>
                            <i className="fa-solid fa-plus me-1" /> Thêm Voucher Mới
                        </Link>
                    </div>
                </div>
                <div className="table-responsive bg-white shadow-sm rounded border">
                    <table className="table table-bordered table-hover align-middle mb-0 table-voucher">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: "15%" }}>Mã voucher</th>
                                <th style={{ width: "15%" }}>Loại voucher</th>
                                <th style={{ width: "10%" }}>Giá trị</th>
                                <th style={{ width: "15%" }}>Giá trị tối thiểu</th>
                                <th style={{ width: "15%" }}>số lượt tối đa</th>
                                <th style={{ width: "20%" }}>Ngày hết hạn</th>
                                <th style={{ width: "20%" }}>Trạng thái</th>
                                <th style={{ width: "15%" }} className="text-center"></th>
                                <th style={{ width: "15%" }} className="text-center"></th>

                            </tr>
                        </thead>
                        <tbody>
                            {data.map((value) => {
                                return (
                                    <tr key={value.id}>
                                        <td><span className="voucher-code">{value.code}</span></td>
                                        <td >
                                            {value.type === "percent" ? "Phần trăm (%)" : "Tiền mặt"}
                                        </td>
                                        <td>
                                            {value.type === "percent"
                                                ? `${value.value}%`
                                                : Number(value.value).toLocaleString()}đ
                                        </td>
                                        <td>{Number(value.min_order).toLocaleString()}đ</td>
                                        <td>{value.max_uses}</td>
                                        <td>
                                            {value.expires_at
                                                ? new Date(value.expires_at).toLocaleString()
                                                : "Không giới hạn"}
                                        </td>
                                        <td>
                                            {value.is_active ? "Đang hoạt động" : "Tắt"}
                                        </td>
                                        <td className="text-center">
                                            <Link to={`/admin/edit-voucher/${value.id}`}>
                                                <button className="btn btn-action-large btn-edit-square">
                                                    <i className="fa-solid fa-pen-to-square" />
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-action-large btn-delete-square" onClick={() => handleDelete(value.id)}>
                                                <i className="fa-solid fa-trash-can" />
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
export default VouchersManagement;