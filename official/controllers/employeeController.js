const productTypeDB = require('../models/productType');
module.exports = {
    getIndex: function (req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin"){
                res.redirect('/admin')
            }
            else
            {
                if (req.user.role == "employee")
                    res.render('pages/employeeIndex');
            }
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getOrder:async function (req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin"){
                res.redirect('/admin/order');
            }
            else
            {
                if (req.user.role == "employee")
                {   
                    const productTypes = await productTypeDB.find();
                    res.render('pages/order',{productTypes: productTypes});
                }
            }
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getCheckOut: function(req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin"){
                res.redirect('/admin/checkout');
            }
            else
            {
                if (req.user.role == "employee")
                {   
                    res.render('pages/checkout');
                }
            }
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    }
}