// Product Controller Object:
var ProdController = (function() {
  var data = {
    products: [],
    orders: {
      list: [],
      totalPrice: 0
    }
  };

  var calctotalPrice = function() {
    data.orders.totalPrice = 0;
    data.orders.list.forEach(e => {
      // e.price is not sure. change it when have REST API.
      data.orders.totalPrice += e.price * e.number;
    });
  };

  return {
    addItem: function(product) {
      // 1.Check product it had in orders list?
      var index = data.orders.list.findIndex(e => {
        return e.title === product.title;
      });
      // 2.Add product in orders list:
      if (index === -1) {
        product.number = 1;
        data.orders.list.push(product);
      } else data.orders.list[index].number += 1;
      // 3.Calculate totalprice again:
      calctotalPrice();
      // 4.Return new item if it neccessary
    },

    DelItem: function(prodId) {
      //1.Delete product with prodId in current orders list:
      const index = data.orders.list.findIndex(e => {
        return e.title === prodId;
      });
      data.orders.list.splice(index, 1);
      // 2.Calc total price again:
      calctotalPrice();
    },

    getOrderList: function() {
      return data.orders.list;
    },

    getTotalPrice: function() {
      return data.orders.totalPrice;
    },

    delItem: function(prodId) {
      // 1.Find product in orders list.
      // 2.Delete that.
    }
  };
})();
// UI Controller Object:
var UIController = (function() {
  var DOM = {
    product_list_section: "#product-list-section",
    order_list: "#order-list"
  };
  return {
    displayListItem: function(list, total) {
      // Empty order list:
      $("#order-list").empty();
      list.forEach(e => {
        $("#order-list").append(`<div class="item clearfix" id="item-0">
                          <div class="item-product-title">${e.title}</div>
                          <div class="right clearfix">
                              <div class="item-value">${e.price}</div>
                              <div class="item-number bg-success text-white"><strong>${e.number}</strong></div>
                              <div class="item-delete">
                                  <button class="item__delete--btn"><i class="far fa-times-circle mt-0"></i></button>
                              </div>
                          </div>
                        </div>`);
      });
      $("#bill-out")
        .children("p", "#total-price")
        .html(`<strong>Total price:</strong> ${total} VND`);
    },
    getDOM: function() {
      return DOM;
    }
  };
})();
// Controller Object:
var Controller = (function(ProdCtr, UICtr) {
  var setupEventListeners = function() {
    var DOM = UICtr.getDOM();
    // Set add button:
    $(DOM.product_list_section).click(() => {
      if (
        $(event.target)
          .attr("class")
          .toString()
          .search("add-button") != -1 ||
        $(event.target)
          .parent()
          .attr("class")
          .toString()
          .search("add-button") != -1
      ) {
        CtrAddItem(event);
      }
    });
    // Set delete button:

    $(DOM.order_list).click(() => {
      if (
        $(event.target)
          .attr("class")
          .toString()
          .search("fa-times-circle") != -1 ||
        $(event.target)
          .attr("class")
          .toString()
          .search("item__delete--btn") != -1
      ) {
        CtrlDelItem(event);
      }
    });
  };
  var CtrAddItem = function(event) {
    // 1.Get title and price of product from UI:
    var obj =
      $(event.target).attr("class") === "fa fa-plus"
        ? $(event.target).parent()
        : $(event.target);
    // Change later------------------------------------
    var title = obj.siblings("h4").text();
    var price = parseFloat(obj.siblings("p").text());
    // 2.add product into Order list:
    ProdCtr.addItem({ title: title, price: price });
    // 3.Get list and totalprice of order list:
    const list = ProdCtr.getOrderList();
    const total = ProdCtr.getTotalPrice();
    // 4.Display order list:
    UICtr.displayListItem(list, total);
  };

  var CtrlDelItem = function(event) {
    // 1.Get Dom Item:
    const obj = $(event.target).parents(".item");
    // 2.Delete item in data orders list:
    ProdCtr.DelItem(obj.children(".item-product-title").text());
    // 3.Get list and totalprice of order list:
    const list = ProdCtr.getOrderList();
    const total = ProdCtr.getTotalPrice();
    // 4.Display List Item again:
    UICtr.displayListItem(list, total);
  };

  return {
    Init: function() {
      console.log("App started!\n");
      setupEventListeners();
    }
  };
})(ProdController, UIController);

Controller.Init();
