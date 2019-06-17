console.log('Loading cart page');

let cartBooksJson;
let currentBook = {};
let checkOutBooks = [];
let deleteBook = [];
let newQty;
let total = 0;
let discount = 0;

$(document).ready(function(){
	// HANDLE QUANTITY INPUT
	$('#cartBody').on('input', 'input[type=number]', function () {  
		var idx = $(this).attr('id');
		newQty = parseInt($(this).val());
		
		if(newQty >= 1 && typeof newQty == 'number' && newQty <= 99){
			
			currentBook['Id_book'] = parseInt(cartBooksJson[idx].id_book);
			currentBook['quantity'] = parseInt(newQty);
			currentBook['support'] = cartBooksJson[idx].support.toLowerCase();
			currentBook['title'] = cartBooksJson[idx].title;
			
			cartBooksJson[idx].quantity = newQty;
			$(this).val(newQty);
			updateCartQty();
		}
	});
	$('#cartBody').on('blur', 'input[type=number]', function () {
		var idx = $(this).attr('id');
		newQty = parseInt($(this).val());
		
		if(newQty < 1 || typeof newQty !== 'number' || Number.isNaN(newQty)) newQty = 1;
		else if(newQty > 99) newQty = 99;
		
		currentBook['Id_book'] = parseInt(cartBooksJson[idx].id_book);
		currentBook['quantity'] = parseInt(newQty);
		currentBook['support'] = cartBooksJson[idx].support.toLowerCase();
		currentBook['title'] = cartBooksJson[idx].title;

		cartBooksJson[idx].quantity = newQty;
		$(this).val(newQty);
		updateCartQty();
	});
	// HANDLE DELETE BUTTON
	$('#cartBody').on('click', 'button', function () {
		var idx = $(this).attr('id');
		Swal.fire({
			title: 'Remove?',
			html: 'Remove <b>' + cartBooksJson[idx].title + '</b>',
			type: 'warning',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Do it!',
			showCancelButton: true,
		  	cancelButtonColor: '#d33'
		}).then((result) => {
		  if (result.value) {
			Swal.fire(
			  'Deleted!',
			  'The book has been removed.',
			  'success'
			)
			var elem = {};
			elem['Id_book'] = parseInt(cartBooksJson[idx].id_book);
			elem['support'] = cartBooksJson[idx].support.toLowerCase();
			elem['title'] = cartBooksJson[idx].title;
			deleteBook = [];
			deleteBook.push(elem);

			delete cartBooksJson[idx];
			$('#entryCart' + idx).remove();
			$('#hr' + idx).remove();
			deleteBookCart(deleteBook);
		  }
		});
	});
	// HANDLE CHECKOUT
	$(document).on('click', '#checkOutBtn', function (){
		if(!jQuery.isEmptyObject(cartBooksJson)){
			checkOutBooks = []
			
			for(var x = 0; x < cartBooksJson.length; x++){
				var elem = {};
				if(cartBooksJson[x]){
					elem['Id_book'] =  parseInt(cartBooksJson[x].id_book);
					elem['support'] = cartBooksJson[x].support;
					elem['title'] = cartBooksJson[x].title;
					checkOutBooks.push(elem);
				}
			}
			
			Swal.fire({
				title: 'Confirmed purchase!',
                html: 'Total amount: € <b>' + (total-discount).toFixed(2) + '</b>',
                type: 'success',
                confirmButtonColor:'#00983d',
                confirmButtonText: 'Great!'
			})
			cartBooksJson = {};
			discount = 0;
			deleteBookCart(checkOutBooks);
			$("#cartBody").html( 
				'<div class="col-12"><h3 class="title-single">The cart is empty. Go <a href="../pages/books.html"><u>shopping</u></a>!</h3></div>'
			);
			$('#couponInp').val('');
		}
	});
	// HANDLE COUPON BUTTON
	$(document).on('click', '#couponBtn', function(){
		var couponCode = $('#couponInp').val().toLowerCase();
		switch(couponCode){
			case 'gift10':
				discount = 10.0;
				break;
			case 'gift20':
				discount = 20.0;
				break;
			case 'gift30':
				discount = 30.0;
				break;
			case 'gift50':
				discount = 50.0;
				break;
			default:
				discount = 0.0;
		}
		var toastType = 'success'
		var toastTitle = 'Valid Promo Code';
		
		if(discount > total){
			toastType = 'warning'
			toastTitle = 'The total must be greater than the discount!';
		}else if(!discount){
			toastType = 'error'
			toastTitle = 'Invalid code!';
		}
		Toast.fire({
		  type: toastType,
		  title: toastTitle,
		})
		updateTotal();
	});
	
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
		
        cartBooksJson = json;		
		if(!jQuery.isEmptyObject(cartBooksJson)){
			generateCartHTML();
			generateCartFooterHTML();
		}else{
			$("#cartBody").html( 
				'<div class="col-12"><h3 class="title-single">The cart is empty. Go <a href="../pages/books.html"><u>shopping</u></a>!</h3></div>'
			);
		}
     });
}

function updateCartQty(){
    fetch('/cart/', {
		body: JSON.stringify(currentBook),
        method: "PUT",
        credentials: 'include',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		}
    }).then(function(response) {

		if(response.status === 200){
			generateCartFooterHTML();
			//update cart icon number
			getCartCount();
			updateTotal();
		}
     });
}

function deleteBookCart(bookList){
    fetch('/cart/', {
		body: JSON.stringify(bookList),
        method: "DELETE",
        credentials: 'include',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		}
    }).then(function(response) {
         if(response.status === 200){
			generateCartFooterHTML();
			//update cart icon number
			getCartCount();
			updateTotal();
			getCart();
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
		
		cartHTML += `<div id="entryCart${x}" class="row">
                        <div class="col-12 col-sm-12 col-md-2 text-center">
                                <a href="book.html?id=${book.id_book}"><img class="img-responsive" src="${book.cover_img}" alt="${book.title}" width="80" height="120"></a>
                        </div>
                        <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-5" style="padding-top: 10px;">
                            <h5 class="product-name"><strong><a class="title-pointer" href="book.html?id=${book.id_book}">${book.title}</a></strong></h5>
							<h5>
                                <small>${authorHTML}</small>
                            </h5>
                            <h5>
                                <small>Support: ${book.support}</small>
                            </h5>
                        </div>
                        <div class="col-12 col-sm-12 text-sm-center col-md-5 text-md-right row">
                            <div class="col-5 text-md-right" style="padding-top: 10px">
                                <h6><strong>€ ${parseFloat(book.price).toFixed(2)} <span class="text-muted">x</span></strong></h6>
                            </div>
                            <div class="col-5 pad">
                                <div class="quantity">
                                    <input id="${x}" type="number" step="1" max="99" min="1" value="${parseInt(book.quantity, 10)}" title="Qty" class="qty" size="4">
                                </div>
                            </div>
                            <div class="col-2 text-right">
                                <button id="${x}" type="button" class="btn btn-outline-danger btn-xs">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
					<hr id="hr${x}">
                    `;
	}
	
	$('#cartBody').html(cartHTML);
}

function generateCartFooterHTML(){
	var cartFooterHTML = ``;
	
	total = 0;
	for(var x = 0; x < cartBooksJson.length; x++){
		var book = cartBooksJson[x];
		if(book)
			total += parseFloat(book.price, 10) * parseInt(book.quantity, 10);
	}
	updateTotal();
}

function updateTotal(){
	total > 0 ? $('#totalPriceDiv').html(`Total price: <b>€ ` + total.toFixed(2) + `</b>`) : $('#totalPriceDiv').html(``);
	if(discount > 0 && (total-discount) > 0){
		$('#totalPriceDiv').html(`Subtotal: <b>€ ` + total.toFixed(2) + `</b>`)
		$('#totalPriceDiv').append(`<br>Gift Card: <b>- € ` + (discount).toFixed(2) + `</b>`);
		$('#totalPriceDiv').append(`<br>Total price: <b>€ ` + (total-discount).toFixed(2) + `</b>`);
	}else{
		discount = 0;
	}
}