import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/user/categoryService";
import { adminCategoryService } from "../../services/admin/adminCategoryService";
import { toast } from "react-toastify";

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    status: "active" | "inactive";
}
function CatagoriesManagement() {
    const [data, setData] = useState<Category[]>([]);

    useEffect(() => {
        categoryService.getAll()
            .then((res) => {
                setData(res.data.categories);
                console.log(res.data.categories);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleDelete(id: number) {
        if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

        adminCategoryService.delete(id)
            .then(() => {
                setData(prev => prev.filter(item => item.id !== id));
                toast.success("Xóa danh mục thành công");
            })
            .catch(err => console.log(err));
    }
    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="header-actions mb-4 d-flex justify-content-between align-items-center">
                    <h4 className="page-title-custom m-0 text-dark fw-bold">
                        Quản lý Danh mục
                    </h4>

                    <Link
                        to="/admin/add-category"
                        className="btn text-white"
                        style={{ backgroundColor: "#1abc9c" }}
                    >
                        <i className="fa-solid fa-plus me-1" />
                        Thêm Mới
                    </Link>
                </div>

                <div className="table-responsive bg-white">
                    <table className="table table-bordered table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-center" style={{ width: "12%" }}>
                                    Hình ảnh
                                </th>

                                <th style={{ width: "18%" }}>
                                    Tên danh mục
                                </th>

                                <th style={{ width: "18%" }}>
                                    Slug
                                </th>

                                <th style={{ width: "25%" }}>
                                    Mô tả
                                </th>

                                <th className="text-center" style={{ width: "10%" }}>
                                    Trạng thái
                                </th>

                                <th className="text-center" style={{ width: "8%" }}></th>
                                <th className="text-center" style={{ width: "8%" }}></th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td className="text-center">
                                            <div className="category-img-box mx-auto">
                                                <img
                                                    src={`http://localhost:8000/${item.image}`}
                                                    alt={item.name}
                                                />
                                            </div>
                                        </td>

                                        <td className="fw-medium text-dark">
                                            {item.name}
                                        </td>

                                        <td className="text-muted">
                                            {item.slug}
                                        </td>

                                        <td className="text-muted text-wrap">
                                            {item.description}
                                        </td>

                                        <td className="text-center">
                                            {item.status === "active" ? (
                                                <span className="badge bg-success">Active</span>
                                            ) : (
                                                <span className="badge bg-secondary">Inactive</span>
                                            )}
                                        </td>

                                        <td className="text-center">
                                            <Link to={`/admin/edit-category/${item.slug}`}>
                                                <button className="btn" style={{ color: "#10b981" }}>
                                                    <i className="fa-solid fa-pen-to-square" />
                                                    <br />Sửa
                                                </button>
                                            </Link>
                                        </td>

                                        <td className="text-center">
                                            <button className="btn" style={{ color: "#dc3545" }} onClick={() => handleDelete(item.id)}>
                                                <i className="fa-solid fa-trash-can" />
                                                <br />Xóa
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

export default CatagoriesManagement;