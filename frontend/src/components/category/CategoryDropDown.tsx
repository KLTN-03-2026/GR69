import { useState } from "react";
import { Link } from "react-router-dom";

interface CategoryItem {
    name: string;
    path: string;
}

interface Props {
    title?: string;
    items: CategoryItem[];
}

const HeroCategories = ({ title = "Danh mục sản phẩm", items }: Props) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="hero__categories">
            <div
                className="hero__categories__all"
                onClick={() => setOpen((prev) => !prev)}
                style={{ cursor: "pointer" }}
            >
                <i className="fa fa-bars" />
                <span>{title}</span>
            </div>

            {open && (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HeroCategories;