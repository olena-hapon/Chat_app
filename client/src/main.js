import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// @ts-ignore
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/rootLayout/RootLayout';
import Homepage from './routes/homepage/Homepage';
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import ChatPage from './routes/chatPage/ChatPage';
import SigninPage from './routes/signinPage/SigninPage';
import SignupPage from './routes/signupPage/SignupPage';
const router = createBrowserRouter([
    {
        element: _jsx(RootLayout, {}),
        children: [
            {
                path: "/",
                element: _jsx(Homepage, {})
            },
            {
                path: "/sign-in/*",
                element: _jsx(SigninPage, {})
            },
            {
                path: "/sign-up/*",
                element: _jsx(SignupPage, {})
            },
            {
                element: _jsx(DashboardLayout, {}),
                children: [
                    {
                        path: "/dashboard",
                        element: _jsx(DashboardPage, {})
                    },
                    {
                        path: "/dashboard/chats/:id",
                        element: _jsx(ChatPage, {}),
                    },
                ],
            },
        ],
    },
]);
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
