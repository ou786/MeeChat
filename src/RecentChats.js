import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecentChats({ currentUser, chats,chat, onSelectChat }) {
      const recentChats = chats || []; // ✅ fix


  return (
  <div style={container}>
    <ul style={{
  overflowX: 'auto',
  maxHeight: '50vh',
  padding: 0,
  margin: 0,
  listStyle: 'none',
}}>

      {recentChats
  .filter(chat => chat && chat.username)
  .map(chat => {
    const isUnread = chat.last_message &&
                     chat.last_message.sender_id !== currentUser.id &&
                     !chat.last_message.seen;

    return (
      <li
        key={chat.id}
        onClick={() => onSelectChat(chat)}
        style={{
          ...chatCard,
          backgroundColor: isUnread ? '#fff8dc' : '#f9f9f9',
          borderLeft: isUnread ? '4px solid orange' : 'none'
        }}
      >
        <div style={avatar(chat.username)}>
          {chat.username[0].toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <div style={username}>
            {chat.username}
            {isUnread && (
              <span style={{ color: 'orange', fontSize: '12px', marginLeft: '6px' }}>
                🟠 New
              </span>
            )}
          </div>

          <div style={lastMessage}>
            {chat.last_message?.content || 'No messages yet'}
          </div>

          <div style={timestamp}>
            {chat.last_message?.timestamp
              ? new Date(chat.last_message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </div>
        </div>
      </li>
    );
  })}


    </ul>
  </div>
);

}

// ──────── Styles ────────
const container = {
  padding: '1rem',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  marginBottom: '2rem',
};

const heading = {
  fontSize: '1.2rem',
  marginBottom: '1rem',
  borderBottom: '1px solid #ddd',
  paddingBottom: '0.5rem',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const chatCard = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  marginBottom: '10px',
  transition: 'background 0.2s',
};

const avatar = (name) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#007bff',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'uppercase',
});

const username = {
  fontWeight: 'bold',
  fontSize: '14px',
};

const timestamp = {
  fontSize: '12px',
  color: '#777',
};
const lastMessage = {
  fontSize: '13px',
  color: '#555',
  marginTop: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '200px',
};


export default RecentChats;
