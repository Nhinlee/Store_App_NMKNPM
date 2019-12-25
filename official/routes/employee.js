var express = require('express');
var router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', function(req, res, next) {
    employeeController.getIndex(req, res, next);
});

router.get('/order', function(req, res, next) {
    employeeController.getOrder(req, res, next);
});

router.get('/checkout', function(req, res, next) {
    employeeController.getCheckOut(req, res, next);
});

router.get('/history-inday', function(req, res, next) {
    employeeController.getHistoryInday(req, res, next);
});

router.get('/bill-detail', function(req, res, next) {
    employeeController.getBillDetail(req, res, next);
});

module.exports = router;