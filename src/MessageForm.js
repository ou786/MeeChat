import React, { useState } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

function MessageForm({ senderId, receiverId, onSend, onMessageSent }) {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newMessage = {
      sender_id: senderId,
      receiver_id: receiverId,
      content: content.trim(),
    };

    try {
      await axios.post('http://127.0.0.1:8000/messages', newMessage);
      setContent('');
      onSend();
      if (onMessageSent) onMessageSent();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const newMessage = {
        sender_id: senderId,
        receiver_id: receiverId,
        content: '[image]',
        image: base64Image,
      };
      try {
        await axios.post('http://127.0.0.1:8000/messages', newMessage);
        onSend();
        if (onMessageSent) onMessageSent();
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSend} style={formStyle}>
      <div style={inputWrapper}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={iconButton}
        >
          😊
        </button>

        <label style={{ ...iconButton, marginLeft: 8 }}>
          📎
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>

        <input
        
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={inputField}
        />

        <button type="submit" style={sendButton}>
          ➤
        </button>
      </div>

      {showEmojiPicker && (
        <div style={emojiPickerContainer}>
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => setShowEmojiPicker(false)}
              style={closeButton}
            >
              ✖
            </button>
          </div>
          <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
        </div>
      )}
    </form>
  );
}

// ─── Styles ──────────────────────────────
const formStyle = {
  marginTop: '1rem',
};

const inputWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: '#f5f5f5',
  borderRadius: '30px',
  padding: '8px 16px',
};

const inputField = {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '16px',
};

const sendButton = {
  backgroundColor: '#007bff',
  border: 'none',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '16px',
};

const iconButton = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

const closeButton = {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  color: '#888',
  cursor: 'pointer',
};

const emojiPickerContainer = {
  marginTop: '8px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '8px',
  backgroundColor: '#fff',
};

export default MessageForm;
