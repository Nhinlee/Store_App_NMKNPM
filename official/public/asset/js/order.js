// Product Controller Object:
var ProdController = (function() {
  var data = {
    products: [],
    currentProducts: [],
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
    pullProductList: async function() {
      const response = await fetch("http://localhost:3000/api/list-product");
      data.products = await response.json();
      data.currentProducts = data.products;
    },
    addItem: function(prodId) {
      // 1.Check product it had in orders list?
      const index = data.orders.list.findIndex(e => {
        return e._id === prodId;
      });
      // 2.Add product in orders list:
      if (index === -1) {
        const product = data.products.find(e => e._id === prodId);
        if(product.quantity > 0)
        {
          product.number = 1;
          data.orders.list.push(product);
        }else return;
      } else data.orders.list[index].number += 1;
      // 3.Calculate totalprice again:
      calctotalPrice();
      // 4.Des Quantity of this product in products:
      data.products.forEach(e => {
        if (e._id === prodId && e.quantity > 0) {
          e.quantity -= 1;
        }
      });
    },

    DelItem: function(prodId, amount) {
      //1.Delete product with prodId in current orders list:
      const index = data.orders.list.findIndex(e => {
        return e._id === prodId;
      });
      data.orders.list.splice(index, 1);
      // 2.Calc total price again:
      calctotalPrice();
      // 3.Add quantity of this Product in Product List:
      data.products.forEach(e => {
        if (e._id === prodId) {
          e.quantity += amount;
          console.log(e);
        }
      });
    },

    getOrderList: function() {
      return data.orders.list;
    },

    getTotalPrice: function() {
      return data.orders.totalPrice;
    },

    getProdList: function() {
      return data.products;
    },

    getProdCat: function(catName) {
      if (catName === "Tất cả") return (data.currentProducts = data.products);
      return (data.currentProducts = data.products.filter(
        e => e.type === catName
      ));
    },

    getProdSearch: function(searchKey) {
      const temp = searchKey.toUpperCase();
      return data.currentProducts.filter(e => {
        if (e.name.toUpperCase().includes(temp)) return true;
      });
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
    order_list: "#order-list",
    search_area: "#search-area",
    cat_name: "#category-name",
    card_id: ".card-product-id"
  };
  var FormatMoney = function(money) {
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
  return {
    displayProdList: function(list) {
      // Empty product list:
      $("#product-list-section").empty();
      // Display product list:
      list.forEach(e => {
        $("#product-list-section").append(` <div class="col-md-4 mb-2">
        <div class="card" id = "${e._id}">
          <img
            src="${e.image}"
            alt="product-img"
            height="200" width="250"
          />
          <div class="card-body text-center">
            <h4 class = "card-product-name">
              ${e.name}
            </h4>
            <p class ="d-none card-product-id">${e._id}</p>
            <p class="mute card-product-price">${FormatMoney(e.price)} VND </p>
            <div class="btn btn-success btn-sm card-product-quantity"> ${
              e.quantity
            }</div>
            <button class="btn btn-success btn-sm add-button">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>`);
      });
    },
    displayListItem: function(list, total) {
      // Empty order list:
      $("#order-list").empty();
      // Display order list:
      list.forEach(e => {
        $("#order-list").append(`<div class="item clearfix">
                          <div class="item-product-title">${e.name}</div>
                          <div class="right clearfix">
                              <div class="item-id d-none">${e._id}</div>
                              <div class="item-value">${FormatMoney(
                                e.price
                              )} VND</div>
                              <div class="item-number bg-success text-white"><strong>${
                                e.number
                              }</strong></div>
                              <div class="item-delete">
                                  <button class="item__delete--btn"><i class="far fa-times-circle mt-0"></i></button>
                              </div>
                          </div>
                        </div>`);
      });
      $("#bill-out")
        .children("p", "#total-price")
        .html(`<strong>Total price:</strong> ${FormatMoney(total)} VND`);
    },

    addSpinners: function() {
      $(DOM.product_list_section)
        .append(`<div class="spinner-grow text-success" style="width: 5rem; height: 5rem;" role="status">
                  <span class="sr-only">Loading...</span>
                </div>`);
    },

    removeSpinners: function() {
      $(".spinner-grow").remove();
    },

    desProd: function(obj) {
      const quantityDom = obj.siblings(".card-product-quantity");
      let quantity = quantityDom.text() - 1;
      if(quantity < 0) quantity = 0;
      quantityDom.text(`${quantity}`);
      if (quantity === 0) {
        obj.remove();
        quantityDom.removeClass("btn-success");
        quantityDom.addClass("btn-danger");
      }
    },

    incProd: function(prodId, amount) {
      const quantityDom = $(`#${prodId}`).find(".card-product-quantity");
      if (quantityDom.text() === "0") {
        quantityDom.removeClass("btn-danger");
        quantityDom.addClass("btn-success");
        quantityDom.after(`
        <button class="btn btn-success btn-sm add-button">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </button>
      `);
      }
      let quantity = parseFloat(quantityDom.text()) + amount;
      quantityDom.text(`${quantity}`);
    },

    getDOM: function() {
      return DOM;
    }
  };
})();
// Controller Object:
var Controller = (function(ProdCtr, UICtr) {
  var DOM = UICtr.getDOM();
  var setupEventListeners = function() {
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
        const obj =
          $(event.target).attr("class") === "fa fa-plus"
            ? $(event.target).parent()
            : $(event.target);
        CtrAddItem(obj);
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
        // 1.Get Dom Item:
        const obj = $(event.target).parents(".item");
        CtrlDelItem(obj);
      }
    });
    $(DOM.cat_name).change(() => {
      const catName = $(event.target).val();
      CtrCatProduct(catName);
    });
    $(DOM.search_area).keyup(() => {
      const searchKey = $(event.target).val();
      CtrSearchProduct(searchKey);
    });
  };

  var CtrInit = async function() {
    //Loading Effect:
    UICtr.addSpinners();
    // Pull product from API:
    await ProdCtr.pullProductList();
    // Get Product List:
    const prodList = ProdCtr.getProdList();
    // Display product on UI:
    UICtr.displayProdList(prodList);
  };

  var CtrCatProduct = function(catName) {
    // Get product with Category Name Variabel ->catName:
    const prodList = ProdCtr.getProdCat(catName);
    // Display Product on UI:
    UICtr.displayProdList(prodList);
  };

  var CtrSearchProduct = function(searchKey) {
    // Get product with Search Key:
    const prodList = ProdCtr.getProdSearch(searchKey);
    // Display Product on UI:
    UICtr.displayProdList(prodList);
  };

  var CtrAddItem = function(obj) {
    // 1.Get prod ID field:
    const prodId = obj.siblings(DOM.card_id).text();
    // 2.add product into Order list:
    ProdCtr.addItem(prodId);
    // 3.Get list and totalprice of order list:
    const list = ProdCtr.getOrderList();
    const total = ProdCtr.getTotalPrice();
    // 4.Display order list:
    UICtr.displayListItem(list, total);
    // 5.Update Amount of this product on UI:
    UICtr.desProd(obj);
  };

  var CtrlDelItem = function(obj) {
    // Get prod ID field and Amount:
    const prodId = obj.find(".item-id").text();
    const amount = parseFloat(obj.find(".item-number").text());
    // 2.Delete item in data orders list:
    ProdCtr.DelItem(prodId, amount);
    // 3.Get list and totalprice of order list:
    const list = ProdCtr.getOrderList();
    const total = ProdCtr.getTotalPrice();
    // 4.Display List Item again:
    UICtr.displayListItem(list, total);
    // 5.Update Amount of this product on UI:
    UICtr.incProd(prodId, amount);
  };

  return {
    Init: function() {
      console.log("App started!\n");
      CtrInit();
      setupEventListeners();
    }
  };
})(ProdController, UIController);

Controller.Init();
