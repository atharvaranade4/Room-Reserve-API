const { Router } = require("express")
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userDAO = require('../daos/userDAO');

const isLoggedIn = require('./isLoggedIn');

router.post("/signup", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                email: req.body.email,
                password: hashedPassword,
                roles: ['user']
            }            
            const savedUser = await userDAO.createUser(user, user.email)
            if ( savedUser === 'exists'){
                res.status(409).send('user exists')
            } else {
                res.json(savedUser)
            }
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const getUser = await userDAO.getUser(req.body.email);
            // console.log(user)
            const result = await bcrypt.compare(req.body.password, getUser.password);
            if (!result) {
                res.status(401).send("password doesn't match");
            } else {
                const user = {
                    _id: getUser._id.toString(),
                    email:getUser.email,
                    roles: getUser.roles
                }
                const secret = "jwtsecret"
                const token = jwt.sign(user, secret)
                res.json({ token: token });
            }
        } catch(e) {
            res.status(401).send(e.message);
        }
    }
});

router.post("/password", isLoggedIn, async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    }
    else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10); // use 10 for course
            const success = await userDAO.updateUserPassword(req.user._id, hashedPassword);
            res.sendStatus(success ? 200 : 401);
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/logout", async (req, res, next) => {
    res.sendStatus(404);
});

module.exports = router;