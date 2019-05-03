const fs = require('fs');
const path = require('path');

//check if file with given path exist

const fileMiddleware = (req, res, next) => {
    const filePath = path.join(__dirname, req.originalUrl);
    if (fs.existsSync(filePath)) {
        console.log('file exist');
        res.sendFile(filePath);
    } else {
        next();
    }
}

const authMiddleware = (req, res, next) => {
    if (req.headers['access-token'] === 'alamakota') {
        next();
    } else {
        res.status(401).send('bad password');
    }
};

module.exports = {
    fileMiddleware,
    authMiddleware
};