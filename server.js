const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string
const uri = 'mongodb+srv://Mayukh-Roy:20qtJDjiXs3fFi1w@for-my-website.houtp.mongodb.net/?retryWrites=true&w=majority&appName=for-my-website';
let client;
let db;
let collection;

// Connect to MongoDB Atlas only once during server startup
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    client = connection;
    db = client.db('website_data'); // Database name
    collection = db.collection('visitors'); // Collection name
    console.log('Connected to MongoDB Atlas successfully.');
  })
  .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));

// Backend logic
const recordVisitor = async (req, res) => {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', 'https://edit-bossz.github.io'); // Replace with your frontend's GitHub Pages URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow GET and preflight OPTIONS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  if (req.method === 'OPTIONS') {
    // Handle preflight CORS request
    res.status(204).end();
    return;
  }

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
    res.status(405).send('Method Not Allowed'); // For non-GET requests
  }
};

// Export the function
module.exports = recordVisitor;