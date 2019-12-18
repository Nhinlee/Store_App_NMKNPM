var express = require('express');
var router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', function(req, res, next) {
    employeeController.getIndex(req, res, next);
});

router.get('/order', function(req, res, next) {
    employeeController.getOrder(req, res, next);
});

module.exports = router;