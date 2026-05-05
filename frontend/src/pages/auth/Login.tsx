import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

interface LoginForm {
    email: string,
    password: string
}
interface FormError {
    email?: string;
    password?: string;
}
function Login() {
    const [input, setInput] = useState<LoginForm>({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<FormError>({});
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev, [name]: value
        }));
    }

    function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errorSubmit: FormError = {};
        let flag = true;
        let checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (input.email == "") {
            errorSubmit.email = "Vui lòng nhập email";
            flag = false;
        } else if (!checkEmail.test(input.email)) {
            errorSubmit.email = "Email sai định dạng";
            flag = false;
        }
        if (input.password === "") {
            errorSubmit.password = "Vui lòng nhập password";
            flag = false;
        }

        if (!flag) {
            setErrors(errorSubmit);
        } else {
            setErrors({});

            const data = {
                email: input.email,
                password: input.password
            };

            axiosClient.post("/login", data)
                .then((response) => {
                    console.log("success", response);
                    toast.success("Đăng nhập thành công");

                    const user = response.data.user;
                    const token = response.data.token;

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    if (user.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                })
                .catch((error) => {
                    console.log("error: ", error.response?.data);

                    if (error.response?.data?.errors) {
                        setErrors(error.response.data.errors);
                    } else {
                        setErrors({
                            email: "Sai tài khoản hoặc mật khẩu",
                            password: " "
                        });
                    }
                });
        }
    }
    return (
        <>
            <form className="login-box" onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>
                <div className="input-box">
                    <input type="email" name="email" placeholder="Email" value={input.email} onChange={handleInput} />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div className="input-box">
                    <input type={showPass ? "text" : "password"} name="password" id="password" placeholder="Mật khẩu" value={input.password} onChange={handleInput} />
                    <span className="toggle-password" onClick={() => setShowPass(!showPass)}>
                        <i className={`fa ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                    </span>
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <button type="submit" className="login-btn">Đăng nhập</button>
                <div className="extra-links">
                    <Link to="/auth/forgot-password">Quên mật khẩu?</Link>
                    <Link to="/auth/register">Tạo tài khoản?</Link>
                </div>
            </form>
        </>
    );
}
export default Login;