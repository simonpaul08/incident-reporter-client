import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);

    const API_URL = import.meta.env.VITE_APP_SERVER_URL;

    const publicInstance = axios.create({
        baseURL: `${API_URL}`,
    });

    const token = localStorage.getItem("incident_data_token")

    const privateInstance = axios.create({
        baseURL: `${API_URL}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });


    // handle set user
    const handleSetUser = (user, token) => {
        setCurrentUser(user)
        localStorage.setItem("incident_data_user", JSON.stringify(user));
        localStorage.setItem("incident_data_token", token)
    }

    // handle logout 
    const handleLogout = () => {
        setCurrentUser(null)
        localStorage.removeItem("incident_data_user")
        localStorage.removeItem("incident_data_token")
    }

    let values = {
        currentUser,
        setCurrentUser,
        token,
        handleSetUser,
        handleLogout,
        publicInstance,
        privateInstance
    }

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("incident_data_user"));
        let token = localStorage.getItem("incident_data_token")
        if (user && token) {
            console.log("users have ")
            setCurrentUser(user)
        }
    }, [])


    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
