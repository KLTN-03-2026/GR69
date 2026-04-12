import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addressService } from "../../../services/user/AddressService";

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    is_default: boolean;
}

function MyAddress() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    function fetchAddresses() {
        setLoading(true);
        addressService.getAll()
            .then((res) => {
                setAddresses(res.data.addresses);
            })
            .catch(() => {
                toast.error("Không thể tải địa chỉ");
            })
            .finally(() => setLoading(false));
    }

    function handleDelete(id: number) {
        if (!confirm("Bạn có chắc muốn xóa?")) return;

        addressService.delete(id)
            .then(() => {
                toast.success("Đã xóa");
                fetchAddresses();
            })
            .catch(() => {
                toast.error("Xóa thất bại");
            });
    }

    function handleSetDefault(id: number) {
        addressService.setDefault(id)
            .then(() => {
                toast.success("Đã đặt mặc định");
                fetchAddresses();
            })
            .catch(() => {
                toast.error("Thất bại");
            });
    }

    return (
        <div className="col-lg-9 col-md-8">
            <div className="alert-notice">
                Các địa chỉ sau sẽ được sử dụng trên trang thanh toán theo mặc định.
            </div>

            <div className="table-responsive">
                <table className="table address-table">
                    <thead>
                        <tr>
                            <th>Tên người nhận</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Mặc định</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {addresses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Không có địa chỉ
                                </td>
                            </tr>
                        )}

                        {addresses.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.address}</td>
                                <td>{item.phone}</td>

                                <td>
                                    {item.is_default ? (
                                        <span className="badge-default">
                                            Mặc định
                                        </span>
                                    ) : (
                                        <button
                                            className="btn btn-select"
                                            onClick={() => handleSetDefault(item.id)}
                                        >
                                            Chọn
                                        </button>
                                    )}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-delete"
                                        style={{ backgroundColor: "red" }}
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link
                to="/account/add-address"
                className="btn btn-add-new"
                style={{ backgroundColor: "#0066cc", color: "#fff" }}
            >
                Thêm địa chỉ mới
            </Link>
        </div>
    );
}

export default MyAddress;