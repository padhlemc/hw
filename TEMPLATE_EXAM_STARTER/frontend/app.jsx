const { useState, useEffect } = React;

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'General' });

  const load = () => fetch('/api/items').then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', category: 'General' });
    load();
  };

  const del = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <h2>Universal Exam Starter</h2>
      <form onSubmit={add}>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
        />
        <button type="submit">Add</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name || item.title}</td>
              <td>{item.category || '-'}</td>
              <td>
                <button className="del-btn" onClick={() => del(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
