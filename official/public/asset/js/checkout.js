
const orderList = JSON.parse(localStorage.getItem('orderList'));
for (i = 0; i < orderList.length; i++)
{
    const bill = orderList[i];
    addBill(bill.name, bill.price, bill.number);
}
const totalPrice = localStorage.getItem('totalPrice');
const totalPriceTag = document.getElementById('total-price');
totalPriceTag.innerHTML = "<strong>Total price:</strong> " + totalPrice;

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
function backEvent(){
    const url = window.location.href;
    const tokens = url.split('/');
    let resUrl = "";
    for (i = 3; i < tokens.length - 1; i++)
    {
      resUrl = resUrl + "/" + tokens[i];
    }
    window.location.href = resUrl + "/order";
}
function addBill(name, price, quantity){
    const htmlElement = '<div class="item-product-title">'+ name + '</div><div class="right clearfix"> <div class="item-value">'+ formatMoney(price) + ' VND' + '</div><div class="item-number bg-success text-white"> <strong>' + quantity + '</strong></div></div>';
    const div = document.createElement("div");
    div.className = "item clearfix";
    div.innerHTML = htmlElement;
    const orderList = document.getElementById('order-list');
    orderList.appendChild(div);
}

function getCustomerInfo(){
    const fullname = document.getElementById('fullnameID').value;
    const email = document.getElementById('emailID').value;
    const phone = document.getElementById('phoneID').value;
    const gender = document.getElementById('genderID').value;
    const dob = document.getElementById('dobID').value;
    const address = document.getElementById('addressID').value;

    const customer = {
        fullname: fullname, 
        email: email,
        phone: phone,
        gender: gender,
        dob: dob,
        address: address
    }
    return customer;
}

function checkCustomerInfo(customer){
    if (customer.fullname != "" && customer.email != "" && customer.phone != "" && customer.dob != "" && customer.address != "")
        return true;
    return false;
}

function reFormatPrice(money){
    let res = "";
    money = money.substring(0, money.length - 4);
    const tokens = money.split('.');
    tokens.forEach((token) => {
        res += token;
    })
    return res;
}

async function postBill(){
    const totalPrice = reFormatPrice(localStorage.getItem('totalPrice'));
    const now = new Date();
    const customer = getCustomerInfo();
    if (!checkCustomerInfo(customer))
    {
        alert('Lỗi: Thông tin khách hàng trống!');
        return false;
    }
    const data = {
        customer: customer,
        orderList: orderList,
        totalPrice: totalPrice,
        createOn: now
    };
    try{
        const res = await fetch("http://localhost:3000/api/checkout",{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        });

        const isSuccessful = await res.json();
        if (isSuccessful.res == 0)
        {
        alert('Thanh toán hoá đơn không thành công!');
        return false;
        }
        else{
        alert('Thanh toán thành công!');
        let url = window.location.href;
        url = url.substring(0, url.length - 8) + 'order';
        window.location.href = url;
        return false;
        }
    }catch(e)
    {
        throw (e);
    }
}