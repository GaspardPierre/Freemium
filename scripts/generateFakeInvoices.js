const dotenv = require('dotenv');
dotenv.config();
const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;
const mongoDB_URI = process.env.MONGODB_URI;

async function seedDB() {
    const client = new MongoClient(mongoDB_URI);
    try {
        await client.connect();
        console.log("Connected correctly to server");

        // Récupération des customer_id existants
        const customers = await client.db("freemium").collection("customers").find({}).toArray();

        if (customers.length === 0) {
            throw new Error('Aucun client trouvé pour générer des factures');
        }

        const invoicesCollection = client.db("freemium").collection("invoices");

        let fakeInvoices = [];
        for (let i = 0; i < 10; i++) {
            // Choisir un customer_id au hasard parmi les clients existants
            const randomCustomerId = customers[Math.floor(Math.random() * customers.length)]._id;

            let invoice = {
                customer_id: randomCustomerId,
                items: [{
                    description: faker.commerce.productName(),
                    hours: faker.number.float({ min: 1, max: 10 }),
                    rate:  faker.number.float({ min: 20, max: 100 })
                }],
                amount: faker.number.float({ min: 100, max: 1000 }),
                date: faker.date.past(),
                dueDate: faker.date.future(),
                status: faker.helpers.arrayElement(['draft', 'pending', 'paid'])
            };
            fakeInvoices.push(invoice);
        }

        await invoicesCollection.insertMany(fakeInvoices);
        console.log("Database seeded with synthetic data!");
    } catch (err) {
        console.log(err.stack);
    } 
}

seedDB();
