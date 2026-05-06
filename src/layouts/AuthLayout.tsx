import { Outlet } from "react-router-dom";
import '../assets/main/css/login.css';

function AuthLayout(){
    return(
        <>
        <div className="auth-layout-container">
            <Outlet/>
        </div>
        </>
    );
}
export default AuthLayout;