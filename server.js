const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'dtcplus';
let db;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));

app.post('/api/save-lead', async (req, res) => {
  const lead = { ...req.body, createdAt: new Date() };
  await db.collection('leads').insertOne(lead);
  res.status(200).json({ message: 'Lead saved' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));