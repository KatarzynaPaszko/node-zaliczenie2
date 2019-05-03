const express = require('express');

const router = express.Router();

let users = [{
    id: 1,
    name: 'Jan',
    username: 'janko',
    email: 'jan@nowak'
}];
// adres: http://localhost:4700/getUsers
// adres: http://localhost:4700/getUsers?id=1
router.get('/getUsers', (req, res) => {
    const { id } = req.query;
    const result = id ? users.find(i => i.id === +id) : users;
    res.send(result);
});

// adres: http://localhost:4700/addUser?name=janek
router.get('/addUser', (req, res) => {
    const user = {
        id: users.reduce((maxId, next) => maxId < next.id ? next.id : maxId, 0) + 1,
        ...req.query
    };
    users.push(user);

    res.send(users);
});

// adres: http://localhost:4700/deleteUser?id=1
router.get('/deleteUser', (req, res) => {
    const id = parseInt(req.query.id);
    users = users.filter(i => i.id !== id);

    res.send(users);
});

module.exports = router;