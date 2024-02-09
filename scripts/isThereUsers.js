const mongoose = require('mongoose');
const User = require('../app/models/User');
const Invoice = require('../app/models/Invoices') // Assurez-vous que le chemin est correct

mongoose.connect('mongodb+srv://pierredillard:rfLDX6mFXpxk2FwS@cluster0.xpfezp3.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    Invoice.find({}).then(users => {
      console.log('All users:', users);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB', err));
