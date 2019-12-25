const multer = require('multer');
const productDB = require('../models/product');
let productId;


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./public/image');
    },
    
    filename: async function(req, file, cb){
        const product = new productDB();
        productId = product._id;
        await product.save();
        cb(null,productId + ".jpg");
    }
});
const upload = multer({storage: storage});
module.exports = {
    upload,
    getId: function(){
        return productId;
    }
}