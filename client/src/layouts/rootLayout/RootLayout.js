import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// @ts-ignore
import { Link, Outlet } from 'react-router-dom';
import './rootLayout.css';
const PUBLISHABLE_KEY = 'pk_test_YmFsYW5jZWQtcGVnYXN1cy01NS5jbGVyay5hY2NvdW50cy5kZXYk';
if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
}
const queryClient = new QueryClient();
const RootLayout = () => {
    return (_jsx(ClerkProvider, { publishableKey: PUBLISHABLE_KEY, afterSignOutUrl: "/", children: _jsx(QueryClientProvider, { client: queryClient, children: _jsxs("div", { className: "rootLayout", children: [_jsxs("header", { children: [_jsx(Link, { to: "/#", children: _jsx("span", { children: "Chat app" }) }), _jsx("div", { className: "user", children: _jsx(SignedIn, { children: _jsx(UserButton, {}) }) })] }), _jsx("main", { children: _jsx(Outlet, {}) })] }) }) }));
};
export default RootLayout;
