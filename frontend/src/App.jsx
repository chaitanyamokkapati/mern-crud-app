import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const { data } = await axios.get(API + '/items');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(API + '/items/' + editId, form);
      setEditId(null);
    } else {
      await axios.post(API + '/items', form);
    }
    setForm({ name: '', description: '' });
    load();
  };

  const edit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditId(item._id);
  };

  const del = async (id) => {
    await axios.delete(API + '/items/' + id);
    load();
  };

  const toggle = async (item) => {
    await axios.put(API + '/items/' + item._id, { completed: !item.completed });
    load();
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>CRUD App</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ padding: 10, width: '100%', marginBottom: 10, boxSizing: 'border-box' }}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ padding: 10, width: '100%', marginBottom: 10, boxSizing: 'border-box' }}
        />
        <button style={{ padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none' }}>
          {editId ? 'Update' : 'Add'}
        </button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', description: '' }); }} style={{ marginLeft: 10 }}>Cancel</button>}
      </form>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {items.map((item) => (
          <li key={item._id} style={{ padding: 15, border: '1px solid #ddd', marginBottom: 10, borderRadius: 5, background: item.completed ? '#e8f5e9' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.name}</strong>
                <p style={{ margin: '5px 0', color: '#666' }}>{item.description}</p>
              </div>
              <div>
                <button onClick={() => toggle(item)}>{item.completed ? 'Undo' : 'Done'}</button>
                <button onClick={() => edit(item)} style={{ marginLeft: 5 }}>Edit</button>
                <button onClick={() => del(item._id)} style={{ marginLeft: 5 }}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
