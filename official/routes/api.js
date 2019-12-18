var express = require('express');
var router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/list-product', function(req, res, next) {
    apiController.getListProduct(req, res, next);
});

module.exports = router;