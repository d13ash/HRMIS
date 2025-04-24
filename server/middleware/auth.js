
const jwt = require('jsonwebtoken');
var config = require('config');
function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied No token Provided');
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        console.log(decoded);
        //req.user = decoded;
        next();
    }
    catch (er) {
        res.status(400).send('Invalid Token');
    }

}
module.exports = auth;


