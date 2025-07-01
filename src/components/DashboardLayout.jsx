import { Navigate, Outlet, useNavigate } from "react-router-dom";
import SidebarContextProvider from "../context/SidebarContext";
import { useAuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { getUserByid } from "../utils/apis";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
    const { currentUser, setUserDetails, handleLogout } = useAuthContext()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const fetchUserDetails = async (id) => {
        setIsLoading(true)
        try {
            const res = await getUserByid(id);
            if (res.data) {
                setUserDetails(res.data?.user)
            }

        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            } else if (error?.message) {
                toast.error(error?.message);
            } else {
                toast.error("something went wrong");
            }
            setTimeout(() => {
                handleLogout()
                navigate("/login")
            }, 1000)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        if (currentUser) {
            fetchUserDetails(currentUser?.id)
        } else {
            navigate("/dashboard")
        }
    }, [currentUser])
    return (
        <>
            <SidebarContextProvider>
                <div className="dashboard">
                    <Sidebar />
                    <Outlet />
                </div>
            </SidebarContextProvider>
        </>

    );
};

export default DashboardLayout;
