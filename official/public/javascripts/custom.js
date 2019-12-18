let productList;
let currentList;

async function getProductList(){
    const res = await axios.get('http://localhost:3000/api/list-product');
    productList = res.data;
    currentList = productList;
    for (i = 0; i < productList.length; i++)
    {
        const product = productList[i];
        addProduct(product.image, product.name, product._id, product.price);
    }
}
getProductList();

function getCustomProductList(list, change){
    if (change)
        currentList = list;
    const listProductTag = document.getElementById('product-list-section');
    listProductTag.innerHTML = "";
    for (i = 0; i < list.length; i++){
        const product = list[i];
        addProduct(product.image, product.name, product._id, product.price);
    }
}

function addProduct(srcImage, name, id, price){
    const htmlElement = '<div class="card"><img src="' + srcImage + '" alt="product-img height="200" width="200" "/> <div class="card-body text-center"> <h4>' + name + '</h4> <h5>(' + id + ')</h5><p class="mute">' + price + '</p><a href="#" class="btn btn-success btn-sm"> details</a> <button class="btn btn-success btn-sm add-button"> <i class="fa fa-plus" aria-hidden="true"></i> </button> </div></div>';
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-2';
    div.innerHTML = htmlElement;
    const listProduct = document.getElementById('product-list-section');
    listProduct.appendChild(div);
}

function filterType(select){
    if (select.value == "Tất cả")
    {
        getProductList();
        return;
    }
    let list = [];
    for (i = 0; i < productList.length; i++)
    {
        const product = productList[i];
        if (select.value == product.type){
            list.push(product);
        }
    }
    getCustomProductList(list, true);
}

function search(searchTag){
    let list = [];
    const temp = searchTag.value.toUpperCase();
    for (i = 0; i < currentList.length; i++){
        if ((currentList[i].name).toUpperCase().includes(temp) || 
                (currentList[i]._id).toUpperCase().includes(temp))
            list.push(currentList[i]);
    }
    getCustomProductList(list, false);
}