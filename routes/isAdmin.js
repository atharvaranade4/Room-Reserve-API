// Middeleware
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.roles.includes('admin')) {
            next();
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e)
    }
};

module.exports = isAdmin;