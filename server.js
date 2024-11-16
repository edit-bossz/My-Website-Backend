const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Mayukh-Roy:20qtJDjiXs3fFi1w@for-my-website.houtp.mongodb.net/?retryWrites=true&w=majority&appName=for-my-website';
let db, collection;

MongoClient.connect(uri)
  .then((client) => {
    db = client.db('website_data'); // Database name
    collection = db.collection('visitors'); // Collection name
    console.log('Connected to MongoDB Atlas successfully.');
  })
  .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));

// Make the recordVisitor function async
const recordVisitor = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Use '*' for testing or your frontend URL for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const time = new Date().toISOString();

    try {
      // Make sure this is inside an async function
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

// Export the function if needed
module.exports = recordVisitor;
