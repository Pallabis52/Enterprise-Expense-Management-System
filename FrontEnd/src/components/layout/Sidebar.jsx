import React from 'react';
import useAuthStore from '../../store/authStore';
import UserSidebar from './UserSidebar';
import ManagerSidebar from './ManagerSidebar';
import AdminSidebar from './AdminSidebar';

const Sidebar = (props) => {
    const { user } = useAuthStore();

    if (user?.role === 'ADMIN') return <AdminSidebar {...props} />;
    if (user?.role === 'MANAGER') return <ManagerSidebar {...props} />;
    return <UserSidebar {...props} />;
};

export default Sidebar;
