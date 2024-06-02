
var url = document.location.pathname.slice(12);
console.log(url)
var errors = 0;
const BASEURL = "json/";

function ajaxCallBack(fileName, result){
    $.ajax({
        url: BASEURL + fileName,
        method: "get",
        dataType: "json", 
        success: result,
        error: function(jqXHR){
            var msg = '';
            if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
            msg = 'Time out error.';
            } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
            } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            document.querySelector("body").innerHTML =
                             `<div class="error-modal">
                                <div class="error-modal-content">
                                    <label for="errorModal" class="close">
                                        <a href="/">&#10005;</a>
                                    </label>
                                    <p>Sorry your error is: ${msg} </p>
                                    <p>Please try again  later and check you path one more time</p>
                                </div>
                               </div>`
        }
    })
}

window.addEventListener("load", function () {
    var loader = document.getElementById("loader-wrapper");
    setTimeout(function() {
        loader.style.display = "none";
      }, 3000);
  });

window.onload = function(){
//#region NAVIGATION AND FLAIRS
    ajaxCallBack("menu.json", function(result){
        navPrint(result);
    })

    ajaxCallBack("flair.json", function(result){
        saveLS("allFlairs", result);
    })

//#endregion





//#region SCROLL TO TOP
if(url != "/author.html"){
    jQuery(document).ready(function($) {
        $(".scroll").click(function(event) {
            event.preventDefault();
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top
            }, 900);
        });
    });

    $().UItoTop({
        easingType: 'easeOutQuart'
    });
}
    
//#endregion

//#region CART
    $(".top_googles_cart").click(function(event){
        event.preventDefault;
        
        if($("#cart-modal").hasClass("hide")){
            $("#cart-modal").removeClass("hide");
            showData();
        }
        else{
            $("#cart-modal").addClass("hide");
        }
    
    });

    let cartModal = document.querySelector("#cart-modal");
    let span = document.querySelector(".close-contact");
    span.addEventListener('click', ()=>{
        cartModal.classList.add('hide');
    })
    

    $(document).on("click", ".btn-cart", function(event){
        event.preventDefault();
        
    })

    $(document).on("click", ".btn-clear-cart", removeAllFromCart);

    //#region DELIVERY INFO CHECK 
    btnDelivery = document.querySelector("#delivery-btn");
    btnDelivery.addEventListener("click", formCheckDelivery);
    btnDelivery.addEventListener("click", function(event){
        event.preventDefault()
    });
    //#endregion
    
//#endregion


if(url == "/index.html" || url == "/" ){
    
    ajaxCallBack("products.json", function(result){
        randomProductsPrint(result);
    })

//#region TESTIMONIALS 
    ajaxCallBack("testimonials.json", function(result){
        testimonialsPrint(result);
    })
//#endregion

//#region SLIDER
    ajaxCallBack("slider.json",function(result){
        sliderPrint(result)
    })
//#endregion

//#region COUNTDOWN
    setTimeout(countDown, 1000);
//#endregion

}


if(url == "/shop.html"){
    $(document).on("change", "#price-sort", change);
    $(document).on("change", ".model", change);
    $(document).on("change", ".brand", change);
    document.querySelector(".btnSearch").addEventListener('click', change);
//#region AJAX CALLBACK 
    ajaxCallBack("products.json", function(result){
        saveLS("allProducts", result);
        productPrint(result);
        
    })

    ajaxCallBack("brand.json", function(result){
        brandChbPrint(result);
    })

    ajaxCallBack("models.json", function(result){
        modelsChbPrint(result);
    })
//#endregion

    

//#region MORE INFO
    $(document).on("click", ".more-info-btn", function(){
        let info = this.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
        let item = this.parentElement.parentElement.parentElement.parentElement;

        info.classList.remove("hide");
        item.classList.add("hide");
        
    });
    $(document).on("click", ".close", function(){
        let info = this.parentElement.parentElement;
        let item = this.parentElement.parentElement.previousElementSibling;

        info.classList.add("hide");
        item.classList.remove("hide");
    })
//#endregion
}

if(url == "/about.html"){
//#region PARTNERS
    ajaxCallBack("partners.json", function(result){
        partnersPrint(result);
        
    })
    
//#endregion

//#region ASPECTS
    ajaxCallBack("content.json", function(result){
        let aspects = ``;
        for(let aspect of result){
            aspects += 
                        `
                            <div class="col-lg-3 footer-top-w3layouts-grid-sec">
                                <div class="mail-grid-icon text-center">
                                    <i class="${aspect.icon}"></i>
                                </div>
                                <div class="mail-grid-text-info">
                                    <h3>${aspect.title}</h3>
                                    <p>${aspect.description}</p>
                                </div>
                            </div>
                        `
        }
        document.querySelector(".aspects-row").innerHTML += aspects;
    })
//#endregion

}

if(url == "/contact.html"){
    btnSubmit = document.querySelector("#btnSubmit");
    btnSubmit.addEventListener("click", formCheck);
    btnSubmit.addEventListener("click", function(event){
        event.preventDefault()
    });
}


}

//#region FUNCTIONS
function testimonialsPrint(testimonials){
    let testimonial = ``
    for(let test of testimonials){
        testimonial += 
                        `<div class="test-item">
                            <div class="testimonials_grid text-center">
                                <h3>${test.name}
                                    
                                </h3>
                                <span>Customer</span>
                                <label>${test.country}</label>
                                <p>${test.description}</p>
                            </div>
                        </div>    
                        `
    }
    
    document.querySelector(".testimonialSlider").innerHTML = testimonial;
    $('.testimonialSlider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1
        }); 
}

function sliderPrint(slider){
    let sliderWrap = `<div class="carousel-inner" role="listbox">`;
    for(s of slider){
        sliderWrap += `<div class="carousel-item ${s.class}">
                        <div class="carousel-caption text-center">
                            <h3>${s.h3} eyewear
                                <span>${s.span}</span>
                            </h3>
                            <a href="shop.html" class="btn btn-sm animated-button gibson-three mt-4">Shop Now</a>
                         </div>
                        </div>`
    }
    sliderWrap += `</div>`;

    document.querySelector(".sliderDynamic").innerHTML += sliderWrap;
}

function partnersPrint(result){
    let partners = ``;
        for(let partner of result){
            partners += 
                        `
                        <div class="col-md-3 team-main-gd">
                        <div class="team-grid text-center">
                            <div class="team-img">
                                <img class="img-fluid rounded" src="${partner.image}" alt="${partner.name}">
                            </div>
                            <div class="team-info">
                                <h4>${partner.name}</h4>
                                <span class="mb-4">${partner.description} </span>
                            </div>
                        </div>
                    </div>
                        `
        }
        document.querySelector(".partners-row").innerHTML = partners
}

function showData(){
    let productsCart = getLS("cart");
        
        if(productsCart == null){
            showEmptyCart();
        }
        else{
            printCart();
            $("#cart-delivery-info").removeClass("hide");
            $("#clear-button").removeClass("hide");
        }
}
function printCart(){
    let allProducts = getLS("allProducts");
    let cartItems = getLS("cart");
    
    let productsForDisplay = allProducts.filter(el => {
        for(let pCart of cartItems){
            if(el.id == pCart.id){
                el.qty = pCart.qty;
                
                return true;
            }
        }
        return false;
    })

    printTable(productsForDisplay);
}
function printTable(products){
    let html = `<table class="table-cart timetable_sub">
    <thead>
        <tr>
            <th>Num.</th>
            <th>Image</th>
            <th>Name</th>
            <th>Base Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Remove</th>
        </tr>
    </thead>
    <tbody>`;

    let sum = 0;
    let counter = 0;
    for(let p of products){
        counter++;
        html +=  `<tr class="rem1" data-id="${p.id}">
                    <td class="invert">${counter}</td>
                    <td class="invert-image">
                        <a href="shop.html">
                            <img src="images/${p.image}" style='height:100px' alt="${p.name}" class="img-responsive">
                        </a>
                    </td>
                    <td class="invert">${p.name}</td>
                    <td class="invert">$${p.price.newPrice}</td>
                    <td class="invert"><input type="number" id="qtyNum" name="qtyNum" onchange="quantityChanged(this)"  min="1" value="${p.qty}"/></td>
                    <td class="invert price-product">$${p.price.newPrice * p.qty}</td>
                    <td class="invert">
                        <div class="rem">
                            <div class=""><button class='btn-remove' data-id='${p.id}'>Remove</button> </div>
                        </div>
                    </td>
                </tr>`
    
    
        sum = sum + (p.price.newPrice * p.qty);
    }

    html +=`    </tbody>
    </table>`;

    $("#naslov-cart-h2").removeClass("hide");
    $("#products-items").html(html);
    $(".btn-remove").click(removeFromCart);
    $("#total-price").html(`<strong>Total price: $${sum}</strong>`);
    
}
function quantityChanged(target){
    let productId = target.parentElement.parentElement.getAttribute("data-id");
    let cartItems = getLS("cart");
    let allProducts = getLS("allProducts");
    let priceProductField = target.parentElement.nextElementSibling;
    let quantity = target.value
    let targetArray = cartItems.filter(item=>item.id == productId);
    
    let productsArray = allProducts.filter(product => product.id == productId)
    
    for(let p of productsArray){
        priceProductField.innerHTML = p.price.newPrice * quantity ? `$${p.price.newPrice * quantity}`:"";
    }

    if(quantity < 1 || isNaN(quantity)) {
        target.value = 1
        quantity = 1
    }

    for(let c of cartItems) {
      
        if(c.id == targetArray[0].id) {
            c.qty = Number(quantity)
        }
    }
    saveLS("cart", cartItems);
    
    updateCartTotal()
}

function updateCartTotal() {
    const total = document.querySelector('#total-price');
    
    let cartTotal = 0
    let allProducts = getLS("allProducts");
    let cartItems = getLS("cart");
    for(let p of allProducts){  
        for(let c of cartItems){
            if(c.id == p.id){
                cartTotal += c.qty * p.price.newPrice
                
            }
        }
        
    }
    
    
    total.innerHTML = cartTotal ? ` <strong>Total price: $${cartTotal}</strong>` : ``
} 

function removeFromCart(){
    let idP = $(this).data("id");

    let cartItems = getLS("cart");
    let filtered = [];
    for(let p of cartItems){
        if(p.id != idP){
            filtered.push(p);
        }
    }

    if(filtered.length == 0){
        localStorage.removeItem("cart");
    }
    else{
        saveLS("cart", filtered);
    }
    showData();
}

function removeAllFromCart(){
    localStorage.removeItem("cart");
    showEmptyCart();
}

function showEmptyCart(){
    $("#products-items").html(`<p>Empty cart.</p>`);
    $("#total-price").html("");
    $("#cart-delivery-info").addClass("hide");
    $("#clear-button").addClass("hide");
    $(".naslov-cart-h2").addClass("hide");
}

function addToCart(){
    let idP = $(this).data("id");
        let productsCart = getLS("cart");
        let addedItemText = document.querySelector("#cart-added-item");
        let addedItemP = document.querySelector("#text-item-p");
            
        addedItemText.classList.remove("hide");
        addedItemP.innerHTML = "You have successfully added an item to your cart!";
            
        setInterval(function(){
            addedItemText.classList.add("hide");
            addedItemP.innerHTML="";
        },4000)

        if(productsCart == null){
            addFirstItemToCart();
           
        }
        else{
            if(productIsAlreadyInCart()){
                let addedItemText = document.querySelector("#cart-added-item");
                let addedItemP = document.querySelector("#text-item-p");
                
                addedItemText.classList.remove("hide");
                addedItemP.innerHTML = "The product is already in the cart!";
                
                setInterval(function(){
                    addedItemText.classList.add("hide");
                    addedItemP.innerHTML="";
                },4000)
            }
            else{
                addItemToCart();
               
            }
        }
        function addFirstItemToCart(){
            
            let products = [
                {
                    id: idP,
                    qty: 1
                }
            ];
        
            saveLS("cart", products);
        }

        function productIsAlreadyInCart(){
            
            return productsCart.filter(el => el.id == idP).length;
        }
        
        
    
        function addItemToCart(){
    
            productsCart.push({
                id: idP,
                qty: 1
            });
    
            saveLS("cart", productsCart);
        }
}

function writeDeliveryMessage(){
    let cartItems = getLS("cart");
    let allProducts = getLS("allProducts");
    let filteredProducts;
    let filteredProductsArray = [];
    let modalDeliveryMessage = document.querySelector(".modal-delivery-message")
    
    for(c of cartItems){
        filteredProducts = allProducts.filter(product => product.id == c.id); 
        for(f of filteredProducts){     
            filteredProductsArray.push(f.name);  
        } 
    }

    let filteredProductsText = filteredProductsArray.join(", ");
    modalDeliveryMessage.innerHTML = 'You have successfully ordered: ' + filteredProductsText + " glasses. You will be contacted as soon as possible to pick them up!";
    
}

function formCheckDelivery(){
    let fName, phone, address, card;
    fName = document.querySelector("#fName-del");
    phone = document.querySelector("#phone-del");
    address = document.querySelector("#address-del");
    card = document.querySelector("#card-del");

    let regName = /^[A-Z][a-z]{2,14}\s[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})*$/;
    let regAddress =  /^[A-Za-zČĆŽĐŠčćžđš'\.\-\s\,0-9]{3,}$/;
    let regPhone =  /^[\+][\d]{1,3}[\-][\d]{8,}$/;
    let regCard = /^[\d]{4}(\-[\d]{4}){3}$/;

    regCheckDel(regName, fName, "Full name is not valid. Example: Mihajlo Jovanovic");
    regCheckDel(regAddress, address, "Address is not valid. Example: Mije Kovacevica 7b");
    regCheckDel(regPhone, phone, "Phone is not valid. Example: +381-616956555");
    regCheckDel(regCard, card, "Card number is not valid. Example: 1234-1234-1234-1234");

    let modal = document.querySelector("#myModal");
    let formModal = document.querySelector("#cart-modal");
    let span = document.querySelector(".close-form-delivery");
    if(errors == 0){
        writeDeliveryMessage();
        formModal.classList.add("hide");
        document.querySelector("#form-delivery").reset();
        modal.classList.remove('hide');
        localStorage.removeItem("cart")
        span.addEventListener('click', ()=>{
            modal.classList.add('hide');
        })
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.classList.add('hide');
            }
        }
        
    }
        
}

function formCheck(){
    let name, mail, ddlSubject, terms;
    name = document.querySelector("#name");
    mail = document.querySelector("#mail");
    ddlSubject = document.querySelector("#ddlSubject");
    terms = document.querySelector("#chbAgree");
   
    let regName = /^[A-Z][a-z]{2,14}\s[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})*$/;
    let regMail = /^[a-z][a-z0-9]+(\.)*[a-z0-9]+((\.)*[a-z0-9]+){0,2}\@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;

    regCheck(regMail, mail, "Mail is not valid. Example: mihajlo@gmail.com");
    regCheck(regName, name, "Full name is not valid. Example: Mihajlo Jovanovic");
    

    let subjectVal = ddlSubject.options[ddlSubject.selectedIndex].value;

    if(subjectVal == "0"){
        ddlSubject.nextElementSibling.classList.remove('hide');
        ddlSubject.nextElementSibling.innerHTML = "Select a subject.";
        ddlSubject.classList.add('red-border');
        errors++;
        }
    else{
        ddlSubject.nextElementSibling.classList.add('hide');
        ddlSubject.nextElementSibling.innerHTML = "";
        ddlSubject.classList.remove('red-border');
    }

    let termsVal = "";
    if(terms.checked){
        termsVal += terms.value
    }
    chbCheck(termsVal, terms, "You must agree with the terms and conditions.");
    console.log(errors);

    
        let modal = document.querySelector("#myModal-contact");
        let span = document.querySelector(".close-contact-form");
    if(errors == 0){
        modal.classList.remove('hide');
        name.value = "";
        mail.value = "";
        ddlSubject.value = "0";
        terms.checked = false;
        span.addEventListener('click', ()=>{
            modal.classList.add('hide');
        })
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.classList.add('hide');
            }
        }
        
    }
    console.log(this.parentElement.parentElement);
}

function regCheckDel(reg, obj, msg){
    if(!reg.test(obj.value)){
        obj.nextElementSibling.nextElementSibling.classList.remove('hide');
        obj.nextElementSibling.nextElementSibling.classList.add('p-danger');
        obj.nextElementSibling.nextElementSibling.innerHTML = msg;
        obj.classList.add('red-border-del');
        errors++;
        }
        else{
        obj.nextElementSibling.nextElementSibling.classList.remove('p-danger');
        obj.nextElementSibling.nextElementSibling.innerHTML = "";
        obj.classList.remove('red-border-del');
        errors = 0;
    }     
}

function regCheck(reg, obj, msg){
    if(!reg.test(obj.value)){
        obj.nextElementSibling.classList.remove('hide');
        obj.nextElementSibling.innerHTML = msg;
        obj.classList.add('red-border');
        errors++;
        }
        else{
        obj.nextElementSibling.classList.add("hide");
        obj.nextElementSibling.innerHTML = "";
        obj.classList.remove('red-border');
        errors = 0
    }    
   
}

function chbCheck(chbVal, obj, msg){
    if(chbVal == ""){
    obj.nextElementSibling.nextElementSibling.classList.remove('hide');
    obj.nextElementSibling.nextElementSibling.innerHTML = msg;
    errors++;
    }
    else{
    obj.nextElementSibling.nextElementSibling.classList.add('hide');
    obj.nextElementSibling.nextElementSibling.innerHTML = "";
    }
}

function change(){
    let products = getLS("allProducts");
    productPrint(products);
}

function sorting(data){
    const sortType = document.querySelector("#price-sort").value;
    switch(sortType){
       

        case "pricedesc":
            return data.sort((a, b) => a.price.newPrice < b.price.newPrice ? 1 : -1)

        case "priceasc":
            return data.sort((a, b) => a.price.newPrice > b.price.newPrice ? 1 : -1)
  
        case "namedesc":
            return data.sort((a, b) => a.name < b.name ? 1 : -1)

        case "nameasc": 
            return data.sort((a, b) => a.name > b.name ? 1 : -1)
        
        case "popasc":
            return data.sort((a, b) => a.popularity > b.popularity ? 1 : -1)

        case "popdesc":
            return data.sort((a, b) => a.popularity < b.popularity ? 1 : -1)
        default: 
            return data
    }
}

function brandFilter(products){
    let brandIds = [];
    let chosenBrands = document.querySelectorAll('input[name="brand"]:checked');
    
    chosenBrands.forEach(brand => {
        brandIds.push(Number(brand.value))
    })

    if(brandIds.length){
        return Object.values(products).filter(product => brandIds.includes(product.brandId))
    }
    

    return products;
}

function modelsFilter(products){
    let modelIds = [];
    let chosenModels = document.querySelectorAll('input[name="model"]:checked');

    chosenModels.forEach(model => {
        modelIds.push(Number(model.value))
    })

    if(modelIds.length){
        return Object.values(products).filter(product => modelIds.includes(product.modelId))
    }

    return products; 
}

function saveLS(name, value){
    localStorage.setItem(name, JSON.stringify(value));
}
function getLS(name){
    return JSON.parse(localStorage.getItem(name));
}

function countDown(){
    let countDownDate = new Date("Jun 22, 2023 15:23:30").getTime();
    
    let now = new Date().getTime();
    
    let distance = countDownDate - now;
    if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("simply-countdown-custom").innerHTML = "EXPIRED";
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelector("#days").innerHTML = days;
    document.querySelector("#hours").innerHTML 
    = hours;
    document.querySelector("#minutes").innerHTML = minutes;
    document.querySelector("#seconds").innerHTML = seconds;

    
    setTimeout(countDown, 1000);
}

function navPrint(links){
    let html = `<ul class="navbar-nav nav-mega mx-auto">`;

    for(let obj of links){
        html += `<li class="nav-item">
                    <a class="nav-link ml-lg-0" href="${obj.href}">${obj.name}
                        <span class="sr-only">(current)</span>
                    </a>
                </li>`
    }
    html+=`</ul>`;

    document.querySelector(".navigation").innerHTML += html;
}

function brandChbPrint(brandsArray){
    let brandPrint = "";

    brandsArray.forEach(brand => {
        brandPrint += `<li class="list-group-item">
                            <input type="checkbox" value="${brand.id}" class="brand" name="brand"/>
                            ${brand.name}
                        </li>`
    });

    document.querySelector("#brands").innerHTML += brandPrint;

}

function modelsChbPrint(modelsArray){
    let modelsPrint = "";

    modelsArray.forEach(model => {
        modelsPrint += `<li class="list-group-item">
                            <input type="checkbox" value="${model.id}" class="model" name="model"/>
                            ${model.name}
                        </li>`
    });

    document.querySelector("#models").innerHTML += modelsPrint;
 
}

function productPrint(products){
    products = modelsFilter(products);
    products = brandFilter(products);
    products = sorting(products);
    products = searchProducts(products);

    let html = `<div class="row products-row my-lg-3 my-0">
                    <div class="row">
                        <div class="col-md-6 shop_left">
                            <img src="images/banner3.jpg" alt="">
                            <h6>40% off</h6>
                        </div>
                        <div class="col-md-6 shop_right">
                            <img src="images/banner4.jpg" alt="">
                            <h6>50% off</h6>
                        </div>
                
                    </div>`

    if(products.length == 0){
        html += `<div class="row">
                    <div class="col-12">
                        <p class="alert alert-danger">There are no products to show.</p>
                    </div>
                </div>`;
    }
    else{
        for(let objProduct of products){
            html += `<div class="col-md-3 mb-4 product-men women_two shop-gd">
                        <div class="product-googles-info googles d-flex">
                            <div class="men-pro-item">
                                <div class="men-thumb-item">
                                    <img src="${objProduct.image}" class="img-fluid" alt="${objProduct.name}">
                                    <div class="men-cart-pro">
                                        <div class="inner-men-cart-pro">
                                            <button class="link-product-add-cart more-info-btn">More info</button>
                                        </div>
                                    </div>
                                    ${flairPrint(objProduct.flairId, "allFlairs")}
                                </div>
                                <div class="item-info-product">
                                    <div class="info-product-price">
                                        <div class="grid_meta">
                                            <div class="product_price">
                                                <h4>
                                                    ${objProduct.name}
                                                </h4>
                                                <div class="grid-price mt-2">
                                                    <span class="money ">${pricePrint(objProduct.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    
                                    
                                </div>
                                <div class="googles single-item hvr-outline-out justify-content-end">
										
									<a href="#" class="googles-cart pgoogles-cart">
										
                                        <button class="button btn btn-cart" data-id="${objProduct.id}"><i class="fas fa-cart-plus"></i></button>
									</a>
										
								</div>
                                
                            </div>
                            <div class="more-info hide">
                                <div class="more-info-title d-flex align-items-center">
                                    <span class="more-info-title">${objProduct.name}</span>
                                    <i class="fa-solid fa-circle-xmark close"></i>
                                </div>
                                
                                <ul>
                                    ${specPrint(objProduct.specifications)}
                                </ul>

                            </div>
                        </div>
                    </div>`
        }
        
    }

    html += `</div>`;
    document.querySelector(".wrapper_top_shop").innerHTML = html;
    $(".btn-cart").click(addToCart);
}

function randomProductsPrint(products){
    let selectedProducts = [];
    while(selectedProducts.length < 4){
        let randomIndex =  Math.floor(Math.random() * products.length);
        let randomProduct = products[randomIndex];

        if(!selectedProducts.includes(randomProduct)){
            selectedProducts.push(randomProduct);
        }
    }
    
    let html = `<div class="row products-row my-lg-3 my-0">`
    for(let product of selectedProducts){
        html += `<div class="col-md-3 mb-4 product-men women_two shop-gd single-product">
                        <div class="product-googles-info googles d-flex">
                            <div class="men-pro-item">
                                <div class="men-thumb-item">
                                    <img src="${product.image}" class="img-fluid" alt="${product.name}">
                                    <div class="men-cart-pro">
                                        <div class="inner-men-cart-pro">
                                            <a href="shop.html" class="link-product-add-cart more-info-btn">More info</a>
                                        </div>
                                    </div>
                                    ${flairPrint(product.flairId, "allFlairs")}
                                </div>
                                <div class="item-info-product">
                                    <div class="info-product-price">
                                        <div class="grid_meta">
                                            <div class="product_price">
                                                <h4>
                                                    ${product.name}
                                                </h4>
                                                <div class="grid-price mt-2">
                                                    <span class="money ">${pricePrint(product.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    
                                    
                                </div>
                                <div class="googles single-item hvr-outline-out justify-content-end">
										
                                <a href="#" class="googles-cart pgoogles-cart">
                                    
                                    <button class="button btn btn-cart" data-id="${product.id}"><i class="fas fa-cart-plus"></i></button>
                                </a>
                                    
                            </div>
                                
                            </div>
                            
                        </div>
                    </div>`
    }
    html+=`</div>`
    
    document.querySelector(".random-deals").innerHTML += html;   
    $(".btn-cart").click(addToCart);                     
}

function flairPrint(id, nameLS){
    let arrayLS = getLS(nameLS);
    let html = ``;
    let flair = null;

    for(let obj of arrayLS){
        if(obj.id == id){
            flair = obj;
        }
    }
    html += `<span class="product-new-top ${flair.class}">${flair.name}</span>`
    return html;

}

function pricePrint(objPrice){
    let html = ``;

    if(objPrice.oldPrice != null){
        html += `<del class="me-3">$${objPrice.oldPrice}</del>`;
    }

    html += `<strong>$${objPrice.newPrice}</strong>`;

    return html;
}

function specPrint(array){
    let html = "";

    for(let obj of array){
        if(obj.name == "Frame size"){
            html += `<li>
                        <ul>
                            ${specExtended(obj.value)}
                        </ul>                
                    </li>`
        }
        else{
            html += `<li>
                        <strong>${obj.name}: </strong>${obj.value}
                    </li>`
        }
       
    }
    
    return html;
}

function searchProducts(products){
    let searchProductsValue = document.querySelector("#search").value.toLowerCase();
    
    if(searchProductsValue){
        return products.filter(product => {
            return product.name.toLowerCase().indexOf(searchProductsValue) !== -1
        })
    }
    return products;

}

function specExtended(array){
    let html = "";

    for(let obj of array){
        html += `<li><strong>${obj.name}: </strong>${obj.size}</li>`
    }
    return html;
}
//#endregion

