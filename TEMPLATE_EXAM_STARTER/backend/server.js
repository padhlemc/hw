const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

let items = [
  { id: 1, name: 'Alpha Item', category: 'General' },
  { id: 2, name: 'Beta Item', category: 'Urgent' }
];
let col = null;

new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 })
  .connect()
  .then(c => { col = c.db('exam_db').collection('items'); console.log('Connected to Mongo'); })
  .catch(() => console.log('Mongo offline, using memory fallback'));

app.get('/api/items', async (req, res) => {
  if (col) {
    const docs = await col.find().toArray();
    return res.json(docs.map(d => ({ ...d, id: d._id })));
  }
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const item = { id: Date.now(), ...req.body };
  if (col) await col.insertOne({ ...item, _id: item.id });
  else items.push(item);
  res.status(201).json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  if (col) await col.deleteOne({ _id: id });
  items = items.filter(i => String(i.id) !== String(id));
  res.json({ success: true, id });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));
