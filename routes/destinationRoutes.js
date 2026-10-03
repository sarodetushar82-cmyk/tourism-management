const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post('/', verifyAdmin, destinationController.createDestination);
router.put('/:id', verifyAdmin, destinationController.updateDestination);
router.delete('/:id', verifyAdmin, destinationController.deleteDestination);

module.exports = router;
