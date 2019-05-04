const express = require('express');
const fs = require('fs');
const getDate = require('./services');

const router = express.Router();

// http://localhost:4700/cart
// http://localhost:4700/cart/1
router.get('/cart/:id?', (req, res) => {
    const products = fs.readFileSync('./data/products.json', 'utf-8');
    const productsParsed = JSON.parse(products);
    const users = fs.readFileSync('./data/users.json', 'utf-8');
    const usersParsed = JSON.parse(users);
    const cart = fs.readFileSync('./data/cart.json', 'utf-8');
    const cartParsed = JSON.parse(cart);

    const { id } = req.params;
    let header = "Zamówienia: "

    let order = cartParsed.map(cart => {
        const cartId = cart.id;
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
            cartId,
            userData,
            products
        }

        return cartData;
    });
    if (id) {
        order = order.filter(cart => {
            return cart.cartId === Number(id)
        });
        header = `Zamówienie nr: ${id}`
    }

    const data = {
        header,
        order
    }
    res.render('cart', data)
});

// POST
// http://localhost:4700/cart
router.post('/cart', (req, res) => {
    const products = fs.readFileSync('./data/products.json', 'utf-8');
    const productsParsed = JSON.parse(products);
    const users = fs.readFileSync('./data/users.json', 'utf-8');
    const usersParsed = JSON.parse(users);
    const cart = fs.readFileSync('./data/cart.json', 'utf-8');
    const cartParsed = JSON.parse(cart);


    const lastId = cartParsed.reduce((max, order) => max < order.id ? order.id : max, 0);
    const id = lastId + 1;
    const header = `Dodano zamówienie nr: ${id}`

    // JSON format :
    // {
    //     "userId": 2,
    //     "items":[
    //         {
    //             "productId": "5c5e94ed939720ae8f3a7af5",
    //             "amount": 2
    //         }
    //     ] 
    // }

    req.on('data', (data) => {
        const dataParsed = JSON.parse(data);
        const userId = dataParsed.userId;
        const items = dataParsed.items;
        const date = getDate();
        const order = {
            id,
            userId,
            date,
            items
        }
        cartParsed.push(order);
        let orderStringified = JSON.stringify(cartParsed)
        fs.writeFileSync('./data/cart.json', orderStringified);

        const dataToSend = {
            header,
        }
        res.render('cart', dataToSend);
    });
})

module.exports = router;
