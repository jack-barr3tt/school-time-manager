import { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MainGrid } from "./App";
import { useUser } from "./Hooks/useUser";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

function RequireAuth(props: { children: ReactNode}) {
    const { isAuth } = useUser()
    const location = useLocation()
  
    // If the user is not authenticated, redirect to the login page
    if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />
    // Otherwise, render the children
    return <>{props.children}</>
  }

export default function RouteProtector (props: { children: ReactNode }) {
    return <BrowserRouter>
        <Routes>
            {/* The login and register pages should be accessible whether or not the user is authenticated */}
            <Route path="/login" element={<MainGrid><Login/></MainGrid>}/>
            <Route path="/register" element={<MainGrid><Register/></MainGrid>}/>    
            {/* The rest of the pages should only be accessible if the user is authenticated */}
            <Route path="*" element={
                <RequireAuth>
                    {props.children}
                </RequireAuth>
            }/>
        </Routes>
    </BrowserRouter>    
}