console.log('Loading cart page');

let cartBooksJson;

$(document).ready(function(){
	$('#cartBody').bind('keyup mouseup', function () {
           
		var qty = $(this);
		console.log(qty);
	})
	
	getCart();
});

// -------------- REQUESTS ---------------

function getCart(){
    fetch('/cart/', {
        method: "GET",
        credentials: 'include'
    }).then(function(response) {
         return response.json();
     }).then(function(json) {
        console.log(json);
		cartBooksJson = json;
		
		if(!jQuery.isEmptyObject(cartBooksJson)){
			generateCartHTML();
			generateCartFooterHTML();
		}else{
			//TODO
		}
        
     });
}

// -------------- GENERATES HTML ---------------

function generateCartHTML(){
	var cartHTML = ``;
	
	for(var x = 0; x < cartBooksJson.length; x++){
		var book = cartBooksJson[x];
		var authorHTML = ``;
		
		for(z = 0; z < book.auth_ids.length; z++)
			authorHTML +=
				(z > 0 ? `<a class="authors-font">- </a>` :  ``) +
				`	
					<a class="authors-font" href="author.html?id=${book.auth_ids[z]}" class="color-text-a">${book.auth_names[z]}</a>
				`
				;
		
		cartHTML += `<div class="row">
                        <div class="col-12 col-sm-12 col-md-2 text-center">
                                <a href="book.html?id=${book.id_book}"><img class="img-responsive" src="${book.cover_img}" alt="${book.title}" width="80" height="120"></a>
                        </div>
                        <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                            <h5 class="product-name"><strong><a class="title-pointer" href="book.html?id=${book.id_book}">${book.title}</a></strong></h5>
							<h5>
                                <small>${authorHTML}</small>
                            </h5>
                            <h5>
                                <small>Support: ${book.support}</small>
                            </h5>
                        </div>
                        <div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                            <div class="col-6 col-sm-6 col-md-6 text-md-right" style="padding-top: 10px">
                                <h6><strong>€ ${book.price} <span class="text-muted">x</span></strong></h6>
                            </div>
                            <div class="col-4 col-sm-4 col-md-4 pad">
                                <div class="quantity">
                                    <input id="${book.id_book}" type="number" step="1" max="99" min="1" value="${parseInt(book.quantity, 10)}" title="Qty" class="qty" size="4">
                                </div>
                            </div>
                            <div class="col-2 col-sm-2 col-md-2 text-right">
                                <button type="button" class="btn btn-outline-danger btn-xs">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr>`;
	}
	
	$('#cartBody').append(cartHTML);
}

function generateCartFooterHTML(){
	var cartFooterHTML = ``;
	
	var total = 0;
	for(var x = 0; x < cartBooksJson.length; x++){
		var book = cartBooksJson[x];
		total += parseFloat(book.price, 10) * parseInt(book.quantity, 10);
		
	}
	$('#totalPriceDiv').html(`Total price: <b>€ ` + total + `</b>`);
}

// -------------- AUXILIARY FUNCTIONS ---------------