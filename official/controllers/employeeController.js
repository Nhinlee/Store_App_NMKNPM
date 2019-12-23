const productTypeDB = require('../models/productType');
const billDB = require('../models/bill');
const customerDB = require('../models/customer');


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
    },
    getHistoryInday: async function(req, res, next){
        if (req.isAuthenticated())
        {
            
            if (req.user.role == "admin"){
                res.redirect('/admin/history-inday');
            }
            else
            {
                if (req.user.role == "employee")
                {   
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
            }
        }
        else
            res.send({message: "Bạn không có quyền truy cập vào trang này!"});
    }
}