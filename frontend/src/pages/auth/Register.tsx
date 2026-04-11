import { Link } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../../services/axiosClient";

interface RegisterForm {
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
};
interface FormError {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

function Register() {
    const [input, setInput] = useState<RegisterForm>({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<FormError>({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errorSubmit: FormError = {};
        let flag = true;
        let checkPhone = /^(0)[0-9]{9}$/;
        let checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (input.name === "") {
            errorSubmit.name = "Vui lòng nhập tên đăng nhập";
            flag = false;
        }
        if (input.email == "") {
            errorSubmit.email = "Vui lòng nhập email";
            flag = false;
        } else if (!checkEmail.test(input.email)) {
            errorSubmit.email = "Email sai định dạng";
            flag = false;
        }
        if (input.phone == "") {
            errorSubmit.phone = "Vui lòng nhập số điện thoại";
            flag = false;
        } else if (!checkPhone.test(input.phone)) {
            errorSubmit.phone = "Số điện thoại phải gồm 10 số và bắt đầu bằng 0";
            flag = false;
        }
        if (input.password == "") {
            errorSubmit.password = "Vui lòng nhập password";
            flag = false;
        }
        if (input.confirmPassword === "") {
            errorSubmit.confirmPassword = "Vui lòng nhập lại mật khẩu";
            flag = false;
        } else if (input.password !== input.confirmPassword) {
            errorSubmit.confirmPassword = "Mật khẩu không khớp";
            flag = false;
        }
        if (!flag) {
            setErrors(errorSubmit);
        } else {
            const data = {
                name: input.name,
                email: input.email,
                phone: input.phone,
                password: input.password,
                password_confirmation: input.confirmPassword,
                role: 'admin'
            };
            console.log(data);
            axiosClient.post("/register", data)
                .then((response) => {
                    console.log("SUCCESS:", response);
                    alert("Đăng ký thành công");

                    setInput({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                    });

                    setErrors({});
                })
                .catch((error) => {
                    console.log("ERROR:", error.response?.data);

                    if (error.response?.data?.errors) {
                        setErrors(error.response.data.errors);
                    }
                });
            console.log("input");
        }
        console.log(input);
    };

    return (
        <form className="register-box" onSubmit={handleRegister}>
            <h2>Đăng ký</h2>

            <div className="input-box">
                <input type="text" name="name" placeholder="Tên đăng nhập" value={input.name} onChange={handleInput} />
                {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="input-box">
                <input type="email" name="email" placeholder="Email" value={input.email} onChange={handleInput} />
                {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="input-box">
                <input type="text" name="phone" placeholder="Số điện thoại" value={input.phone} onChange={handleInput} />
                {errors.phone && <div className="error">{errors.phone}</div>}
            </div>

            {/* PASSWORD */}
            <div className="input-box">
                <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                    value={input.password}
                    onChange={handleInput}
                />
                <span className="toggle-password" onClick={() => setShowPass(!showPass)}>
                    <i className={`fa ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                </span>
                {errors.password && <div className="error">{errors.password}</div>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-box">
                <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={input.confirmPassword}
                    onChange={handleInput}
                />
                <span className="toggle-password" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                    <i className={`fa ${showConfirmPass ? "fa-eye-slash" : "fa-eye"}`} />
                </span>

                {errors.confirmPassword && (
                    <div className="error">{errors.confirmPassword}</div>
                )}
            </div>

            <button type="submit" className="register-btn">
                Đăng ký
            </button>

            <div className="extra-links">
                Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
            </div>
        </form>
    );
}

export default Register;