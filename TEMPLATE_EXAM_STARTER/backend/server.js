const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

// ============================================================================
// 1. CONFIGURATION (Change PORT & DB_NAME / ENTITY for your question)
// ============================================================================
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'exam_starter_db';
const COLLECTION_NAME = 'items'; // e.g. 'books', 'patients', 'tasks', 'expenses'

// Middleware
app.use(cors());
app.use(express.json());
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

// ============================================================================
// 2. OFFLINE STORAGE FALLBACK (Ensures your code NEVER crashes in college lab!)
// ============================================================================
const DATA_FILE = path.join(__dirname, 'data_fallback.json');
let memoryData = [
  { id: '1', title: 'Sample Item Alpha', category: 'General', description: 'Default template item demonstrating CRUD', status: 'Active' },
  { id: '2', title: 'Sample Item Beta', category: 'Urgent', description: 'Second template item ready for editing', status: 'Pending' },
  { id: '3', title: 'Sample Item Gamma', category: 'General', description: 'Third template item showcasing list view', status: 'Completed' }
];

function loadFallback() {
  if (fs.existsSync(DATA_FILE)) {
    try { memoryData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch (e) {}
  }
}
function saveFallback() {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(memoryData, null, 2)); } catch (e) {}
}

// ============================================================================
// 3. MONGODB CLIENT DUAL-MODE CONNECTION
// ============================================================================
let db = null;
let isMongoConnected = false;

async function connectDB() {
  loadFallback();
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    db = client.db(DB_NAME);
    isMongoConnected = true;
    console.log(`[MongoClient] Successfully connected to MongoDB database: ${DB_NAME}`);
    
    // Seed initial records if collection is empty
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    if (count === 0 && memoryData.length > 0) {
      await db.collection(COLLECTION_NAME).insertMany(memoryData.map(item => ({ ...item, _id: item.id })));
    }
  } catch (err) {
    console.log('[MongoClient] MongoDB offline/unavailable. Seamless JSON fallback active.');
    isMongoConnected = false;
  }
}

// Helper: Convert MongoDB _id to string id
const formatDoc = doc => ({ ...doc, id: String(doc._id || doc.id) });

// ============================================================================
// 4. RESTful CRUD API ENDPOINTS (GET, POST, PUT, DELETE)
// ============================================================================

// GET /api/items (with optional search query)
app.get('/api/items', async (req, res) => {
  try {
    const { search, category } = req.query;
    if (isMongoConnected && db) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.title = { $regex: search, $options: 'i' };
      const docs = await db.collection(COLLECTION_NAME).find(query).toArray();
      return res.json(docs.map(formatDoc));
    }

    // Fallback filter
    let results = [...memoryData];
    if (category && category !== 'All') {
      results = results.filter(i => i.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(i => (i.title && i.title.toLowerCase().includes(q)) || (i.description && i.description.toLowerCase().includes(q)));
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items (Create new record)
app.post('/api/items', async (req, res) => {
  try {
    const { title, category, description, status } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newItem = {
      title,
      category: category || 'General',
      description: description || '',
      status: status || 'Active',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected && db) {
      const result = await db.collection(COLLECTION_NAME).insertOne(newItem);
      return res.status(201).json({ ...newItem, id: String(result.insertedId) });
    }

    // Fallback store
    newItem.id = 'item_' + Date.now();
    memoryData.unshift(newItem);
    saveFallback();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/items/:id (Update existing record)
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected && db) {
      let filter = { _id: id };
      if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
      await db.collection(COLLECTION_NAME).updateOne(filter, { $set: updates });
      const updated = await db.collection(COLLECTION_NAME).findOne(filter);
      return res.json(formatDoc(updated || { id, ...updates }));
    }

    // Fallback update
    const idx = memoryData.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Item not found' });
    memoryData[idx] = { ...memoryData[idx], ...updates };
    saveFallback();
    res.json(memoryData[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/items/:id (Remove record)
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && db) {
      let filter = { _id: id };
      if (ObjectId.isValid(id)) filter = { _id: new ObjectId(id) };
      await db.collection(COLLECTION_NAME).deleteOne(filter);
      return res.json({ success: true, id });
    }

    // Fallback delete
    memoryData = memoryData.filter(i => String(i.id) !== String(id));
    saveFallback();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route to serve the React frontend index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// ============================================================================
// 5. SERVER BOOTSTRAP
// ============================================================================
app.listen(PORT, async () => {
  console.log('=================================================================');
  console.log(`[Universal Exam Template] Running at: http://localhost:${PORT}`);
  console.log('Database Engine: Native MongoClient (Auto Offline Fallback Active)');
  console.log('=================================================================');
  await connectDB();
});
