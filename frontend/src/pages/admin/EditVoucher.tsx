import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminVoucherService } from "../../services/admin/adminVoucherService";

interface VoucherForm {
    code: string;
    label: string;
    type: string;
    value: string;
    min_order: string;
    max_uses: string;
    expires_at: string;
    is_active: number;
}
interface FormError {
    code?: string;
    label?: string;
    type?: string;
    value?: string;
    min_order?: string;
    max_uses?: string;
    expires_at?: string;
    is_active?: number;
}
function EditVoucher() {
    const { id } = useParams();
    const [errors, setErrors] = useState<FormError>({});
    const [input, setInput] = useState<VoucherForm>({
        code: "",
        label: "",
        type: "",
        value: "",
        min_order: "0",
        max_uses: "0",
        expires_at: "",
        is_active: 1
    });

    useEffect(() => {
        if (!id) return;

        adminVoucherService.getById(Number(id))
            .then(res => {
                const v = res.data.coupon;
                console.log(res.data.coupon)

                setInput({
                    code: v.code || "",
                    label: v.label || "",
                    type: v.type || "",
                    value: String(v.value || ""),
                    min_order: String(v.min_order || "0"),
                    max_uses: String(v.max_uses || "0"),
                    expires_at: v.expires_at
                        ? v.expires_at.slice(0, 16)
                        : "",
                    is_active: v.is_active ? 1 : 0
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "code") {
            setInput(prev => ({
                ...prev,
                code: value.toUpperCase()
            }));
        } else {
            setInput(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prev => ({
            ...prev,
            is_active: e.target.checked ? 1 : 0
        }));
    };

    const validate = () => {
        let err: FormError = {};
        let flag = true;

        if (!input.code) {
            err.code = "Vui lòng nhập mã";
            flag = false;
        }

        if (!input.label) {
            err.label = "Vui lòng nhập mô tả";
            flag = false;
        }

        if (!input.type) {
            err.type = "Chọn loại voucher";
            flag = false;
        }

        if (!input.value) {
            err.value = "Nhập giá trị giảm";
            flag = false;
        }

        if (input.type === "percent" && Number(input.value) > 100) {
            err.value = "Phần trăm không được > 100";
            flag = false;
        }

        setErrors(err);
        return flag;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const data = {
            ...input,
            is_active: input.is_active ? 1 : 0
        };

        adminVoucherService.update(Number(id), data)
            .then(() => {
                alert("Thêm voucher thành công");

                setInput({
                    code: "",
                    label: "",
                    type: "",
                    value: "",
                    min_order: "0",
                    max_uses: "0",
                    expires_at: "",
                    is_active: 1
                });
            })
            .catch(err => {
                console.log(err.response?.data);
            });
    };
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="form-section mx-auto" style={{ maxWidth: '800px', backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                        <h4 className="mb-0 text-dark fw-bold">Cập nhật Voucher</h4>
                        <Link to="/admin/voucher-management" className="text-decoration-none text-muted">
                            <i className="fa-solid fa-arrow-left me-1" /> Quay lại
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* 1. Mã Voucher (code) */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="code" className="col-md-3 col-form-label form-label-custom">Mã Voucher *</label>
                            <div className="col-md-9">
                                <input type="text" className="form-control" id="code" name="code" value={input.code} placeholder="VD: GiamGia50k, TET2024..." onChange={handleChange} />
                                <p className="text-danger">{errors.code}</p>
                            </div>
                        </div>

                        {/* 2. Tên/Mô tả (label) - THÊM MỚI */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="label" className="col-md-3 col-form-label form-label-custom">Tên / Mô tả *</label>
                            <div className="col-md-9">
                                <input type="text" className="form-control" id="label" name="label" value={input.label} placeholder="VD: Giảm giá 50k cho khách hàng mới..." onChange={handleChange} />
                                <p className="text-danger">{errors.label}</p>
                            </div>
                        </div>

                        {/* 3. Loại Voucher (type) */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="type" className="col-md-3 col-form-label form-label-custom">Loại Voucher *</label>
                            <div className="col-md-9">
                                <select className="form-select" id="type" name="type" value={input.type} onChange={handleChange}>
                                    <option value="" disabled>-- Chọn loại voucher --</option>
                                    <option value="percent">Phần trăm (%)</option>
                                    <option value="fixed">Tiền mặt (VNĐ)</option>
                                </select>
                                <p className="text-danger">{errors.type}</p>
                            </div>
                        </div>

                        {/* 4. Giá trị giảm (value) */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="value" className="col-md-3 col-form-label form-label-custom">Giá trị giảm *</label>
                            <div className="col-md-9">
                                <input type="number" className="form-control" id="value" name="value" value={input.value} placeholder="Nhập số % hoặc số tiền" onChange={handleChange} />
                                <p className="text-danger">{errors.value}</p>
                            </div>
                        </div>

                        {/* 5. Đơn hàng tối thiểu (min_order) */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="min_order" className="col-md-3 col-form-label form-label-custom">Đơn hàng tối thiểu</label>
                            <div className="col-md-9">
                                <div className="input-group">
                                    <span className="input-group-text">₫</span>
                                    <input type="number" className="form-control" id="min_order" name="min_order" value={input.min_order} placeholder="VD: 300000" onChange={handleChange} />
                                    <p className="text-danger">{errors.min_order}</p>
                                </div>
                                <div className="form-text">Nhập 0 nếu không yêu cầu giá trị đơn hàng tối thiểu.</div>
                            </div>
                        </div>

                        {/* 6. Số lượt sử dụng tối đa (max_uses) - THÊM MỚI */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="max_uses" className="col-md-3 col-form-label form-label-custom">Số lượt sử dụng</label>
                            <div className="col-md-9">
                                <input type="number" className="form-control" id="max_uses" name="max_uses" value={input.max_uses} placeholder="VD: 100" onChange={handleChange} />
                                <p className="text-danger">{errors.max_uses}</p>
                                <div className="form-text">Nhập 0 nếu không giới hạn số lượng sử dụng.</div>
                            </div>
                        </div>

                        {/* 7. Ngày hết hạn (expires_at) - THÊM MỚI */}
                        <div className="row mb-3 align-items-center">
                            <label htmlFor="expires_at" className="col-md-3 col-form-label form-label-custom">Ngày hết hạn</label>
                            <div className="col-md-9">
                                <input type="datetime-local" className="form-control" id="expires_at" name="expires_at" value={input.expires_at} onChange={handleChange} />
                                <p className="text-danger">{errors.expires_at}</p>
                            </div>
                        </div>

                        {/* 8. Trạng thái (is_active) - THÊM MỚI */}
                        <div className="row mb-4 align-items-center">
                            <label htmlFor="is_active" className="col-md-3 col-form-label form-label-custom">Trạng thái</label>
                            <div className="col-md-9">
                                <div className="form-check form-switch mt-2">
                                    <input className="form-check-input" type="checkbox" id="is_active" name="is_active" checked={input.is_active === 1} onChange={handleCheckbox} />
                                    <p className="text-danger">{errors.is_active}</p>
                                    <label className="form-check-label" htmlFor="is_active">Kích hoạt (Cho phép sử dụng)</label>
                                </div>
                            </div>
                        </div>

                        <hr className="text-muted mb-4 opacity-25" />
                        <div className="row">
                            <div className="col-md-3" />
                            <div className="col-md-9 d-flex gap-2">
                                <button type="submit" className="btn text-white px-4" style={{ backgroundColor: "#1abc9c" }}>Cập nhật Voucher</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditVoucher;