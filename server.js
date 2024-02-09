
const dotenv = require ('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./app/routes')

const projectRouter = require('./app/routes/projects');
const taskRouter    =require('./app/routes/tasks');
const invoicesRouter = require('./app/routes/invoices');
const usersRouter = require('./app/routes/users');
const customersRouter = require('./app/routes/customers')


const app = express();
const mongoDB_URI = process.env.MONGODB_URI;

console.log("URI de MongoDB:", process.env.MONGODB_URI);


// Middleware de sécurité
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));
app.use(helmet());
app.use(express.json()); 
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite chaque IP à 100 requêtes par fenêtre de temps
}));

// Connexion MongoDB
mongoose.connect(mongoDB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
;

// Routes

app.use('/api', router);
app.use('/api/projects', projectRouter);
app.use('/api/tasks',taskRouter);
app.use('/api/invoices',invoicesRouter);
app.use('/api/users', usersRouter);
app.use('/api/customers', customersRouter);


// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gestion des erreurs (ajoutez votre propre gestionnaire d'erreurs)
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});
