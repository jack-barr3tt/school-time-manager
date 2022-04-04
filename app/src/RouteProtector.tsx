import { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useUser } from "./Hooks/useUser";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

function RequireAuth(props: { children: ReactNode}) {
    const { isAuth } = useUser();
    const location = useLocation();
  
    if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />
    return <>{props.children}</>;
  }

export default function RouteProtector (props: { children: ReactNode }) {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="*" element={
                <RequireAuth>
                    {props.children}
                </RequireAuth>
            }/>
        </Routes>
    </BrowserRouter>
}