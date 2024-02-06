const dotenv = require('dotenv');
dotenv.config();
const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;
const mongoDB_URI = process.env.MONGODB_URI;

async function seedDB() {
    const uri = mongoDB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected correctly to server");

        // Collection pour les factures
        const invoicesCollection = client.db("freemium").collection("invoices");
        // Collection pour les clients
        const customersCollection = client.db("freemium").collection("customers");

        // Générer de faux clients
        let fakeCustomers = [];
        for (let i = 0; i < 10; i++) {
            let customer = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                image_url: faker.image.avatar(),
            };
            fakeCustomers.push(customer);
        }

        // Insérer de faux clients dans la base de données
        const insertedCustomers = await customersCollection.insertMany(fakeCustomers);
        console.log("Clients insérés");

        // Générer de fausses factures avec les IDs des clients générés
        let fakeInvoices = [];
        const customerIds = insertedCustomers.insertedIds;

        for (let i = 0; i < 10; i++) {
            let invoice = {
                customer_id: customerIds[Object.keys(customerIds)[i]], // Utiliser un ID client généré

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

        // Insérer de fausses factures dans la base de données
        await invoicesCollection.insertMany(fakeInvoices);
        console.log("Factures insérées avec les clients synthétiques");

    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

seedDB();
