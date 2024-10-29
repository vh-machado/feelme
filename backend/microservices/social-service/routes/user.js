const express = require('express');
const { getUsers, getUserById,  saveUser, updateUser, deleteUser, getSearchUser} = require('../controllers/userController');
const admin = require('../middlewares/admin')
const router = express.Router();

router.get('/users', admin, getUsers);
router.get('/user/:id', getUserById);
router.get('/search/user', getSearchUser);
router.post('/user', saveUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
