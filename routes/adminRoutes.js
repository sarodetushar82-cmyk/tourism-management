const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/stats', verifyAdmin, adminController.getDashboardStats);
router.get('/users', verifyAdmin, adminController.getAllUsers);
router.delete('/users/:id', verifyAdmin, adminController.deleteUser);

module.exports = router;
