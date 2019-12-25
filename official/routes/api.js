var express = require('express');
var router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/list-product', function(req, res, next) {
    apiController.getListProduct(req, res, next);
});

router.get('/statistic', function(req, res, next) {
    apiController.getStatistic(req, res, next);
});

router.get('/remove-product', function(req, res, next) {
    apiController.removeProduct(req, res, next);
});


router.post('/checkout', function(req, res, next) {
    apiController.postBill(req, res, next);
});

module.exports = router;