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
        const revenueCollection = client.db("freemium").collection("revenues");

        // Générer des données de revenus fictives
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let month of months) {
            const revenue = {
                month: month,
                revenue: Math.floor(Math.random() * (4000 - 1500 + 1)) + 1500
            };
            await revenueCollection.insertOne(revenue);
        }
        console.log("Revenue data added to the database!");
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

seedDB();
