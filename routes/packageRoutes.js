const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', verifyAdmin, packageController.createPackage);
router.put('/:id', verifyAdmin, packageController.updatePackage);
router.delete('/:id', verifyAdmin, packageController.deletePackage);

module.exports = router;
