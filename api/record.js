const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string
const uri = 'mongodb+srv://Mayukh-Roy:20qtJDjiXs3fFi1w@for-my-website.houtp.mongodb.net/?retryWrites=true&w=majority&appName=for-my-website';
let client;
let db;
let collection;

// Connect to MongoDB Atlas only once during cold start
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    client = connection;
    db = client.db('website_data');  // Database name
    collection = db.collection('visitors');  // Collection name
  })
  .catch((err) => console.error('Failed to connect to MongoDB Atlas', err));

module.exports = async (req, res) => {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow certain HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow certain headers
  
  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const time = new Date().toISOString();

    try {
      // Save the IP and time to MongoDB
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
