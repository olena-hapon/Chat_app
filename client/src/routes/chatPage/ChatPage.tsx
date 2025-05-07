import NewPromt from '../../components/newPromt/NewPromt';
import './chatPage.css';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';

const fetchChatMessages = async (chatId:string, token:string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Error fetching chat')
  }
  return response.json();
};

const ChatPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['chatMessages', id],
    queryFn: async () => {
      const token = await getToken();

      if (!id) return;
      if (!token) return;
      return fetchChatMessages(id, token)
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data && data.messages.length === 0) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [data, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { participant, messages } = data;

  return (
    <div className="chatPage">
      <div className="header">
        <div className="image">
          <img src="./user.png" alt="" />
        </div>
        <div className="userInfo">
          <span className='fistName'>{participant.firstName}</span>
          <span>{participant.lastName}</span>
        </div>
      </div>
      <div className="wrapper">
        <div className="chat">
          {messages.map((mes:any) => (
            <div 
              key={mes._id}
              className={`message ${mes.sender === 'user' ? 'user' : ''}`}
            >
            {mes.text}
            </div>
          ))}
          <NewPromt onSend={refetch} messages={messages}/>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
