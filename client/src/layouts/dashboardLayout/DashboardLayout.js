import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-ignore
import { Outlet, useNavigate } from 'react-router-dom';
import './dashboardLauot.css';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Chatlist from '../../components/chatList/Chatlist';
const DashboardLayout = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [isLoaded, userId, navigate]);
    if (!isLoaded)
        return "Loading...";
    return (_jsxs("div", { className: 'dashboardLayout', children: [_jsx("div", { className: "menu", children: _jsx(Chatlist, {}) }), _jsx("div", { className: "content", children: _jsx(Outlet, {}) })] }));
};
export default DashboardLayout;
