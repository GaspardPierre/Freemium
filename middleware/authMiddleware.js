
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {



  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    
    req.userData = decoded;
    console.log("REQ.USERDATA ",req.userData)
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed'
    });
  }
};

module.exports = auth;
