
const productTypeDB = require('../models/productType');
const productDB = require('../models/product');
const billDB = require('../models/bill');
const billDetailDB = require('../models/bill-detail');
const customerDB = require('../models/customer');
const bcrypt = require('bcryptjs');
const userDB = require('../models/user');

function formatMoney(money) {
    money = money.toString();
    var format = "";
    let i = money.length,
        k = 0;
    while (i-- > 0) {
        format = money[i] + format;
        k++;
        if (k % 3 === 0 && i != 0) format = "." + format;
    }
    return format;
};

module.exports = {
    getIndex: function (req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin"){
                res.render("pages/adminIndex");
            }
            else
                res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getOrder:async function (req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin"){
                const productTypes = await productTypeDB.find();
                res.render('pages/order',{productTypes: productTypes});
            }
            else
            {
                if (req.user.role == "employee")
                {   
                    res.send({message: "Bạn không có quyền truy cập vào trang này!"});
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
                res.render('pages/checkout');
            }
            else
            {
                if (req.user.role == "employee")
                {   
                    res.send({message: "Bạn không có quyền truy cập vào trang này!"});
                }
            }
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getHistoryInday: async function(req, res, next){
        if (req.isAuthenticated())
        {  
            if (req.user.role == "admin"){
                const temp = new Date();
                const today = new Date(temp.getFullYear() + "/" + (temp.getMonth() + 1) + "/" + temp.getDate());
                const tomorow = new Date(today);
                tomorow.setDate(tomorow.getDate() + 1);
                const bills = await billDB.find({createOn: {$gte: today, $lte: tomorow}}).sort({createOn: 1});
                let customerNames = null;
                let totalPriceInday = 0;
                if (bills != null)
                {
                    customerNames = [];
                    for (i = 0; i < bills.length; i++)
                    {
                        const customer = await customerDB.findById(bills[i].customerId);
                        customerNames.push(customer.fullname);
                        totalPriceInday += bills[i].totalPrice;
                    }
                }
                res.render('pages/history-inday',{
                    bills: bills,
                    customerNames: customerNames,
                    totalPriceInday: formatMoney(totalPriceInday)
                });
            }
            else
            {
                if (req.user.role == "employee")
                {   
                    res.send({message: "Bạn không có quyền truy cập vào trang này!"});
                }
            }
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getBillDetail: async function (req, res, next){
        if (!req.isAuthenticated())
        {
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
            return;
        }
        const id = req.query.id;
        if (id === undefined){
            res.send({message: "Không tìm thấy hoá đơn!"});
        }
        else{
            const billList = await billDetailDB.find({billId: id});
            const bill = await billDB.findById(id);
            const customer = await customerDB.findById(bill.customerId);

            if (billList != null && bill != null && customer != null){
                let gender;
                if (customer.gender == 0)
                    gender = "Male";
                else
                    gender = "Female";

                res.render('pages/bill-detail',{
                    customer: customer,
                    billList: billList,
                    totalPrice: formatMoney(bill.totalPrice),
                    gender: gender
                })
            }
            else{
                res.send({message: "Không tìm thấy hoá đơn!"});
            }
        }
    },
    getAddEmployee: function (req, res, next){
        if (req.isAuthenticated())
        {
            let error = req.query.error;
            if (error === undefined)
                error = -1;
            if (req.user.role == "admin")
                res.render('pages/add-employee',{error: error});
            else
                res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        
    },
    postAddEmployee: async function (req, res, next){
        if (req.isAuthenticated())
        {
            if (req.user.role == "admin")
            {
                const username =req.body.username;
                const user = await userDB.findOne({username: username});
                if (user != null)
                    res.redirect('/admin/add-employee?error=1');
                else{
                    if (req.body.password != req.body.passConfirm)
                        res.redirect('/admin/add-employee?error=2');
                    else{
                        const hashPass = await bcrypt.hash(req.body.password, 8);
                        const newEmployee = new userDB({
                            username: username,
                            password: hashPass,
                            email: req.body.email,
                            fullname: req.body.fullname,
                            gender: req.body.gender,
                            dob: req.body.dob,
                            address: req.body.address,
                            role: "employee",
                            phone: req.body.phone
                        });
                        await newEmployee.save();
                        res.redirect('/admin/add-employee?error=0');
                    }
                    }
            }
            else
                res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getProductList: async function (req, res, next){
        if (req.isAuthenticated())
        {

            if (req.user.role == "admin")
            {
                const productList = await productDB.find();
                res.render('pages/product-list',{productList: productList});
            }
            else
                res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    getAddProduct: async function (req, res, next){
        if (req.isAuthenticated())
        {
            let error = req.query.error;
            if (error === undefined)
                error = -1;
            if (req.user.role == "admin")
            {
                const productType = await productTypeDB.find();
                res.render('pages/add-product',{productType: productType, error: error});
            }
            else
                res.send({message: "Bạn không có quyền truy cập vào trang này!"});
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    },
    postAddProduct: async function(req, res, next, id){
        const product = await productDB.findById(id);
        if (product == null)
        {
            res.redirect('/admin/add-product?error=1');
            return;
        }
        product.name = req.body.name;
        product.type = req.body.category;
        product.price = req.body.price;
        product.descrition = req.body.des;
        product.quantity = req.body.quantity;
        product.image = "/image/" + id + ".jpg";
        await product.save();
        res.redirect('/admin/add-product?error=0');
    }
    
}