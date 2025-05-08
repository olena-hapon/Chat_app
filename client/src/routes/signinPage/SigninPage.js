import { jsx as _jsx } from "react/jsx-runtime";
import { SignIn } from "@clerk/clerk-react";
import './signinPage.css';
const SigninPage = () => {
    return (_jsx("div", { className: "signInPage", children: _jsx(SignIn, { path: "/sign-in", signUpUrl: "/sign-up", forceRedirectUrl: "/dashboard" }) }));
};
export default SigninPage;
