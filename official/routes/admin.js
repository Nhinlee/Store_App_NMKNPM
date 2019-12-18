var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', function(req, res, next) {
    adminController.getIndex(req, res, next);
});

module.exports = router;