import { FaHome, FaBook, FaList, FaClipboardList, FaBookmark } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useSidebarContext } from "../context/SidebarContext";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

const Sidebar = () => {
  const { currentTab, setCurrentTab, isSidebar, setIsSidebar } = useSidebarContext();
  const { handleLogout } = useAuthContext();

  const handleSwitchTab = (tab) => {
    setIsSidebar(false)
    setCurrentTab(tab);
  }

  const handleCloseSidebar = () => setIsSidebar(false);
  const sidebarRef = useRef(null)

  return (
    <div className={`sidebar ${isSidebar ? "sidebar-active" : ""}`} ref={sidebarRef}>
      <nav className="side-nav">
        <div className="nav-close" onClick={handleCloseSidebar}>
          <IoMdClose className="nav-close-icon"/>
        </div>
        <div className="side-nav-top">
          <div
            className={`side-nav-item ${currentTab === "home" ? "side-nav-item-active" : ""
              }`}
            onClick={() => handleSwitchTab("home")}
          >
            <FaHome className="side-nav-item-icon" color="#fff" />
            <p>Home</p>
          </div>
        </div>
        <div className="side-nav-bottom" onClick={handleLogout}>
          <div className="side-nav-bottom-item">
            <p>Logout</p>
            <MdLogout className="side-nav-bottom-icon" color="#fff" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
