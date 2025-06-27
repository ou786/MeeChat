import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EmailLogin from './EmailLogin';
import EmailRegister from './EmailRegister';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import RecentChats from './RecentChats';

function App() {
  const [user, setUser] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);


  // Load user from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Fetch recent chats
  const fetchRecentChats = useCallback(async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/recent_chats/${user.id}`);
    setRecentChats(res.data);
  } catch (err) {
    console.error("Failed to fetch recent chats:", err);
  }
}, [user?.id]);


  useEffect(() => {
    if (user) fetchRecentChats();
  }, [user, fetchRecentChats]);

  useEffect(() => {
    const interval = setInterval(fetchRecentChats, 3000);
    return () => clearInterval(interval);
  }, [fetchRecentChats]);

  // Fetch user map
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://127.0.0.1:8000/users');
      const map = {};
      res.data.forEach(u => map[u.id] = u.username);
      setUsersMap(map);
    };
    if (user) fetchUsers();
  }, [user]);

  // Typing and online tracking
  useEffect(() => {
  const interval = setInterval(async () => {
    if (!chatWith) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/typing_status`, {
        params: { user_id: chatWith.id },
      });

      setIsTyping(res.data.is_typing); // ✅ Update typing status here

      const statusRes = await axios.get(`http://127.0.0.1:8000/online_status/${chatWith.id}`);
      setChatWith(prev => prev ? { ...prev, isOnline: statusRes.data.online } : null);
    } catch (err) {
      console.error('Polling failed:', err);
    }
  }, 2000);
  return () => clearInterval(interval);
}, [chatWith]);


  // Messages
  const fetchMessages = useCallback(async () => {
  if (!user || !chatWith) return;
  try {
    // 1. Fetch messages
    const res = await axios.get('http://127.0.0.1:8000/messages', {
      params: {
        from_user: chatWith.id,
        to_user: user.id,
      },
    });
    setMessages(res.data);

    // 2. Mark as seen
    await axios.post('http://127.0.0.1:8000/messages/seen', {
      from_user: chatWith.id,
      to_user: user.id,
    });

    // 3. Check online status
    const statusRes = await axios.get(`http://127.0.0.1:8000/online_status/${chatWith.id}`);
    const isOnline = statusRes.data.online;
    setChatWith(prev => ({ ...prev, isOnline }));

    // ✅ 4. Refresh recent chats list
    await fetchRecentChats();

  } catch (err) {
    console.error('Message fetching failed:', err);
  }
}, [user, chatWith, fetchRecentChats]); // ← also add `fetchRecentChats` in deps


  useEffect(() => {
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        axios.post('http://127.0.0.1:8000/update_last_seen', {
          user_id: user.id,
        }).catch(err => {
          console.error('Last seen update failed:', err);
        });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [user]);

  // ─────── UI Rendering ───────
  if (!user) {
    return isRegistering ? (
      <EmailRegister onRegistered={setUser} setIsRegistering={setIsRegistering} />
    ) : (
      <EmailLogin onLogin={setUser} setIsRegistering={setIsRegistering} />
    );
  }

  if (!chatWith) {
    <div style={{
  padding: '2rem',
  maxWidth: '700px',
  margin: '0 auto',
}}></div>
    return (
  <div style={welcomeWrapper}>
  <div style={topBar}>
<h2 style={{ fontWeight: 500, fontSize: '1.8rem', color: '#333' }}>
  MeeChat <span style={{ fontWeight: 300, color: '#777' }}>| {user.username}</span>
</h2>


    <button
      onClick={() => {
        sessionStorage.removeItem('user');
        setUser(null);
        setIsRegistering(false);
      }}
      style={buttonStyle}
    >
      Logout
    </button>
  </div>

  <div style={mainContent}>
    <div style={sidePanel}>
        <h3 style={sectionHeading}>Recent Chats</h3>

      <RecentChats currentUser={user} chats={recentChats} onSelectChat={setChatWith} />
    </div>
    <div style={sidePanel}>
      <h3 style={sectionHeading}>Available Users</h3>
      <UserList currentUser={user} onSelect={setChatWith} />
    </div>
  </div>
</div>

);


  }

  return (

    
<div style={mainContainer}>
      <div style={{
  padding: '2rem',
  maxWidth: '700px',
  margin: '0 auto',
}}>

  <button onClick={() => setChatWith(null)} style={{
    marginLeft: '10px',
    fontSize: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
  }}>
    ← Back
  </button>

  <h2 style={{ margin: '0 auto', fontSize: '18px' }}>
     {chatWith.username}
    <span style={{ color: chatWith.isOnline ? 'green' : 'black', marginLeft: '10px' }}>
      ● {chatWith.isOnline ? 'Online' : 'Offline'}
    </span>
  </h2>
</div>

      <MessageList
        messages={messages}
        currentUserId={user.id}
        usersMap={usersMap}
        onRefresh={fetchMessages}
      />

      {isTyping && (
  <div style={{ marginBottom: '10px', color: '#888', fontStyle: 'italic' }}>
    {chatWith.username} is typing...
  </div>
)}


      <MessageForm
        senderId={user.id}
        receiverId={chatWith.id}
        onSend={fetchMessages}
        onMessageSent={fetchRecentChats}
      />
    </div>
  );
}

const mainContainer = {
  padding: '2rem',
  maxWidth: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
};

const welcomeWrapper = {
  padding: '2rem',
  maxWidth: '1100px',
  margin: '0 auto',
};

const topBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};

const logoutBtn = {
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const mainContent = {
  display: 'flex',
  gap: '2rem',
  flexWrap: 'wrap',
};

const sidePanel = {
  flex: 1,
  minWidth: '300px',
};

const sectionHeading = {
  fontSize: '24px',
  marginBottom: '1rem',
  color: '#333',
};



const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  margin: '10px 0',
};

export default App;
