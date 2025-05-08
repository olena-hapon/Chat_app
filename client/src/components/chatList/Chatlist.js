import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Link, useNavigate } from 'react-router-dom';
import CreateChatModal from '../createChatModal/CreateChatModel';
import './chatList.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import ToogleBTN from '../ToogleBtn/ToogleBtn';
const Chatlist = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [chatToEdit, setChatToEdit] = useState(null);
    const menuRef = useRef(null);
    console.log(isModalOpen);
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data } = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch chats");
            }
            return await response.json();
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
    console.log(chatToEdit);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const filteredChats = data?.filter((chat) => chat.participant.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        chat.participant.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())) || [];
    const handleCreateChat = async (newChat) => {
        setSearchQuery('');
        try {
            const token = await getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newChat),
            });
            if (!res.ok) {
                throw new Error('Failed to create chat');
            }
            const createChat = await res.json();
            queryClient.setQueryData(['chats'], (oldChats = []) => {
                return [...oldChats, createChat];
            });
            navigate(`/dashboard/chats/${createChat._id}`);
            setTimeout(() => {
                // @ts-ignore
                queryClient.invalidateQueries(['chats']);
            }, 3500);
            console.log('Chat created:', createChat);
            setIsModalOpen(false);
        }
        catch (err) {
            console.log('Error creating chat:', err);
        }
    };
    const handleDelateChat = async (chatId) => {
        try {
            const token = await getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to delete");
            }
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            setChatToDelete(null);
        }
        catch (err) {
            console.log("Error deleting chat", err);
        }
    };
    const handleEditSave = async () => {
        if (!chatToEdit)
            return;
        try {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: chatToEdit.participant.firstName,
                    lastName: chatToEdit.participant.lastName,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update chat');
            }
            const updatedChat = await response.json();
            console.log('Chat updated:', updatedChat);
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            setChatToEdit(null);
        }
        catch (error) {
            console.log('Error updating chat:', error);
        }
    };
    const closeDeleteModal = () => {
        setChatToDelete(null);
        setSearchQuery('');
        setIsModalOpen(false);
    };
    return (_jsxs("div", { className: "chatList", children: [_jsxs("div", { className: "chatForm", children: [_jsxs("div", { className: 'chatForm_top', children: [_jsx("img", { src: "./user.png", alt: "" }), _jsx(ToogleBTN, {})] }), _jsxs("div", { className: "chatForm_search", children: [_jsx("img", { src: "./search.png", alt: "" }), _jsx("input", { className: "chatForm_input", type: "text", placeholder: "Search or start new chat", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), !filteredChats.length && !isModalOpen && (_jsx("button", { className: 'delete', onClick: () => setIsModalOpen(true), children: "No results found. Create a new chat" }))] }), _jsxs("div", { className: "list", children: [_jsx("h3", { children: "Chats" }), filteredChats.map((chat) => {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const formatedData = new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }).format(new Date(chat.createdAt));
                        return (_jsxs(Link, { className: "listItem", to: `/dashboard/chats/${chat._id}`, children: [_jsxs("div", { className: "userInfo", children: [_jsxs("div", { className: "userData", children: [_jsx("span", { children: chat.participant.firstName }), _jsx("span", { children: chat.participant.lastName })] }), _jsx("div", { className: "userTitle", children: lastMessage?.text
                                                ? lastMessage.text.split(' ').slice(0, 5).join(' ') + ' ...'
                                                : '' })] }), _jsxs("div", { className: "created", children: [_jsx("div", { className: "", children: formatedData }), _jsx("div", { className: "hidden", onClick: () => setActiveMenu(activeMenu === chat._id ? null : chat._id), children: "+" })] }), activeMenu === chat._id && (_jsxs("div", { className: "activeMenu", ref: menuRef, children: [_jsx("div", { onClick: () => {
                                                setChatToEdit(chat);
                                                setActiveMenu(null);
                                            }, children: "edit user" }), _jsx("div", { onClick: () => {
                                                setChatToDelete(chat._id);
                                                setActiveMenu(null);
                                            }, children: "remove" })] }))] }, chat._id));
                    })] }), isModalOpen && (_jsx(CreateChatModal, { onClose: closeDeleteModal, onSave: handleCreateChat })), chatToDelete && (_jsx("div", { className: "modalOverlay", children: _jsxs("div", { className: "modalChat", children: [_jsx("p", { children: "Are you sure you want to delete this chat?" }), _jsx("button", { onClick: () => handleDelateChat(chatToDelete), children: "Yes" }), _jsx("button", { onClick: closeDeleteModal, children: "No" })] }) })), chatToEdit && (_jsx("div", { className: "modalOverlay", children: _jsxs("div", { className: "modalChat", children: [_jsx("h3", { children: "Edit user" }), _jsx("input", { value: chatToEdit?.participant?.firstName || '', onChange: (e) => setChatToEdit({
                                ...chatToEdit,
                                participant: {
                                    ...chatToEdit.participant,
                                    firstName: e.target.value,
                                }
                            }) }), _jsx("input", { value: chatToEdit?.participant?.lastName, onChange: (e) => setChatToEdit({
                                ...chatToEdit,
                                participant: {
                                    ...chatToEdit.participant,
                                    lastName: e.target.value,
                                }
                            }) }), _jsx("button", { onClick: handleEditSave, children: "Save" }), _jsx("button", { onClick: () => setChatToEdit(null), children: "Cancel" })] }) }))] }));
};
export default Chatlist;
