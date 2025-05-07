import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateChatModal from '../createChatModal/CreateChatModel';
import './chatList.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import ToogleBTN from '../ToogleBtn/ToogleBtn';

interface Chat {
  _id: string;
  participant: {
    firstName: string;
    lastName: string;
  };
  messages: {
    text: string;
    sender: 'user' | 'bot';
  }[];
  createdAt: string;
  updatedAt: string;
}

const Chatlist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [chatToEdit, setChatToEdit] = useState<Chat | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  console.log(isModalOpen)

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
  console.log(chatToEdit)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const filteredChats = data?.filter(
    (chat: any) =>
      chat.participant.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      chat.participant.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())
  ) || [];

  const handleCreateChat = async (newChat: { firstName: string; lastName: string }) => {
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
  
      const createChat: Chat = await res.json();
  
      queryClient.setQueryData<Chat[]>(['chats'], (oldChats = []) => {
        return [...oldChats, createChat];
      });
  
      navigate(`/dashboard/chats/${createChat._id}`);
  
      setTimeout(() => {
        queryClient.invalidateQueries(['chats']);
      }, 3500);
  
      console.log('Chat created:', createChat);
      setIsModalOpen(false);
    } catch (err) {
      console.log('Error creating chat:', err);
    }
  };
  

  const handleDelateChat = async(chatId: string) => {
    try {
      const token = await getToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error ("Failed to delete")
      }

      queryClient.invalidateQueries({ queryKey: ['chats']})
      setChatToDelete(null)

    } catch (err) {
      console.log("Error deleting chat", err)
    }
  }

  const handleEditSave = async () => {
    if (!chatToEdit) return;
  
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
    } catch (error) {
      console.log('Error updating chat:', error);
    }
  };

  const closeDeleteModal = () => {
    setChatToDelete(null);
    setSearchQuery('');
    setIsModalOpen(false);
  };

  return (
    <div className="chatList">
      <div className="chatForm">
        <div className='chatForm_top'>
          <img src="/user.png" alt="" />
          <ToogleBTN />
        </div>
        <div className="chatForm_search">
          <img src="/search.png" alt="" />
          <input
            className="chatForm_input"
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {!filteredChats.length && !isModalOpen && (
          <button className='delete' onClick={() => setIsModalOpen(true)}>No results found. Create a new chat</button>
        )}
      </div>
      <div className="list">
        <h3>Chats</h3>
        {filteredChats.map((chat:any) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const formatedData = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(new Date(chat.createdAt));
          return (
            <Link className="listItem" key={chat._id} to={`/dashboard/chats/${chat._id}`}>
            <div className="userInfo">
              <div className="userData">
                <span>{chat.participant.firstName}</span>
                <span>{chat.participant.lastName}</span>
              </div>
              <div className="userTitle">
                {lastMessage?.text
                  ? lastMessage.text.split(' ').slice(0,5).join(' ') + ' ...'
                  : ''
                }
              </div>
            </div>
            <div className="created">
              <div className="">{formatedData}</div>
              <div
                className="hidden"
                onClick={() => setActiveMenu(activeMenu === chat._id ? null : chat._id)}>
                +
              </div>
            </div>

            {activeMenu === chat._id && (
              <div className="activeMenu" ref={menuRef}>
                <div onClick={() => {
                  setChatToEdit(chat)
                  setActiveMenu(null)
                }}
                >
                  edit user
                </div>
                <div onClick={() => {
                  setChatToDelete(chat._id)
                  setActiveMenu(null)
                }}
                >
                  remove
                </div>
              </div>
            )}
          </Link>
          )
        })}
      </div>

      {isModalOpen && (
        <CreateChatModal onClose={closeDeleteModal} onSave={handleCreateChat} />
      )}

      {chatToDelete && (
        <div className="modalOverlay">
          <div className="modalChat">
            <p>Are you sure you want to delete this chat?</p>
            <button onClick={() => handleDelateChat(chatToDelete)}>Yes</button>
            <button onClick={closeDeleteModal}>No</button>
          </div>
        </div>
      )}

      {chatToEdit && (
        <div className="modalOverlay">
          <div className="modalChat">
            <h3>Edit user</h3>
            <input
              value={chatToEdit?.participant?.firstName || ''}
              onChange={(e) => setChatToEdit({
                ...chatToEdit,
                participant: {
                  ...chatToEdit.participant,
                  firstName: e.target.value,
                }
              })}
            />
            <input
              value={chatToEdit?.participant?.lastName}
              onChange={(e) => setChatToEdit({
                ...chatToEdit,
                participant: {
                  ...chatToEdit.participant,
                  lastName: e.target.value,
                }
              })}
            />
            <button onClick={handleEditSave}>Save</button>
            <button onClick={() => setChatToEdit(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatlist;
