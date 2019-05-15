console.log("Loading book page");
let urlParams = new URLSearchParams(window.location.search);

let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

let bookId = urlParams.get('id');
let bookJson;

let relatedBookJson;

let bookPrice;
let bookSupport;
let book = {};

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


$(document).ready(function(){
    $('#pricePaperDiv').on('click', '#paper-button', function(e) {
		$('#ebook-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
		
		bookSupport = 'paper';
		bookPrice = $('#paper-button').attr('value');
	});
	$('#priceEBookDiv').on('click', '#ebook-button', function(e) {
		$('#paper-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
		
		bookSupport = 'eBook';
		bookPrice = $('#ebook-button').attr('value');
	});	
	// ?????????
  	$("#booksby").on("hide.bs.collapse", function(){
		$(".h6").html('<i class="far fa-caret-square-down color-b"></i> Books By');
  	});
  	$("#booksby").on("show.bs.collapse", function(){
		$(".h6").html('<i class="far fa-caret-square-up color-b"></i> Books By');
  	});
	// ADD TO CART ON CLICK
	$('#addCartDiv').on('click', '#addCartBtn', function(e) {
		var currentBook = bookJson.book;
		book['Id_book'] = currentBook.id_book;
		book['title'] = currentBook.title;
		book['cover_img'] = currentBook.cover_img;
		book['price'] = bookPrice;
		book['support'] = bookSupport;
		
		console.log(book);
		postCurrentBook();
	});
	
	//PAGINATION
	$("#pagDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getRealtedBooks();
   	});
	
    getCountRelatedBooks();	
	getBookById();
});

// -------------- REQUESTS ---------------

function getBookById(){
	var query = '?offset=' + offset + '&limit=' + limit;
	
	console.log(bookId + ' ' + query);
	
	fetch('/books/' + bookId + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		bookJson = json;
		console.log(bookJson);
		if(!jQuery.isEmptyObject(bookJson)){
			generatesBookHTML();
		}else{
			// TODO
		}
 	});
}

function getCountRelatedBooks(){
	fetch('/books/' + bookId + '/count').then(function(response) {
		return response.json();
	 }).then(function(json) {
        pageNumber = json.count;
		if(pageNumber){
			$("#pagDiv").empty(); 
			pageNumber = Math.ceil(pageNumber/limit);
			generatesPaginationHTML();
		}
	 });
}

function getRealtedBooks(){
    var query = '?offset=' + offset + '&limit=' + limit;
    
	fetch('/books/' + bookId + query).then(function(response) {
        return response.json();
    }).then(function(json) {
        relatedBookJson = json;
		$("#relatedBookDiv").empty();
        if(!jQuery.isEmptyObject(relatedBookJson)){
            fillBooks(relatedBookJson.similar_books);
        }else{
            $("#relatedBookDiv").append( 
			    '<h3 class="title-single">No Written Books.</h3>'
            );
        }
    });
}

function postCurrentBook(){
	fetch('/cart', {
    	body: JSON.stringify(book),
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
        method: "POST"
    }).then(function(response) {
        response.json().then(function(json) {
			console.log(json);
			
        });
    });
}

// -------------- GENERATES HTML ---------------

function generatesBookHTML(){
	fillHeader(bookJson.book, bookJson.authors);
	fillBodyPage(bookJson.book);
	fillBookDetailsEvent(bookJson.book, bookJson.genre[0], bookJson.themes, bookJson.event);
	fillBooks(bookJson.similar_books);
	
}

function fillHeader(book, author){
	$("#titleH1").html(book.title);
	
	for(x = 0; x < author.length; x++)
		$("#authorsDiv").append(
			(x > 0 ? `<a class="authors-font">& </a>` :  ``) +
			`	
				<a class="authors-font" href="author.html?id=${author[x].id_author}" class="color-text-a">${author[x].name}</a>
			`
			);
	
	$("#ratingP").append(ratingHTML(book.rating));
	$("#navigationLi").html(book.title);
}

function fillBodyPage(book){
	$("#coverImg").attr("src", book.cover_img);
	$("#coverImg").attr("alt", book.title);
	
	$("#descP").html(book.description);
	
	switch(book.support){
		case 'both':
			$('#pricePaperDiv').html(`<span id="paper-button" value="${parseFloat(book.price_paper).toFixed(2)}"  class="price-button active">Paper | € ${parseFloat(book.price_paper).toFixed(2)}</span>`);
			$('#priceEBookDiv').html(`<span id="ebook-button" value="${parseFloat(book.price_ebook).toFixed(2)}" class="price-button">eBook | € ${parseFloat(book.price_ebook).toFixed(2)}</span>`);
			$('#addCartDiv').attr("class", `col-xs-12 col-md-12 col-lg-4 price-box`); 
			bookSupport = 'paper';
			bookPrice = parseFloat(book.price_paper).toFixed(2);
			break;
		case 'paper':
			$('#pricePaperDiv').html(`<span id="paper-button" value="${parseFloat(book.price_paper).toFixed(2)}" class="price-button active">Paper | € ${parseFloat(book.price_paper).toFixed(2)}</span>`);
			$('#priceEBookDiv').remove();
			$('#addCartDiv').attr("class", `col-xs-6 col-md-6 col-lg-6 price-box`); 
			bookSupport = book.support;
			bookPrice = parseFloat(book.price_paper).toFixed(2);
			break;
		case 'eBook':
			$('#pricePaperDiv').remove();
			$('#priceEBookDiv').html(`<span id="ebook-button" value="${parseFloat(book.price_ebook).toFixed(2)}" class="price-button active">eBook | € ${parseFloat(book.price_ebook).toFixed(2)}</span>`);
			$('#addCartDiv').attr("class", `col-xs-6 col-md-6 col-lg-6 price-box`); 
			bookSupport = book.support;
			bookPrice = parseFloat(book.price_ebook).toFixed(2);
			break;
	}
}

function fillBookDetailsEvent(book, genre, themes, event){
	var detailsHTML = ``;
	if(!event[0].id_event){
		$('#detailsColDiv').attr('class', 'col-md-8 offset-md-2 col-lg-6 offset-lg-3 section-t2 foo');
		$('#eventDiv').remove();
	}else{
		$('#detailsColDiv').attr('class', 'col-md-6 foo');
		
		fillEvent(event[0]);
	}
	
	detailsHTML +=
			`
				<li class="d-flex justify-content-between">
					<strong>Book ID:</strong>
					<span>${book.id_book}</span>
				</li>
				<li class="d-flex justify-content-between">
					<strong>Language:</strong>
					<span>${book.language}</span>
				</li>
				<li class="d-flex justify-content-between">
					<strong>Pages:</strong>
					<span>${book.pages}</span>
				</li>
				<li class="d-flex justify-content-between">
					<strong>Support:</strong>
					<span>` + supportHTML(book.support) + `</span>
				</li>
				<li class="d-flex justify-content-between">
					<strong>Genre:</strong>
					<span><a href="books.html?genre=${genre.id_genre}">${genre.name}</a></span>
				</li>
			`;
		detailsHTML += `
						<li class="d-flex justify-content-between">
							<strong>Themes:</strong>
							<span>
					`;
		for(x = 0; x < themes.length; x++)
			detailsHTML += (x > 0 ? `<a class=""> - </a>` :  ``) +
				`
						<a href="books.html?theme=${themes[x].id_theme}">${themes[x].theme_name}</a>
				`;
		
		detailsHTML += `</span>
					</li>
						`;
		$('#detailsListUl').html(detailsHTML);
}

function fillEvent(event){
	$('#eventTitleH2').html(event.name);
	$('#eventLocationSpan').html(event.location);
	$('#eventDateSpan').html(event.date_day + ' ' + month[event.date_month-1] + ' ' + event.date_year);
	$('#eventDescP').html(event.description.substring(0, 150) + '. . .');
	$('#eventLinkA').attr('href', 'event.html?id=' + event.id_event);
}

function generatesPaginationHTML(){
	for(i = 0; i < pageNumber; i++){
		$("#pagDiv").append( 
			`
				<li value="${i}" class="page-item` + (i==0 ? ` active` : ``)  + `">
					<a class="page-link">${i+1}</a>
				</li>
			`
		);
	}
}

function fillBooks(books){
    var relatedDiv = ``;
    for(i = 0; i < books.length; i++){
        var relBook = books[i];
        relatedDiv +=
            `
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 book-img-margin">
                    <div class="book-img-margin-child>
						<div id="book" class="img-box-a">
						  <a href="book.html?id=${relBook.id_book}"><img src="${relBook.cover_img}" alt="${relBook.title}" class="img-a img-fluid"></a>
						</div>

						<div class="book_desc">
							<ul class="list-unstyled author_list">
								` + authorListHTML(relBook.auth_names, relBook.auth_ids) + `
							</ul>
							<h6 class="card-titl-a book_title"><a class="font-70" href="book.html?id=${relBook.id_book}">${relBook.title}</a></h6>
							<div>
								<p>
										<b class="font-70 color-b">€ 
										`+ priceHTML(relBook.support, relBook.price_paper, relBook.price_ebook) +
										`																		
										</b>
								</p>
							</div>
						</div>
					</div>
                </div>
            `;
    }
    $("#relatedBookDiv").append(relatedDiv);
}

// -------------- AUXILIARY FUNCTIONS ---------------

function ratingHTML(rating){
	var star = ``;
	for(x = 0; x < rating; x++)
		star += `<i class="fas fa-star color-b" aria-hidden="true"></i>`;
	for(y = 0; y < 5-rating; y++)
		star += `<i class="far fa-star color-b" aria-hidden="true"></i>`;
	return star;
}

function priceHTML(support, price_paper, price_ebook){
	switch(support){
		case 'eBook':
			return parseFloat(price_ebook).toFixed(2);
		case 'paper':
		case 'both':
			return parseFloat(price_paper).toFixed(2);
		default:
			return 'NaN';
	}
}

function supportHTML(support){
	switch(support){
		case 'both':
			return 'eBook & paper based';
		case 'eBook':
		case 'paper':
		default:
			return support + ' based';
	}
}

function authorListHTML(authorsNameJson, authorsIdsJson){
	var authorsHTML = ``;
	
	for(z = 0; z < authorsNameJson.length; z++)
		authorsHTML += `
						<li>
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-70"> & </a>` :  ``) + `<a class="font-70" href="author.html?id=${authorsIdsJson[z]}">${authorsNameJson[z]}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}
