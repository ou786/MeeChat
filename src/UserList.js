import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList({ currentUser, onSelect }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [onlineMap, setOnlineMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://127.0.0.1:8000/users');
      const filtered = res.data.filter(u => u.id !== currentUser.id);
      setUsers(filtered);
    };
    fetchUsers();
  }, [currentUser]);

  // ✅ Poll online status every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const newStatus = {};
      for (let user of users) {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/online_status`, {
            params: { user_id: user.id }
          });
          newStatus[user.id] = res.data.online;
        } catch {
          newStatus[user.id] = false;
        }
      }
      setOnlineMap(newStatus);
    }, 10000);
    return () => clearInterval(interval);
  }, [users]);

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Start a Chat</h3>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <ul style={listStyle}>
        {users
          .filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
          .map(user => (
            <li
              key={user.id}
              onClick={() => onSelect(user)}
              style={{
                ...cardStyle,
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: getColor(user.username),
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textTransform: 'uppercase'
                }}
              >
                {(user.username || 'U')[0].toUpperCase()}
              </div>
              <div style={{ marginLeft: '12px', fontWeight: 500 }}>
                {user.username}
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '12px',
                    color: onlineMap[user.id] ? 'green' : 'gray'
                  }}
                >
                  ● {onlineMap[user.id] ? 'Online' : 'Offline'}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

const getColor = (username) => {
  const colors = ['#007bff', '#28a745', '#fd7e14', '#6f42c1'];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

const listStyle = { listStyle: 'none', padding: 0, margin: 0 };

const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  padding: '10px 15px',
  borderRadius: '8px',
  marginBottom: '10px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: '0.2s ease',
};

export default UserList;
