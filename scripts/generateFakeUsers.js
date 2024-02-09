const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const mongoDB_URI = process.env.MONGODB_URI;

async function seedDB() {
    const uri = mongoDB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const usersCollection = client.db("freemium").collection("users");

        // Créer un utilisateur spécifique
        const pierreUser = {
            name: "pierre",
            email: "pierre@gmail.com",
            password: "$2b$10$ow3xNjMu5.aN8ItVAECgouCqAYhG.wpyzfgPcmXbI9Ez6vakKIeb2" // Mot de passe haché
        };

        await usersCollection.insertOne(pierreUser);
        console.log("Pierre user added to the database!");
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

seedDB();
