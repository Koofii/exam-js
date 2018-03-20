let productDiv = $("#products");
let products;
let cartListOrder = {};
let cartList = {};
let order = {}
$("#send-order").on("click", function(){

    const promises = [];

    for(let i in cartList){
        const productId = i;
        const quantity = cartList[i];
        const order = {
            productId,
            quantity
        };
        const promise = fetch("http://localhost:3000/orders", {
            method: 'POST',
            body: JSON.stringify(order),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        promises.push(promise)
    }

    Promise.all(promises).then(function(){
        delete cartList;
        alert("DONE");
    })
});

fetch("http://demo.edument.se/api/products")
    .then(response => response.json())
    .then(data => products = data)
    .then(() => {
        for (let i = 0; i < products.length; i++){
            let stock = Math.floor((Math.random()* 10 ) + 1)
            products[i].lager = stock
        }
        console.log(products)
    })
    .then(function(){
        products.forEach(function(element){
            productDiv.append(createProduct(element)); 
        });
        $(".add-to-cart").on("click", addToCart)
        $(".add-to-cart").on("click", updateLager)
        $(".add-to-cart").on("click", prisLista)
    });
    

function addToCart(e){
    e.stopPropagation();
    let id = $(this).parent().attr("data-value");
    if($(this).parent().attr("data-value") in cartList && products[id-1].lager > 0){
        cartList[$(this).parent().attr("data-value")] += 1;
    } else {
        cartList[$(this).parent().attr("data-value")] = 1;
    }
    update();

};
function updateLager(){
    let id = $(this).parent().attr("data-value");
    if (products[id-1].lager <= 0){
        alert("no can do")
    } else{
        products[id-1].lager -=1;
        $(this).parent().children("div").children("p").text("Lagerstatus:" + products[id-1].lager)
    }
    
}
function update(){
    let list = findProduct(cartList, products);
    $("#cartHtml").html(list);
    updateNumber();
}
function createProduct(prod){

    productDiv.append($('<div data-value=' + prod.Id + ' class="produkt">').append("<div>" + prod.Name + "</div>")
    .append("<div>" + prod.Price + "</div>").append("<div>" + prod.Description + "</div>")
    .append('<img src=' + prod.Image + '>').append('<button class="add-to-cart">Add to cart</button>').append(`<div><p>lagerstatus: ${prod.lager}</p></div>`))
    

};
function findProduct (cart, products){
    let items = Object.keys(cart).map(key =>
    products.find(product => product.Id === Number(key)));
    return itemsHtml = items.map(items =>{
        return `
        <div data-value="${items.Id}"><span> ${items.Name}</span><span> Amount:</span> </span><span id="product${items.Id}">${cart[items.Id]}</div>
        `
    }).join(" ");
};
function updateNumber(){
    let nr = countKeys(cartList);
    function countKeys(obj){
        return Object.keys(obj)
        .reduce(function(sum, key){
            return sum + parseInt(obj[key]);
        },0 );
    }
    let cartTotal = $("#cartTotal").html(nr);
    
};
let prisList = [];
function prisLista(){
    let id = $(this).parent().attr("data-value")
    if (cartList[id] > 0){
        prisList.push(products[id-1].Price)
        console.log(prisList)
    } else {
        prisList.push(products[id-1].Price)
        console.log(prisList)
    }
    let pris = prisList.reduce(add, 0)
    $("#totalt-pris").text(Math.round(pris))
}
function add(a, b){
    return Number(a) + Number(b)
}


