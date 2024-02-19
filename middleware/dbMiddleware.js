
const connectDB = require('../db');

async function dbMiddleware(req, res, next) {
  console.log('Requête reçue sur:', req.path);
  try {
    const dbInstance = await connectDB();
    req.db = {
      invoicesCollection: dbInstance.collection('invoices'),
      customerCollection: dbInstance.collection('customers'),
      revenuesCollection: dbInstance.collection('revenues'),
      customersCollection: dbInstance.collection('customers'),
      usersCollection: dbInstance.collection('users'),
    };
    next();
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
    res.status(500).send('Erreur de serveur');
  }
}

module.exports = dbMiddleware;
