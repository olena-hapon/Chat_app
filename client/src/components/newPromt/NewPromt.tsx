import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { useParams } from 'react-router-dom';
import './newPromt.css';

type Props = {
  onSend : () => void,
  messages: any,
}
const NewPromt:React.FC<Props> = ({ onSend, messages }) => {
  const [text, setText] = useState('');
  const { id: chatId } = useParams();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = await getToken();
      await fetch(`https://chat-backend-jfbx.onrender.com/api/chats/${chatId}/messages`, {
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

    } catch (err) {
      console.log('Failed to send message', err);
    }
  };
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <div className="newPropt">
        <form className="newForm" onSubmit={handleSubmit}>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
          <button>
            <img src="./arrow.png" alt="" />
          </button>
        </form>
      </div>

      <div className="endChat" ref={endRef}></div>
    </>
  );
};

export default NewPromt;
