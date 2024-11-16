const recordVisitor = async (req, res) => {
  // Allow requests from specific frontend domain (or use '*' for testing)
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
const express = require('express');
const { MongoClient } = require('mongodb');

// Initialize express app
const app = express();
const port = 3000;  // You can change the port if needed

const uri = 'mongodb+srv://Mayukh-Roy:20qtJDjiXs3fFi1w@for-my-website.houtp.mongodb.net/?retryWrites=true&w=majority&appName=for-my-website';
let db, collection;

// Connect to MongoDB Atlas
MongoClient.connect(uri)
  .then((client) => {
    db = client.db('website_data'); // Database name
    collection = db.collection('visitors'); // Collection name
    console.log('Connected to MongoDB Atlas successfully.');
  })
  .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));

// Middleware for handling CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Use '*' for testing or your frontend URL for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route to record visitor data
app.get('/record', async (req, res) => {
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
});

// Start the server and listen on a port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
