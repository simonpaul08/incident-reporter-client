import { createContext, useContext, useState } from "react";


const SidebarContext = createContext(null);

export const useSidebarContext = () => {
    return useContext(SidebarContext)
}

const SidebarContextProvider = ({ children }) => {

    const [currentTab, setCurrentTab] = useState("home")
    const [isSidebar, setIsSidebar] = useState(false)

    let values = {
        currentTab,
        setCurrentTab,
        isSidebar,
        setIsSidebar
    }

    return (
        <SidebarContext.Provider value={values}>
            {children}
        </SidebarContext.Provider>
    )
}

export default SidebarContextProvider;