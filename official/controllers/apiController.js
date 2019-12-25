const productDB = require('../models/product');
const customerDB = require('../models/customer');
const billDB = require('../models/bill');
const billDetailDB = require('../models/bill-detail');


module.exports = {
    getListProduct: async function (req, res, next){
      const listProduct = await productDB.find();

      res.json(listProduct);
    },
    postBill: async function(req, res, next){
      const data = req.body;
      try
      {
        const customer = new customerDB({
          fullname: data.customer.fullname,
          email: data.customer.email,
          phone: data.customer.phone,
          gender: data.customer.gender,
          dob: data.customer.dob,
          address: data.customer.address
        });
        
        await customer.save();

        const bill = new billDB({
          customerId: customer._id,
          createOn: data.createOn,
          totalPrice: data.totalPrice
        });
        
        await bill.save();

        data.orderList.forEach(async function(order){
          const billDetail = new billDetailDB({
            billId: bill._id,
            productId: order._id,
            productName: order.name,
            quantity: order.number,
            productPrice: order.price
          })

          await billDetail.save();

          const product = await productDB.findById(order._id);
          if (product == null)
          {
            res.send({res: 0});
            return;
          }
          product.quantity -= order.number;
          await product.save();
        });

        res.send({res: 1});
      }
      catch (e)
      {
        res.send({res: 0});
        next(e);
      }
    },
    getStatistic: async function(req, res, next){
      const startDate = new Date(req.query.startDate);
      const now =  new Date();
      const endDate = new Date (req.query.endDate);
      endDate.setDate(endDate.getDate() + 1);
      console.log(startDate.toGMTString());
      console.log(endDate.toGMTString());
      if (endDate <= now){
        const bills = await billDB.find({createOn: {$gte: startDate, $lte: endDate}}).sort({createOn: 1});
        let customerNames = null;
        let totalPrice = 0;
        if (bills != null)
        {
            customerNames = [];
            for (i = 0; i < bills.length; i++)
            {
                const customer = await customerDB.findById(bills[i].customerId);
                customerNames.push(customer.fullname);
                totalPrice += bills[i].totalPrice;
            }
        }
        const result = {bills: bills, customerNames: customerNames, totalPrice: totalPrice, success: true};
        res.json(result);
      }
      else
      {
        res.send({success: false, message: "Lỗi: Chưa hết ngày " + now.toLocaleDateString()});
      }
    },
    removeProduct: async function(req, res, next){
      const productId = req.query.id;
      if (productId === undefined)
        return;
      await productDB.deleteOne({_id: productId});
    } 
}