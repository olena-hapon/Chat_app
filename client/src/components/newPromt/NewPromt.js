import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { useParams } from 'react-router-dom';
import './newPromt.css';
const NewPromt = ({ onSend, messages }) => {
    const [text, setText] = useState('');
    const { id: chatId } = useParams();
    const { getToken } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim())
            return;
        try {
            const token = await getToken();
            await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text }),
            });
            setText('');
            onSend();
            setTimeout(() => {
                onSend();
            }, 4000);
        }
        catch (err) {
            console.log('Failed to send message', err);
        }
    };
    const endRef = useRef(null);
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "newPropt", children: _jsxs("form", { className: "newForm", onSubmit: handleSubmit, children: [_jsx("input", { type: "text", value: text, onChange: (e) => setText(e.target.value) }), _jsx("button", { children: _jsx("img", { src: "./arrow.png", alt: "" }) })] }) }), _jsx("div", { className: "endChat", ref: endRef })] }));
};
export default NewPromt;
