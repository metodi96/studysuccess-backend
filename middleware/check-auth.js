const jwt = require('jsonwebtoken')

//a middleware function to be imported in the routes files
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log(req.userData);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed'
        })
    }
}