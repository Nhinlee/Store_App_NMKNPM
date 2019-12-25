var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');
const uploadController = require('../controllers/uploadController');

router.get('/', function(req, res, next) {
    adminController.getIndex(req, res, next);
});

router.get('/order', function(req, res, next) {
    adminController.getOrder(req, res, next);
});

router.get('/checkout', function(req, res, next) {
    adminController.getCheckOut(req, res, next);
});

router.get('/history-inday', function(req, res, next) {
    adminController.getHistoryInday(req, res, next);
});

router.get('/bill-detail', function(req, res, next) {
    adminController.getBillDetail(req, res, next);
});

router.get('/add-employee', function(req, res, next) {
    adminController.getAddEmployee(req, res, next);
});

router.post('/add-employee', function(req, res, next) {
    adminController.postAddEmployee(req, res, next);
});

router.get('/product-list', function(req, res, next) {
    adminController.getProductList(req, res, next);
});

router.get('/statistics', function(req, res, next) {
    res.render('pages/statistic');
});

router.get('/add-product', function(req, res, next) {
    adminController.getAddProduct(req, res, next);
});

router.post('/add-product', uploadController.upload.single("image"), function(req, res, next) {
    adminController.postAddProduct(req, res, next, uploadController.getId());
});

module.exports = router;