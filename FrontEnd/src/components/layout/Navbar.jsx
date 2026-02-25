import React from 'react';
import useAuthStore from '../../store/authStore';
import UserNavbar from './UserNavbar';
import ManagerNavbar from './ManagerNavbar';
// Since AdminNavbar was missing earlier, we use ManagerNavbar as fallback or can create one.
// Let's create an AdminNavbar if it doesn't exist.

const Navbar = (props) => {
    const { user } = useAuthStore();

    if (user?.role === 'ADMIN') return <ManagerNavbar {...props} />; // Using ManagerNavbar for Admin too as it's powerful
    if (user?.role === 'MANAGER') return <ManagerNavbar {...props} />;
    return <UserNavbar {...props} />;
};

export default Navbar;
