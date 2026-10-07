import React, { useState, useEffect } from 'react';

const API_URL = '/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 1. Form State (Change fields for your exam)
  const initialForm = { title: '', category: 'General', description: '', status: 'Active' };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // 2. Fetch Data
  const loadData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3. Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm(initialForm);
    setEditingId(null);
    loadData();
  };

  // 4. Edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
  };

  // 5. Delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  // 6. Filter
  const filtered = items.filter(i =>
    (i.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Universal Exam Dashboard</h1>
      <p className="subtitle">Node.js Express + React 18 + Native MongoDB / JSON Fallback</p>

      {/* INPUT FORM */}
      <div className="form-box">
        <h2>{editingId ? 'Edit Record' : 'Add New Record'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Short description..."
            />
          </div>

          <div>
            <button type="submit" className="btn">
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setEditingId(null); setForm(initialForm); }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SEARCH INPUT */}
      <div className="search-box">
        <label>Search Records:</label>
        <input
          type="text"
          placeholder="Type to filter by title or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <h2>Records List ({filtered.length})</h2>
      {loading ? (
        <p>Loading records...</p>
      ) : filtered.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td><strong>{item.title}</strong></td>
                <td>{item.category}</td>
                <td>
                  <span className={`badge ${item.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.description || '-'}</td>
                <td className="actions">
                  <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
