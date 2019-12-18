const productDB = require('../models/product');

module.exports = {
    getListProduct: async function (req, res, next){
      const listProduct = await productDB.find();

      res.json(listProduct);
    }
}