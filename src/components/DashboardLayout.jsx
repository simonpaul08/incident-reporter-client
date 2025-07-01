import { Navigate, Outlet } from "react-router-dom";
import SidebarContextProvider from "../context/SidebarContext";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
    const user = JSON.parse(localStorage.getItem("incident_data_user"))
    return (
        <>
            {user ?
                <SidebarContextProvider>
                    <div className="dashboard">
                        <Sidebar />
                        <Outlet />
                    </div>
                </SidebarContextProvider> :
                <Navigate to="/register" />}
        </>

    );
};

export default DashboardLayout;
