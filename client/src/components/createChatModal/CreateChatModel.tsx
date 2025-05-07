import { useState } from 'react';
import './createChatModel.css'

type Props = {
  onClose: () => void;
  onSave: (data: { firstName: string; lastName: string }) => void;
}

const CreateChatModal:React.FC<Props> = ({ onClose, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSave = () => {
    if (firstName && lastName) {
      onSave({ firstName, lastName });
    } else {
      alert('Please provide both first and last name');
    }
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Create New Chat</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={handleSave}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateChatModal;
