$(".back-button").click(function() {
  console.log("hello bug here");
  $("body").load("usecase-choice.html");
});

$(".add-button").click(function() {
  $("#bill-out").before(`<div class="item clearfix" id="expense-0">
                          <div class="product-title">Apartment rent</div>
                          <div class="right clearfix">
                              <div class="item__value">- 900.00</div>
                              <div class="item__number bg-success text-white">1</div>
                              <div class="item__delete"  onclick = "rmOrder()">
                                  <button class="item__delete--btn"><i class="far fa-times-circle mt-0"></i></button>
                              </div>
                          </div>
                        </div>`);
  $("body").load("usecase-choice.html");
});

function rmOrder() {
  // FIX BUG DELETE ALL BILL
  if (
    $(event.target)
      .html()
      .toString() !== ""
  )
    return;
  const orderItem = event.target.parentNode.parentNode.parentNode.parentNode;
  $(orderItem).remove();
}
