import React, { useState } from "react";
import { adminCategoryService } from "../../services/admin/adminCategoryService";

interface CategoryForm {
    name: string;
    slug: string;
    description: string;
    image: File | null;
    status: string;
}

interface FormError {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    status?: string;
}

function AddCategory() {
    const [input, setInput] = useState<CategoryForm>({
        name: "",
        description: "",
        slug: "",
        image: null,
        status: "active"
    });

    const [errors, setErrors] = useState<FormError>({});

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;

        if (name === "name") {
            setInput(prev => ({
                ...prev,
                name: value,
                slug: generateSlug(value)
            }));
        } else {
            setInput(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }
    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        let error = "";
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const maxSize = 2 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                error = "Chỉ chấp nhận JPG, PNG";
            } else if (file.size > maxSize) {
                error = "Ảnh tối đa 2MB";
            }
        }

        setErrors(prev => ({
            ...prev,
            image: error
        }));

        setInput(prev => ({
            ...prev,
            image: file
        }));
    }

    function generateSlug(str: string) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errorSubmit: FormError = {};
        let flag = true;

        if (input.name === "") {
            errorSubmit.name = "Vui lòng nhập tên danh mục";
            flag = false;
        }

        if (input.description === "") {
            errorSubmit.description = "Vui lòng nhập mô tả";
            flag = false;
        }

        if (input.slug === "") {
            errorSubmit.slug = "Vui lòng nhập slug";
            flag = false;
        }

        if (!input.image) {
            errorSubmit.image = "Vui lòng chọn ảnh";
            flag = false;
        }

        if (!flag) {
            setErrors(errorSubmit);
            return;
        }

        setErrors({});
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("slug", input.slug);
        formData.append("description", input.description);
        formData.append("status", input.status);

        if (input.image) {
            formData.append("image", input.image);
        }

        adminCategoryService.create(formData)
            .then((response) => {
                alert("Thêm danh mục thành công");
                console.log("SUCCESS", response.data);
            })
            .catch((error) => {
                alert("Thêm danh mục thất bại");
                console.log("ERROR", error);
            });
    }

    return (
        <div className="container-fluid px-4 mt-4">
            <div className="form-section">
                <div className="border-bottom pb-3 mb-4">
                    <h4 className="mb-0">Thêm Danh Mục Mới</h4>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <label className="col-md-2 text-md-end">Tên *</label>
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={input.name}
                                onChange={handleChange}
                            />
                            <p className="text-danger">{errors.name}</p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-md-2 text-md-end">Slug *</label>
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                name="slug"
                                value={input.slug}
                                onChange={handleChange}
                            />
                            <p className="text-danger">{errors.slug}</p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-md-2 text-md-end">Mô tả *</label>
                        <div className="col-md-8">
                            <textarea
                                className="form-control"
                                name="description"
                                value={input.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Nhập mô tả danh mục..."
                            />
                            <p className="text-danger">{errors.description}</p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-md-2 text-md-end">Trạng thái</label>
                        <div className="col-md-8">
                            <select
                                className="form-control"
                                name="status"
                                value={input.status}
                                onChange={handleChange}
                            >
                                <option value="active">Hiển thị</option>
                                <option value="inactive">Ẩn</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-md-2 text-md-end">Hình ảnh</label>
                        <div className="col-md-8">
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFile}
                            />
                            <p className="text-danger">{errors.image}</p>
                        </div>
                    </div>
                    <button className="btn btn-primary">Thêm</button>
                </form>
            </div>
        </div>
    );
}

export default AddCategory;