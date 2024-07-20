import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './components/Button/Button';
import List from './components/List/List';
import './App.css';

function App() {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState({ name: '' });
  const [selectedList, setSelectedList] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1 });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
        console.log("Users fetched: ", response.data); // Debugging line
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (currentUser) {
      axios.get('http://localhost:5000/lists', { headers: { userid: currentUser._id } })
        .then(response => setLists(response.data))
        .catch(error => console.error('Error fetching lists:', error));
    }
  }, [currentUser]);

  const handleListChange = (e) => {
    const { name, value } = e.target;
    setNewList({ ...newList, [name]: value });
  };

  const handleListSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/lists', newList, { headers: { userid: currentUser._id } })
      .then(response => setLists([...lists, response.data]))
      .catch(error => console.error('Error creating list:', error));
  };

  const handleListSelect = (id) => {
    axios.get(`http://localhost:5000/lists/${id}`, { headers: { userid: currentUser._id } })
      .then(response => {
        setSelectedList(response.data);
        console.log("List selected: ", response.data); // Debugging line
      })
      .catch(error => console.error('Error selecting list:', error));
  };

  const handleListDelete = (id) => {
    axios.delete(`http://localhost:5000/lists/${id}`, { headers: { userid: currentUser._id } })
      .then(() => {
        setLists(lists.filter(list => list._id !== id));
        if (selectedList && selectedList._id === id) {
          setSelectedList(null);
        }
      })
      .catch(error => console.error('Error deleting list:', error));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleItemSubmit = (e) => {
    e.preventDefault();
    if (!selectedList) return;
    axios.post(`http://localhost:5000/items`, newItem)
      .then(response => {
        const updatedList = { ...selectedList, items: [...selectedList.items, response.data] };
        setSelectedList(updatedList);
        axios.put(`http://localhost:5000/lists/${selectedList._id}`, updatedList, { headers: { userid: currentUser._id } });
      })
      .catch(error => console.error('Error creating item:', error));
  };

  const handleItemDelete = (id) => {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(() => {
        const updatedList = { ...selectedList, items: selectedList.items.filter(item => item._id !== id) };
        setSelectedList(updatedList);
        axios.put(`http://localhost:5000/lists/${selectedList._id}`, updatedList, { headers: { userid: currentUser._id } });
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setCurrentUser(response.data); // automaticky přihlásit nového uživatele
      })
      .catch(error => console.error('Error creating user:', error));
  };

  const handleAddUserToList = (userId) => {
    if (!selectedList) return;
    axios.put(`http://localhost:5000/lists/${selectedList._id}/addUser`, { userId }, { headers: { userid: currentUser._id } })
      .then(response => {
        setSelectedList(response.data);
      })
      .catch(error => console.error('Error adding user to list:', error));
  };

  const handleLoginChange = (e) => {
    setLoginEmail(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = users.find(user => user.email === loginEmail);
    console.log("Trying to login user: ", user); // Debugging line
    if (user) {
      setCurrentUser(user);
    } else {
      alert('User not found');
    }
  };

  if (!currentUser) {
    return (
      <div className="App">
        <h1>Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={loginEmail}
            onChange={handleLoginChange}
          />
          <Button type="submit">Přihlásit se</Button>
        </form>
        <h1>Register</h1>
        <form onSubmit={handleUserSubmit}>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleUserChange}
            placeholder="User name"
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleUserChange}
            placeholder="User email"
          />
          <Button type="submit">Register</Button>
        </form>
        <List items={users.map(user => ({ ...user, name: `${user.name} (${user.email})` }))} onSelect={() => {}} showDeleteButton={false} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Shopping Lists</h1>
      <form onSubmit={handleListSubmit}>
        <input
          type="text"
          name="name"
          value={newList.name}
          onChange={handleListChange}
          placeholder="List name"
        />
        <Button type="submit">Add List</Button>
      </form>
      <List items={lists.map(list => ({ ...list, name: list.name }))} onSelect={handleListSelect} onDelete={handleListDelete} showDeleteButton={true} />

      {selectedList && (
        <div>
          <h2>{selectedList.name}</h2>
          <form onSubmit={handleItemSubmit}>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleItemChange}
              placeholder="Item name"
            />
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleItemChange}
              min="1"
            />
            <Button type="submit">Add Item</Button>
          </form>
          <List items={selectedList.items.map(item => ({
            ...item,
            name: `${item.name} - ${item.quantity}`
          }))} onSelect={handleItemDelete} showDeleteButton={false} />
          <h3>Add Users to List</h3>
          <List items={users.map(user => ({ ...user, name: `${user.name} (${user.email})` }))} onSelect={handleAddUserToList} showDeleteButton={false} />
        </div>
      )}

<h1>Users</h1>
      <form onSubmit={handleUserSubmit}>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleUserChange}
          placeholder="User name"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleUserChange}
          placeholder="User email"
        />
        <Button type="submit">Add User</Button>
      </form>
      <List items={users.map(user => ({ ...user, name: `${user.name} (${user.email})` }))} onSelect={() => {}} showDeleteButton={false} />
    </div>
  );
}

export default App;
