import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './createChatModel.css';
const CreateChatModal = ({ onClose, onSave }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const handleSave = () => {
        if (firstName && lastName) {
            onSave({ firstName, lastName });
        }
        else {
            alert('Please provide both first and last name');
        }
    };
    return (_jsx("div", { className: "modal", children: _jsxs("div", { className: "modalContent", children: [_jsx("h2", { children: "Create New Chat" }), _jsx("input", { type: "text", placeholder: "First Name", value: firstName, onChange: (e) => setFirstName(e.target.value) }), _jsx("input", { type: "text", placeholder: "Last Name", value: lastName, onChange: (e) => setLastName(e.target.value) }), _jsx("button", { onClick: handleSave, children: "Create" }), _jsx("button", { onClick: onClose, children: "Cancel" })] }) }));
};
export default CreateChatModal;
