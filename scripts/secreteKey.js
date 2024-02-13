const jwt = require('jsonwebtoken');

const user_data = {
    'userId':'12345',
    'email':'testexample.com',
};

const AUTH_SECRET = 'test  ';

const token = jwt.sign(user_data, AUTH_SECRET, { expiresIn: '1h' });
console.log("Token généré : " + token); 

try {
    const decoded = jwt.verify(token, AUTH_SECRET, { algorithms: ['HS256'] });
    console.log("Token décodé:", decoded);
} catch (error) {
    console.error("Échec de la vérification du token. La clé secrète pourrait être incorrecte ou une autre erreur s'est produite:", error);
}