const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getAllUsers } = require('../controllers/user.controller');
router.use(auth);
router.get('/', getAllUsers);
module.exports = router;
