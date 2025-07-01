import React from 'react'
import { useAuthContext } from '../context/AuthContext';
import { RiMenu3Fill } from 'react-icons/ri'
import { useSidebarContext } from '../context/SidebarContext';

const Header = () => {

    const { currentUser } = useAuthContext()
    const { setIsSidebar } = useSidebarContext()
    return (
        <div className='header'>
            <div className="header-content">
                <div className='header-content-logo'>
                    <RiMenu3Fill className='header-content-menu' onClick={() => setIsSidebar(true)} />
                    <h3 className='header-content-title'>Incident Reporter | Dashboard</h3>
                </div>
                <div className="header-content-right">
                    <p className='header-content-email'>{currentUser?.email}</p>
                    <p className='header-content-role'>{currentUser?.firstName} {currentUser?.lastName}</p>
                </div>
            </div>
            <hr className='header-content-hr-line' />
        </div>
    )
}

export default Header