import { jsx as _jsx } from "react/jsx-runtime";
import './signupPage.css';
import { SignUp } from '@clerk/clerk-react';
const SignupPage = () => {
    return (_jsx("div", { className: 'signUpPage', children: _jsx(SignUp, { path: "/sign-up", signInUrl: "sign-in" }) }));
};
export default SignupPage;
