const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const headerVal = req.header('Authorization');

    if (!headerVal)
        return res
            .status(400)
            .json({ err: true, message: 'Authorization header is required!' });

    const token = headerVal.split(' ')[1];

    if (!token)
        return res
            .status(400)
            .json({ error: true, message: 'Token is required!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).json({ error: true, message: err.message });

        // console.log(decoded);
        req.user = decoded;
        next();
    });
};
