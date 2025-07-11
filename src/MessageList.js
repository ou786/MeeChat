import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function MessageList({ messages, currentUserId, usersMap, chatWithId, onRefresh }) {
  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const firstLoad = useRef(true); // ✅ detect first load of chat

  const handleEdit = (msg) => {
    setEditMessageId(msg.id);
    setEditContent(msg.content);
  };

  const submitEdit = async (id) => {
    const message = messages.find((msg) => msg.id === id);
    if (!message) return;
    try {
      await axios.put(`https://meechat-backend.onrender.com/messages/${id}`, {
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        content: editContent,
        image: message.image || null,
      });
      setEditMessageId(null);
      setEditContent('');
      await onRefresh();
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await axios.delete(`https://meechat-backend.onrender.com/messages/${id}`);
        onRefresh();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // 🚩 Track if user scrolled manually
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      setHasUserScrolled(!atBottom);
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  // ✅ Scroll to bottom: ONLY on first load or if user hasn't scrolled manually
  useEffect(() => {
    const container = scrollContainerRef.current;
    const bottom = bottomRef.current;
    if (!container || !bottom) return;

    if (firstLoad.current || !hasUserScrolled) {
      bottom.scrollIntoView({ behavior: firstLoad.current ? 'auto' : 'smooth' });
      firstLoad.current = false; // 🔓 only first time scroll forcibly
    }
  }, [messages]);

  return (
    <div ref={scrollContainerRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <ul style={styles.chatContainer}>
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          const senderName = isOwn ? 'You' : usersMap[msg.sender_id] || `User ${msg.sender_id}`;
          const isEditing = editMessageId === msg.id;

          return (
            <li key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  backgroundColor: isOwn ? '#dcf8c6' : '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderTopLeftRadius: isOwn ? '16px' : '4px',
                  borderTopRightRadius: isOwn ? '4px' : '16px',
                  maxWidth: '90vw',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  position: 'relative',
                  wordBreak: 'break-word',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '5px', color: '#555' }}>
                  {senderName}
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: '90%' }}
                    />
                    <button onClick={() => submitEdit(msg.id)} style={btn}>✅</button>
                    <button onClick={() => setEditMessageId(null)} style={btn}>❌</button>
                  </>
                ) : (
                  <>
                    <div>{msg.content}</div>
                    {msg.image && (
                      <div style={{ marginTop: '5px' }}>
                        <img src={msg.image} alt="sent" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: '#888', marginTop: '5px', textAlign: 'right' }}>
                      {formatTimestamp(msg.timestamp)}
                      {isOwn && (
                        <span style={{ marginLeft: '6px', color: msg.seen ? 'green' : '#aaa' }}>
                          {msg.seen ? '👁️' : '✔️'}
                        </span>
                      )}
                    </div>
                    {isOwn && (
                      <div style={{ marginTop: '4px', textAlign: 'right' }}>
                        <button onClick={() => handleEdit(msg)} style={btn}>✏️</button>
                        <button onClick={() => handleDelete(msg.id)} style={btn}>🗑️</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}

const btn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  marginLeft: '6px',
  fontSize: '14px',
};

const styles = {
  chatContainer: {
    listStyle: 'none',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '1rem',
    height: '60vh',
    overflowY: 'auto',
    backgroundImage: 'url("https://www.toptal.com/designers/subtlepatterns/uploads/restaurant.png")',
    backgroundSize: '150px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'top left',
    backgroundAttachment: 'fixed',
    backgroundColor: '#fff',
    opacity: 0.97,
  },
};

export default MessageList;
