import React, { useEffect, useState } from "react";
import { categoryService } from "../../services/user/categoryService";
import { adminProductService } from "../../services/admin/adminProductService";

interface ProductForm {
    name: string;
    slug: string;
    category_id: string | number;
    price: string;
    original_price: string;
    description: string;
    origin: string;
    weight: string;
    unit: string;
    type: "fresh" | "frozen" | "dried";
    is_best_seller: number;
    is_new: number;
    stock: string;
    images: File[];
}
interface FormError {
    name?: string;
    slug?: string;
    category_id?: string;
    price?: string;
    original_price?: string;
    description?: string;
    origin?: string;
    weight?: string;
    unit?: string;
    stock?: string;
    images?: string;
}
function AddProduct() {
    const [categories, setCategories] = useState<any[]>([]);
    const [errors, setErrors] = useState<FormError>({});
    // const [loading, setLoading] = useState(false);
    const [input, setInput] = useState<ProductForm>({
        name: "",
        slug: "",
        category_id: "",
        price: "",
        original_price: "",
        description: "",
        origin: "",
        weight: "",
        unit: "kg",
        type: "fresh",
        is_best_seller: 0,
        is_new: 0,
        stock: "",
        images: []
    });

    useEffect(() => {
        categoryService.getAll()
            .then(res => setCategories(res.data.categories))
            .catch(err => console.log(err));
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: checked ? 1 : 0
        }));
    };

    // const previews = input.images.map(file => URL.createObjectURL(file));
    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);

        setInput(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    }

    function generateSlug(str: string) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");
    }
    const handleReset = () => {
        setInput({
            name: "",
            slug: "",
            category_id: "",
            price: "",
            original_price: "",
            description: "",
            origin: "",
            weight: "",
            unit: "kg",
            type: "fresh",
            is_best_seller: 0,
            is_new: 0,
            stock: "",
            images: []
        });
        setErrors({});
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errorSubmit: FormError = {};
        let flag = true;

        if (input.name === "") {
            errorSubmit.name = "Vui lòng nhập tên sản phẩm";
            flag = false;
        }
        if (input.slug === "") {
            errorSubmit.slug = "Vui lòng nhập slug";
            flag = false;
        }
        if (input.category_id === "") {
            errorSubmit.category_id = "Vui lòng chọn danh mục";
            flag = false;
        }
        if (input.price === "") {
            errorSubmit.price = "Vui lòng nhập giá";
            flag = false;
        }
        if (input.original_price === "") {
            errorSubmit.original_price = "Vui lòng nhập giá gốc";
            flag = false;
        }
        if (input.description === "") {
            errorSubmit.description = "Vui lòng nhập mô tả";
            flag = false;
        }
        if (input.origin === "") {
            errorSubmit.origin = "Vui lòng nhập xuất xứ";
            flag = false;
        }
        if (input.weight === "") {
            errorSubmit.weight = "Vui lòng nhập trọng lượng";
            flag = false;
        }
        if (input.unit === "") {
            errorSubmit.unit = "Vui lòng nhập đơn vị";
            flag = false;
        }
        if (input.stock === "") {
            errorSubmit.stock = "Vui lòng nhập số lượng";
            flag = false;
        }
        if (input.images.length === 0) {
            errorSubmit.images = "Vui lòng chọn ảnh";
            flag = false;
        }
        if (!flag) {
            setErrors(errorSubmit);
            return;
        }
        else {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("slug", input.slug);
            formData.append("category_id", String(input.category_id));
            formData.append("price", input.price);
            formData.append("original_price", input.original_price);
            formData.append("description", input.description);
            formData.append("origin", input.origin);
            formData.append("weight", input.weight);
            formData.append("unit", input.unit);
            formData.append("type", input.type);
            formData.append("is_best_seller", input.is_best_seller ? "1" : "0");
            formData.append("is_new", input.is_new ? "1" : "0");
            formData.append("stock", input.stock);

            input.images.forEach((file) => {
                formData.append("images[]", file);
            });

            // setLoading(true);
            adminProductService.create(formData)
                .then(res => {
                    console.log("SUCCESS", res.data);
                    alert("Thêm sản phẩm thành công");
                })
                // .finally(() => setLoading(false))
                .catch(err => {
                    console.log(err.response.data);
                });
        }
    };



    return (
        <>
            <div className="container-fluid" style={{ padding: '30px' }}>
                <div className="panel-custom">
                    <div className="panel-header d-flex justify-content-between align-items-center">
                        <h5 className="m-0 text-muted">Thêm Sản Phẩm Mới</h5>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Tên Sản Phẩm
                                    *</label>
                                <div className="col-sm-7">
                                    <input type="text" name="name" value={input.name} className="form-control form-input-custom" placeholder="VD: Tôm Hùm Alaska" onChange={handleChange} />
                                    <p className="text-danger">{errors.name}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Slug
                                    *</label>
                                <div className="col-sm-7">
                                    <input type="text" name="slug" value={input.slug} className="form-control form-input-custom" placeholder="VD: tom-hum-alaska" onChange={handleChange} />
                                    <p className="text-danger">{errors.slug}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Danh Mục
                                    *</label>
                                <div className="col-sm-7">
                                    <select
                                        className="form-select form-input-custom"
                                        name="category_id"
                                        value={input.category_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-danger">{errors.category_id}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Giá *</label>
                                <div className="col-sm-7">
                                    <input type="number" min="0" name="price" value={input.price} className="form-control form-input-custom" placeholder="VD: 1250000" onChange={handleChange} />
                                    <p className="text-danger">{errors.price}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Giá gốc *</label>
                                <div className="col-sm-7">
                                    <input type="number" min="0" name="original_price" value={input.original_price} className="form-control form-input-custom" placeholder="VD: 1500000" onChange={handleChange} />
                                    <p className="text-danger">{errors.original_price}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Mô tả *</label>
                                <div className="col-sm-7">
                                    <input type="text" name="description" value={input.description} className="form-control form-input-custom" placeholder="VD: Size 1.5 - 3kg/con, đánh bắt tự nhiên..." onChange={handleChange} />
                                    <p className="text-danger">{errors.description}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">xuất xứ *</label>
                                <div className="col-sm-7">
                                    <input type="text" name="origin" value={input.origin} className="form-control form-input-custom" placeholder="VD: New zealand" onChange={handleChange} />
                                    <p className="text-danger">{errors.origin}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Trọng lượng
                                    *</label>
                                <div className="col-sm-7">
                                    <input type="number" name="weight" value={input.weight} className="form-control form-input-custom" placeholder="VD: 50" onChange={handleChange} />
                                    <p className="text-danger">{errors.weight}</p>

                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Type*</label>
                                <div className="col-sm-7">
                                    <select name="type" value={input.type} className="form-select form-input-custom" onChange={handleChange}>
                                        <option value="fresh">Tươi sống</option>
                                        <option value="frozen">Đông lạnh</option>
                                        <option value="dried">Khô</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Đơn vị
                                    *</label>
                                <div className="col-sm-7">
                                    <input type="text" name="unit" value={input.unit} className="form-control form-input-custom" placeholder="VD: kg, con, hộp..." onChange={handleChange} />
                                    <p className="text-danger">{errors.unit}</p>
                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Best Saler
                                    *</label>
                                <div className="col-sm-7">
                                    <input
                                        type="checkbox"
                                        name="is_best_seller"
                                        className="custom-checkbox"
                                        checked={input.is_best_seller === 1}
                                        onChange={handleCheckbox}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Sản phẩm mới
                                    *</label>
                                <div className="col-sm-7">
                                    <input
                                        type="checkbox"
                                        name="is_new"
                                        className="custom-checkbox"
                                        checked={input.is_new === 1}
                                        onChange={handleCheckbox}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Tồn kho *</label>
                                <div className="col-sm-7">
                                    <input type="text" min="0" name="stock" value={input.stock} className="form-control form-input-custom" placeholder="VD: 400" onChange={handleChange} />
                                    <p className="text-danger">{errors.stock}</p>

                                </div>
                            </div>
                            <div className="row mb-4 align-items-center">
                                <label className="col-sm-3 col-form-label text-end text-muted form-label-custom">Hình
                                    ảnh</label>
                                <div className="col-sm-7">
                                    <input type="file" id="uploadImage" multiple className="d-none" onChange={handleFile} />
                                    <p className="text-danger">{errors.images}</p>
                                    <label htmlFor="uploadImage" className="btn btn-primary btn-choose-img" style={{ marginRight: "10px" }}>Chọn ảnh</label>
                                    {input.images.map((file, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)}
                                            width="50"
                                        />
                                    ))}
                                </div>
                            </div>
                            <hr className="mb-4" style={{ borderColor: '#e5e7eb' }} />
                            <div className="row">
                                <div className="col-sm-3" />
                                <div className="col-sm-7 d-flex gap-2">
                                    <button type="reset" className="btn btn-primary btn-reset" onClick={handleReset}>Reset</button>
                                    <button type="submit" className="btn btn-success btn-submit">Thêm Sản Phẩm</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddProduct;