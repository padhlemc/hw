# 🎓 The Universal Full-Stack Exam Template & Master Guide
> **One Master Pattern to Solve ANY Web Programming / OST Lab Exam Question in 10 Minutes!**

---

## 💡 The Secret of Lab Exams: Every Question is the Same!

Whether your question paper asks for:
- 📚 **Book E-Commerce Store** (Title, Author, Price, Category)
- 🩺 **Doctor Appointments** (Patient Name, Doctor, Date, Status)
- 💰 **Expense Tracker** (Title, Amount, Category, Date)
- 📝 **Daily Task Manager** (Title, Priority, Status, Due Date)
- 💬 **Discussion Forum** (Post Title, Author, Content, Upvotes)
- 🎓 **Student Gradebook** (Student Name, Subject Marks, Grade)
- 📦 **Product Management** (Product Name, Price, Stock)
- 👥 **Team Member Directory** (Name, Role, Department, Email)
- 🏥 **Patient Management** (Name, Age, Disease, Room, Status)

👉 **Under the hood, 95% of the code is 100% IDENTICAL!**  
Every question is fundamentally a **RESTful CRUD application**:
1. Connects to MongoDB (or seamless local offline JSON fallback).
2. Serves 4 REST API endpoints (`GET`, `POST`, `PUT`, `DELETE`).
3. Uses React 18 via CDN (no complex Webpack / Vite build tools to fail in the exam).
4. Displays data in a table/cards and provides a form to add/edit records.

---

## ⚡ The "Change Only 4 Things" Formula

When you get an exam question, you copy the starter template and modify **ONLY 4 AREAS**:

```
                       ┌────────────────────────────────────────┐
                       │   THE UNIVERSAL EXAM BLUEPRINT         │
                       └───────────────────┬────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────┬────────────────────┐
         ▼                   ▼                     ▼                    ▼
   [1. Port & Name]    [2. Dummy Data]       [3. Form Inputs]     [4. Table Columns]
    PORT = 5001         { title, author,      <input name="title">  <th>Title</th>
    COLLECTION='books'    price, category }   <input name="author"> <td>{item.title}</td>
```

| Area | File | What You Change | Example: Patient Management | Example: Expense Tracker |
|---|---|---|---|---|
| **1. Port & Name** | `backend/server.js` | Change `PORT` and `COLLECTION_NAME` | `PORT = 5009`<br>`COLLECTION = 'patients'` | `PORT = 5003`<br>`COLLECTION = 'expenses'` |
| **2. Initial Schema** | `backend/server.js` | Change fields in initial `items` | `{ name, age, condition }` | `{ title, amount, category }` |
| **3. Form Inputs** | `frontend/app.jsx` | Change `form` state & inputs | Name, Age, Condition inputs | Title, Amount, Category inputs |
| **4. Table Display** | `frontend/app.jsx` | Change `<th>` headers and `<td>` values | Name, Age, Condition | Title, Amount, Category |

---

## ⚡ ULTRA-SHORT EXAM CHEAT-SHEET (Under 75 Lines Total!)
> **If you have to type the code from memory during the exam, USE THIS EXACT SHORT VERSION:**

### 1. `backend/server.js` (35 Lines):
```javascript
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

let items = [{ id: 1, name: 'Sample Item', category: 'General' }], col;
new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 }).connect()
  .then(c => { col = c.db('exam_db').collection('items'); console.log('Mongo connected'); })
  .catch(() => console.log('Mongo offline, memory fallback active'));

app.get('/api/items', async (req, res) => {
  res.json(col ? (await col.find().toArray()).map(d => ({ ...d, id: d._id })) : items);
});

app.post('/api/items', async (req, res) => {
  const item = { id: Date.now(), ...req.body };
  if (col) await col.insertOne({ ...item, _id: item.id });
  else items.push(item);
  res.status(201).json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  if (col) await col.deleteOne({ _id: req.params.id });
  items = items.filter(i => String(i.id) !== String(req.params.id));
  res.json({ success: true });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));
```

### 2. `frontend/app.jsx` (40 Lines):
```jsx
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
      <h2>Exam Manager</h2>
      <form onSubmit={add}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" />
        <button type="submit">Add</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Category</th><th>Action</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name || i.title}</td>
              <td>{i.category || '-'}</td>
              <td><button className="del-btn" onClick={() => del(i.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

### 3. `frontend/index.html` (14 Lines):
```html
<!DOCTYPE html>
<html>
<head>
  <title>Exam</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="app.jsx"></script>
</body>
</html>
```

### 4. `frontend/style.css` (7 Lines):
```css
body { font-family: Arial, sans-serif; max-width: 650px; margin: 30px auto; padding: 10px; }
input, button { padding: 8px; margin: 4px; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background: #f2f2f2; }
.del-btn { color: red; cursor: pointer; border: none; background: none; font-weight: bold; }
```

---

---

## 📁 The Universal Architecture

Every solution lives in one compact, clean folder:

```
Your_Question_Folder/
├── backend/
│   ├── server.js              # ~80 lines: Express + MongoDB + JSON Fallback
│   ├── package.json           # express, cors, mongodb
│   └── data_fallback.json     # Automatic offline file storage
├── frontend/
│   ├── index.html             # React 18 + Babel loaded from CDN (zero build steps)
│   ├── app.jsx                # Single React component: state, form, table, API calls
│   └── style.css              # Clean, professional styling
└── package.json               # "start": "node backend/server.js"
```

---

## 🚀 1. The Universal Backend: `backend/server.js` (~80 Lines)

Copy-paste this exact server code. Notice how simple and robust it is:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

// ==========================================
// 1. CONFIGURATION (CHANGE THESE 2 LINES!)
// ==========================================
const app = express();
const PORT = process.env.PORT || 5000;          // Change to your question's port
const DB_NAME = 'my_exam_db';                   // Change database name
const COLLECTION_NAME = 'items';                // Change collection (e.g. 'books', 'patients')

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ==========================================
// 2. OFFLINE DATA STORE (NEVER CRASHES!)
// ==========================================
const DATA_FILE = path.join(__dirname, 'data_fallback.json');
let memoryData = [
  // CHANGE DUMMY RECORDS ACCORDING TO YOUR EXAM QUESTION:
  { id: '1', title: 'Sample One', category: 'General', status: 'Active' },
  { id: '2', title: 'Sample Two', category: 'Urgent', status: 'Pending' }
];

function loadFallback() {
  if (fs.existsSync(DATA_FILE)) {
    try { memoryData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch(e){}
  }
}
function saveFallback() {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2)); } catch(e){}
}

// ==========================================
// 3. MONGODB CLIENT (WITH AUTO OFFLINE MODE)
// ==========================================
let db = null;
let isMongo = false;

async function connectDB() {
  loadFallback();
  try {
    const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    db = client.db(DB_NAME);
    isMongo = true;
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    if (count === 0 && memoryData.length > 0) {
      await db.collection(COLLECTION_NAME).insertMany(memoryData.map(d => ({ ...d, _id: d.id })));
    }
  } catch (err) {
    console.log('[MongoDB] Offline mode active. Using local JSON fallback.');
    isMongo = false;
  }
}

const fmt = d => ({ ...d, id: String(d._id || d.id) });

// ==========================================
// 4. THE 4 UNIVERSAL CRUD ROUTES
// ==========================================

// GET ALL
app.get('/api/items', async (req, res) => {
  try {
    if (isMongo && db) {
      const list = await db.collection(COLLECTION_NAME).find().toArray();
      return res.json(list.map(fmt));
    }
    res.json(memoryData);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE (POST)
app.post('/api/items', async (req, res) => {
  try {
    const item = { ...req.body, createdAt: new Date().toISOString() };
    if (isMongo && db) {
      const result = await db.collection(COLLECTION_NAME).insertOne(item);
      return res.status(201).json({ ...item, id: String(result.insertedId) });
    }
    item.id = 'id_' + Date.now();
    memoryData.unshift(item);
    saveFallback();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE (PUT)
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongo && db) {
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      await db.collection(COLLECTION_NAME).updateOne(filter, { $set: req.body });
      const updated = await db.collection(COLLECTION_NAME).findOne(filter);
      return res.json(fmt(updated || { id, ...req.body }));
    }
    const idx = memoryData.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { memoryData[idx] = { ...memoryData[idx], ...req.body }; saveFallback(); }
    res.json(memoryData[idx] || { id, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongo && db) {
      const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
      await db.collection(COLLECTION_NAME).deleteOne(filter);
      return res.json({ success: true, id });
    }
    memoryData = memoryData.filter(i => String(i.id) !== String(id));
    saveFallback();
    res.json({ success: true, id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Fallback to React HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server running at: http://localhost:${PORT}`);
  await connectDB();
});
```

---

## 🌐 2. The Universal HTML: `frontend/index.html` (Always Identical!)

You **never need to change anything** in this HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab Exam Application</title>
  <link rel="stylesheet" href="style.css">
  
  <!-- React 18 & Babel via CDN (Zero build setup!) -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="app.jsx"></script>
</body>
</html>
```

---

## 🎨 3. The Universal Basic CSS: `frontend/style.css` (~70 Lines)

Keep your CSS **very very basic** in lab exams so you can type it from memory in 2 minutes:

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; background: #f4f6f8; color: #333; padding: 20px; }
.container { max-width: 900px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ddd; }
h1 { font-size: 24px; margin-bottom: 6px; }
h2 { font-size: 18px; margin: 15px 0 10px; }
p.subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }

.form-box { background: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
.form-group { margin-bottom: 12px; }
label { display: block; font-weight: bold; font-size: 13px; margin-bottom: 4px; }
input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #007bff; }

.btn { padding: 8px 16px; font-size: 14px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; margin-right: 6px; }
.btn:hover { background: #0056b3; }
.btn-secondary { background: #6c757d; }
.btn-danger { background: #dc3545; padding: 4px 8px; font-size: 12px; }
.btn-warning { background: #ffc107; color: #212529; padding: 4px 8px; font-size: 12px; }

table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
th { background: #f2f2f2; }
tr:nth-child(even) { background: #fafafa; }
.actions { display: flex; gap: 6px; }

.badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.badge-green { background: #d4edda; color: #155724; }
.badge-yellow { background: #fff3cd; color: #856404; }
.badge-red { background: #f8d7da; color: #721c24; }
```

---

## ⚛️ 4. The Universal React Frontend: `frontend/app.jsx`

Here is the entire React code. Notice how straightforward it is:

```jsx
const { useState, useEffect } = React;
const API_URL = '/api/items';

function App() {
  // 1. STATE (Adjust fields to match question)
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const initialForm = { title: '', category: 'General', status: 'Active' };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // 2. FETCH DATA
  const loadData = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
  };
  useEffect(() => { loadData(); }, []);

  // 3. SUBMIT (POST / PUT)
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

  // 4. DELETE
  const handleDelete = async (id) => {
    if (confirm('Delete this record?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  // 5. EDIT
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
  };

  // 6. FILTERING
  const filtered = items.filter(i => 
    (i.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Dashboard (Total: {items.length})</h1>

      {/* INPUT FORM */}
      <form onSubmit={handleSubmit} className="card">
        <h3>{editingId ? 'Edit Record' : 'Add Record'}</h3>
        <input 
          placeholder="Title" 
          value={form.title || ''} 
          onChange={e => setForm({ ...form, title: e.target.value })} 
          required 
        />
        <input 
          placeholder="Category" 
          value={form.category || ''} 
          onChange={e => setForm({ ...form, category: e.target.value })} 
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel</button>}
      </form>

      {/* SEARCH BAR */}
      <input 
        placeholder="🔍 Search..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        style={{ margin: '1rem 0', width: '100%' }}
      />

      {/* DATA TABLE */}
      <table className="card" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(i => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.category}</td>
              <td>{i.status}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Edit</button>
                <button onClick={() => handleDelete(i.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## 🎯 How to Solve Questions Q1 - Q9 Using This Template

Here is the exact cheatsheet showing what to change for each question:

| Question | Entity | Port | Fields to Put in `server.js` and `app.jsx` | Special Feature to Mention |
|---|---|---|---|---|
| **Q1: Book Store** | `books` | `5001` | `title`, `author`, `price`, `category`, `stock` | Cart array in state: `[cart, setCart]` |
| **Q2: Doctor Appt** | `appointments` | `5002` | `patientName`, `doctorName`, `date`, `time`, `status` | Status dropdown (Booked, Cancelled) |
| **Q3: Expense Tracker** | `expenses` | `5003` | `title`, `amount`, `category`, `date` | Total amount: `items.reduce((s,i) => s + Number(i.amount), 0)` |
| **Q4: Daily Task Mgr** | `tasks` | `5004` | `title`, `priority` (High/Med/Low), `status`, `dueDate` | Status toggle: `PUT /api/tasks/:id` with toggled status |
| **Q5: Discussion Forum** | `posts` | `5005` | `title`, `content`, `author`, `upvotes` | Upvote button: `PUT` with `upvotes: i.upvotes + 1` |
| **Q6: Teacher Gradebook** | `students` | `5006` | `name`, `roll`, `marks1`, `marks2`, `marks3` | Calculate avg: `((m1+m2+m3)/3)` and letter grade |
| **Q7: Product/User Mgmt** | `products` | `5007` | `name`, `price`, `stock`, `category` | Regex validation: `emailRegex = /^\S+@\S+\.\S+$/` |
| **Q8: Team Directory** | `members` | `5008` | `name`, `role`, `department`, `email`, `bio` | Pass props to subcomponent: `<TeamCard member={m} />` |
| **Q9: Patient Mgmt** | `patients` | `5009` | `name`, `age`, `gender`, `medicalCondition`, `status` | Filter by status (Admitted, Discharged) |

---

## 🛡️ Why This Architecture Guarantees Full Marks in Exams

1. **Zero Database Crashes**: In 50% of university labs, MongoDB is not running or has port conflicts. With the automatic JSON fallback, your application **runs 100% smoothly** regardless!
2. **Zero Build Failures**: Traditional React apps (`create-react-app`, Vite) require `npm run build` or dev servers that often fail on slow lab computers with missing global packages. With Babel Standalone CDN, **any browser runs your JSX instantly**!
3. **Clean Code Separation**: Examiners love seeing `backend/server.js` and `frontend/app.jsx` cleanly organized in separate folders.
4. **Universal 1-Command Execution**:
   ```bash
   cd Question_Folder
   npm start
   ```
   Express automatically serves both your REST API and your React frontend on the same port!
