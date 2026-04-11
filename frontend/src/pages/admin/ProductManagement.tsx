import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/user/productService";
import { adminProductService } from "../../services/admin/adminProductService";

function ProductManagement() {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        productService.getAll()
            .then((res) => {
                setData(res.data.products.data);
                console.log(res.data.products.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleDelete(id: number) {
        if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

        adminProductService.delete(id)
            .then(() => {
                setData(prev => prev.filter(item => item.id !== id));
            })
            .catch(err => console.log(err));
    }
    return (
        <>
            <div className="content-card">
                <div className="header-actions">
                    <h4>Danh sách Thủy Hải Sản</h4>
                    <form className="search-box">
                        <input type="text" className="form-control" placeholder="Nhập tên sản phẩm..." />
                        <button type="button" className="btn btn-primary px-4" style={{ width: "180px" }}>Tìm kiếm</button>
                    </form>
                    <Link to="/admin/add-product" className="btn btn-add-new text-decoration-none" style={{ backgroundColor: "#10b981", color: "#fff" }}>
                        <i className="fa-solid fa-plus me-1" /> Thêm Mới
                    </Link>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle mb-0 data-table-custom">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Hình ảnh</th>
                                <th style={{ width: "20%" }}>Tên sản phẩm</th>
                                <th style={{ width: "10%" }}>Danh mục</th>
                                <th style={{ width: "12%" }}>Giá</th>
                                <th style={{ width: "12%" }}>Giá gốc</th>
                                <th style={{ width: "6%" }} className="text-center">Tồn kho</th>
                                <th style={{ width: "5%" }} className="text-center">Đơn vị</th>
                                <th style={{ width: "7%" }} className="text-center" />
                                <th style={{ width: "7%" }} className="text-center" />
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => {
                                return (
                                    <>
                                        <tr key={item.id}>
                                            <td>
                                                <img
                                                    src={
                                                        item.images?.length
                                                            ? `http://127.0.0.1:8000/${item.images[0].image_path}`
                                                            : "/img/default.jpg"
                                                    }
                                                />
                                            </td>
                                            <td className="fw-bold">{item.name}</td>
                                            <td className="fw-bold">{item.category.name}</td>
                                            <td className=" text-wrap">{item.price}</td>
                                            <td className="text-center">{item.original_price}</td>
                                            <td>{item.stock}</td>
                                            <td className="text-center">{item.unit}</td>
                                            <td className="text-center">
                                                <Link to={`/admin/edit-product/${item.id}`}>
                                                    <button className="btn btn-action-large btn-edit-square">
                                                        <i className="fa-solid fa-pen-to-square" /><br />Chỉnh sửa
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-action-large btn-delete-square" onClick={() => handleDelete(item.id)}>
                                                    <i className="fa-solid fa-trash-can" /><br />Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default ProductManagement;