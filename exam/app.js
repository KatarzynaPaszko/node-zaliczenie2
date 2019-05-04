const express = require('express');
const mustacheExpress = require('mustache-express');

const { fileMiddleware, authMiddleware } = require('./middlewares');
const cartRouter = require('./cart.router');

const server = express();
server.engine('mustache', mustacheExpress());
server.set('view engine', 'mustache');

//use middlewares
server.use(authMiddleware);  //password: alamakota
server.use(fileMiddleware);

// use routings
server.use(cartRouter);

server.listen(4700, () => {
    console.log('server started');
});
