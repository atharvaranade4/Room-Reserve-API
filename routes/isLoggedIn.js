const jwt = require('jsonwebtoken');
const secret = 'jwtsecret';

// Middeleware
const isLoggedIn = async (req, res, next) => {
    const userAuth = req.headers.authorization;
    if (!userAuth){
        res.status(401).send('No authorization provided')
    } else {        
        const token = userAuth.slice(7)
        // console.log('token is ', token)
        try {
            const verifyUser = jwt.verify(token, secret)
            // console.log('verify userid is ', verifyuserId)
            req.user = verifyUser
            console.log(req.user)
            next()
        } catch (e) {
            // console.log('reached catch')
            res.status(401).send(`${e}, Token does not exist`)
            next(e)
        }
    }
};

module.exports = isLoggedIn;