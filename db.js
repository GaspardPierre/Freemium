const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();
const mongoDB_URI = process.env.MONGODB_URI;
let cachedClient = null;

async function connectDB() {
  if (!cachedClient) {
    const client = new MongoClient(mongoDB_URI);
    await client.connect();
    console.log("Connexion à la base de données réussie");
    cachedClient = client.db("freemium");
  }
  return cachedClient;
}

module.exports = connectDB;