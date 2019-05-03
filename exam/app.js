const express = require('express');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const { fileMiddleware, authMiddleware } = require('./middlewares');

// const userRouter = require('./user.router');
// const postRouter = require('./post.router');

const server = express();
server.engine('mustache', mustacheExpress());
server.set('view engine', 'mustache');

//use middlewares
server.use(authMiddleware);  //password: alamakota
server.use(fileMiddleware);

// use routings
// server.use(userRouter);
// server.use(postRouter);



server.get('/cart', (req, res) => {
    const products = fs.readFileSync('./data/products.json', 'utf-8');
    const productsParsed = JSON.parse(products);
    const users = fs.readFileSync('./data/users.json', 'utf-8');
    const usersParsed = JSON.parse(users);
    const cart = fs.readFileSync('./data/cart.json', 'utf-8');
    const cartParsed = JSON.parse(cart);

    const cartsData = cartParsed.map(cart => {
        const userId = cart.userId;
        const user = usersParsed.find(user => user.id === userId);
        const { name, lastname, email } = user;

        const userData = {
            name, lastname, email
        }
        const products = cart.items.map(item => {
            let product = productsParsed.find(product => product.id === item.productId);
            product = {
                quantity: item.amount,
                ...product,
            }
            return product;
        })
        const cartData = {
            userData,
            products
        }
        return cartData;
    })
    const data = {
        cartsData: cartsData
    }
    res.render('cart', data)
});

server.listen(4700, () => {
    console.log('server started');
});
