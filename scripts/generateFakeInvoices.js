

const { faker } = require("@faker-js/faker");
const  MongoClient= require("mongodb").MongoClient;
const { ObjectId } = require('mongodb')
const mongoDB_URI = process.env.MONGODB_URI;


async function seedDB() {
    const uri = mongoDB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const collection = client.db("freemium").collection("invoices");

        let fakeInvoices = [];
        for (let i = 0; i < 10; i++) {
            let invoice = {
                customer_id: new ObjectId(), 

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

        await collection.insertMany(fakeInvoices);
        console.log("Database seeded with synthetic data!");
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

seedDB();
