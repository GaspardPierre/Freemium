
const dotenv = require ('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./app/routes')
const auth = require('./middleware/authMiddleware');
const projectRouter = require('./app/routes/projects');
const taskRouter    =require('./app/routes/tasks');
const invoicesRouter = require('./app/routes/invoices');



const app = express();
const mongoDB_URI = process.env.MONGODB_URI;
console.log("URI de MongoDB:", process.env.MONGODB_URI);


// Middleware de sécurité
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite chaque IP à 100 requêtes par fenêtre de temps
}));

// Connexion MongoDB
mongoose.connect(mongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes

app.use('/api', router);
app.use('/api/projects', auth, projectRouter);
app.use('/api/tasks', auth, taskRouter);
app.use('/api/invoices', auth, invoicesRouter);


// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gestion des erreurs (ajoutez votre propre gestionnaire d'erreurs)
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});
