const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// connect to local mongodb
mongoose.connect('mongodb://127.0.0.1:27017/crisis-mitra-sewa-hub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// simple schema
const ItemSchema = new mongoose.Schema({ name: String, value: Number });
const Item = mongoose.model('Item', ItemSchema);

// CRUD routes
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('Server running on 3000'));
