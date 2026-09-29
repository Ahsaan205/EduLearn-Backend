const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { recordVisit, getFrequentVisits } = require('../controllers/visitsController');

router.use(authMiddleware);

router.post('/', recordVisit);
router.get('/', getFrequentVisits);

module.exports = router;
