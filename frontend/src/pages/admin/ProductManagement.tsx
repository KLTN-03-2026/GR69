import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminProductService } from "../../services/admin/adminProductService";

function ProductManagement() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    useEffect(() => {
        adminProductService.getAll({ page })
            .then((res) => {
                setData(res.data.products.data);
                setLastPage(res.data.products.last_page);
            });
    }, [page]);

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
                                <th style={{ width: "8%" }} className="text-center">Hình ảnh</th>
                                <th style={{ width: "20%" }} className="text-center">Tên sản phẩm</th>
                                <th style={{ width: "14%" }} className="text-center">Danh mục</th>
                                <th style={{ width: "10%" }} className="text-center">Giá</th>
                                <th style={{ width: "12%" }} className="text-center">Giá gốc</th>
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
                                            <td className="text-center">{Number(item.price).toLocaleString()}đ</td>
                                            <td className="text-center">{Number(item.original_price).toLocaleString()}đ</td>
                                            <td>{item.stock}</td>
                                            <td className="text-center">{item.unit}</td>
                                            <td className="text-center">
                                                <Link to={`/admin/edit-product/${item.id}`}>
                                                    <button className="btn btn-action-large btn-edit-square">
                                                        <i className="fa-solid fa-pen-to-square" />
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-action-large btn-delete-square" onClick={() => handleDelete(item.id)}>
                                                    <i className="fa-solid fa-trash-can" />
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="btn btn-secondary me-2"
                    >
                        Prev
                    </button>

                    <span className="align-self-center">
                        Trang {page} / {lastPage}
                    </span>

                    <button
                        disabled={page === lastPage}
                        onClick={() => setPage(page + 1)}
                        className="btn btn-secondary ms-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
export default ProductManagement;