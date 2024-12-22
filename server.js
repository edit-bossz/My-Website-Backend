const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const uri = 'mongodb+srv://Mayukh-Roy:20qtJDjiXs3fFi1w@for-my-website.houtp.mongodb.net/?retryWrites=true&w=majority&appName=for-my-website';

let db, collection;

MongoClient.connect(uri)
  .then((client) => {
    db = client.db('website_data');
    collection = db.collection('visitors');
    console.log('Connected to MongoDB Atlas successfully.');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });

app.use(cors());
app.use(express.json());

const recordVisitor = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const time = new Date().toISOString();

    try {
      await collection.insertOne({ ip, time });
      console.log(`Data saved. IP Address: ${ip}, Time: ${time}`);
      res.status(200).send('Data recorded');
    } catch (err) {
      console.error('Error saving data to MongoDB:', err);
      res.status(500).send('Error recording data');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

app.get('/record', recordVisitor);

module.exports = (req, res) => {
  app(req, res);
};
