import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';


interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  __v?: number;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ username: '', email: '', isAdmin: false, password: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          // Handle the lack of a token (e.g., redirect to login)
          return;
        }
        const response = await axios.get<User[]>('http://localhost:11002/users', {
          headers: {
            Authorization: `Bearer ${token}` // Set the token in the Authorization header
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUserId(user._id);
    setEditFormData({ username: user.username, email: user.email, isAdmin: user.isAdmin, password: '' });
  };

  const handleUpdate = async (userId: string) => {
    // Ensure the password field is not sent if it's empty
    const updatedUser = {
      ...editFormData,
      ...(editFormData.password === '' && { password: undefined })
    };

    try {
      await axios.put(`http://localhost:11002/user/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
      });
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, ...updatedUser, password: undefined } : user
      );
      setUsers(updatedUsers);
      setEditingUserId(null); // Reset editing state
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:11002/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="termini-list-container">
      <h1>List of Users</h1>
      <table className="termini-table table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {editingUserId === user._id ? 
                  <input 
                    type="text" 
                    value={editFormData.username} 
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })} 
                  /> : 
                  user.username
                }
              </td>
              <td>
                {editingUserId === user._id ? 
                  <input 
                    type="email" 
                    value={editFormData.email} 
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} 
                  /> : 
                  user.email
                }
              </td>
              <td>
                {editingUserId === user._id ? 
                  <select 
                    value={editFormData.isAdmin ? 'true' : 'false'} 
                    onChange={(e) => setEditFormData({ ...editFormData, isAdmin: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select> : 
                  (user.isAdmin ? 'Yes' : 'No')
                }
              </td>
              <td>
                {editingUserId === user._id && 
                  <input 
                    type="password" 
                    placeholder="New password" 
                    value={editFormData.password} 
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  />
                }
              </td>
              <td>
                {editingUserId === user._id ? 
                  <Button variant="contained" color="success" onClick={() => handleUpdate(user._id)}>Save</Button> :
                  <>
                    <Button variant="contained" style={{ marginRight: '10px' }} onClick={() => handleEditClick(user)}>Edit</Button>
                    
                    <Button variant="contained"  color="error" onClick={() => handleDelete(user._id)}>Delete</Button>

                  </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
