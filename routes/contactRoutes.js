const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', contactController.submitMessage);
router.get('/admin/all', verifyAdmin, contactController.getAllMessages);
router.delete('/admin/:id', verifyAdmin, contactController.deleteMessage);
router.put('/admin/:id/status', verifyAdmin, contactController.updateMessageStatus);

module.exports = router;
