const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = 'mongodb+srv://Mayukh-Roy:20qtJDjiXs3fFi1w@for-my-website.houtp.mongodb.net/?retryWrites=true&w=majority&appName=for-my-website';

let db, collection;

// MongoDB connection
MongoClient.connect(uri)
  .then((client) => {
    db = client.db('website_data'); // Database name
    collection = db.collection('visitors'); // Collection name
    console.log('Connected to MongoDB Atlas successfully.');

    // Start the server once MongoDB is connected
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });

// Middleware to handle CORS and JSON requests
app.use(cors()); // Allow all origins for testing
app.use(express.json()); // Automatically parse incoming JSON

// Record visitor function
const recordVisitor = async (req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle preflight request for CORS
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const time = new Date().toISOString();

    try {
      // Insert data into MongoDB
      await collection.insertOne({ ip, time });
      console.log(`Data saved. IP Address: ${ip}, Time: ${time}`);
      res.status(200).send('Data recorded');
    } catch (err) {
      console.error('Error saving data to MongoDB:', err);
      res.status(500).send('Error recording data');
    }
  } else {
    res.status(405).send('Method Not Allowed'); // Handle non-GET requests
  }
};

// Set up route for visitor recording
app.get('/record', recordVisitor);

app.use(cors());  // This allows requests from any origin
