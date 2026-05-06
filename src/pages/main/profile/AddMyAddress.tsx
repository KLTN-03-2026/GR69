import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addressService } from "../../../services/user/AddressService";

function AddMyAddress() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        name: "",
        phone: "",
        address: "",
        is_default: false
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;

        setInput(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (loading) return;

        if (!input.name || !input.phone || !input.address) {
            toast.warning("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!/^[0-9]{9,11}$/.test(input.phone)) {
            toast.warning("Số điện thoại không hợp lệ");
            return;
        }

        setLoading(true);

        addressService.create(input)
            .then(() => {
                toast.success("Thêm địa chỉ thành công");

                setInput({
                    name: "",
                    phone: "",
                    address: "",
                    is_default: false
                });

                navigate("/account/my-address")
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Có lỗi xảy ra";
                toast.error(message);
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="col-lg-9 col-md-8">
            <div className="card p-4">
                <h4 className="mb-4">Thêm địa chỉ mới</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên người nhận</label>
                        <input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={input.phone}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={input.address}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            name="is_default"
                            checked={input.is_default}
                            onChange={handleChange}
                            className="form-check-input"
                            id="defaultAddress"
                        />
                        <label className="form-check-label" htmlFor="defaultAddress">
                            Đặt làm mặc định
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Đang thêm..." : "Thêm địa chỉ"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddMyAddress;