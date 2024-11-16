const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// MongoDB setup
const uri = 'your-mongo-db-connection-string';  // Replace this with your MongoDB connection string
let client;
let db;
let collection;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    client = connection;
    db = client.db('website_data');  // Database name
    collection = db.collection('visitors');  // Collection name
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/record', (req, res) => {
  const ip = req.ip;
  const time = new Date().toISOString();

  // Save to MongoDB
  collection.insertOne({ ip, time })
    .then(() => {
      console.log(`Data saved. IP Address: ${ip}, Time: ${time}`);
      res.send('Data recorded');
    })
    .catch((err) => {
      console.error('Error saving data to database:', err);
      res.status(500).send('Error recording data');
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
