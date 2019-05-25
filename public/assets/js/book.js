console.log("Loading book page");
let urlParams = new URLSearchParams(window.location.search);

let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

let bookId = urlParams.get('id');
let bookJson;
let eventsJson;

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
	// ADD TO CART ON CLICK
	$('#addCartDiv').on('click', '#addCartBtn', function(e) {
		var currentBook = bookJson.book;
		book['Id_book'] = parseInt(currentBook.id_book);
		book['title'] = currentBook.title;
		book['cover_img'] = currentBook.cover_img;
		book['price'] = parseFloat(bookPrice);
		book['support'] = bookSupport.toLocaleLowerCase();
		
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
	//PAGINATION EVENTS
	$("#pagDivEvents").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");
		
		fillEvent($(this).val())
   	});
	
    getCountRelatedBooks();	
	getBookById();
});

// -------------- REQUESTS ---------------

function getBookById(){
	var query = '?offset=' + offset + '&limit=' + limit;
		
	fetch('/books/' + bookId + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		bookJson = json;
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
			    '<h3 class="title-single">No Related Books.</h3>'
            );
        }
    });
}

function postCurrentBook(){
	fetch('/cart/', {
		body: JSON.stringify(book),
        method: "POST",
        credentials: 'include',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		}
    }).then(function(response) {
        response.json().then(function(json) {
			var toastType = 'success'
			var toastTitle = 'Book added to cart';

			if(json.status == 401){
				toastType = 'warning'
				toastTitle = 'You must be logged in!';
			}else{
				getCartCount();
			}
			Toast.fire({
				type: toastType,
				title: toastTitle
			})
		});
    });
}

// -------------- GENERATES HTML ---------------

function generatesBookHTML(){
	fillHeader(bookJson.book, bookJson.authors);
	fillBodyPage(bookJson.book);
	fillBookDetailsEvent(bookJson.book, bookJson.genre[0], bookJson.themes, bookJson.event);
	fillBooks(bookJson.similar_books);
	fillReview(bookJson.review);
    fillInterview(bookJson.book);
}

function fillHeader(book, author){
	$("#titleH1").html(book.title);
	
	for(x = 0; x < author.length; x++)
		$("#authorsDiv").append(
			(x > 0 ? `<a>& </a>` :  ``) +
			`	
				<a href="author.html?id=${author[x].id_author}" class="color-text-a">${author[x].name}</a>
			`
			);
	
	$("#ratingP").append(ratingHTML(book.rating));
	$("#navigationLi").html(book.title);
}

function fillBodyPage(book){
	$("#coverImg").attr("src", book.cover_img);
	$("#coverImg").attr("alt", book.title);
	if(book.best_seller=='true'){
        $("#over").attr("src", "../assets/img/best-seller.png");
    }
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

function fillBookDetailsEvent(book, genre, themes, events){
	var detailsHTML = ``;
	if(jQuery.isEmptyObject(events)){
		$('#detailsColDiv').attr('class', 'col-md-8 offset-md-2 col-lg-6 offset-lg-3 section-t2 foo');
		$('#eventDiv').remove();
	}else{
		eventsJson = events;
		$('#detailsColDiv').attr('class', 'col-md-6 foo');
		if(eventsJson.length > 1)
			generatesPaginationHTMLEvents(eventsJson.length)
		fillEvent(0);
	}
	
	detailsHTML += favoriteHTML(book.our_favorite) +
			`
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
        /*if(book.best_seller){
            detailsHTML += `<img src="../assets/img/best-seller.png">`;
        }*/
		$('#detailsListUl').html(detailsHTML);
}

function fillEvent(idx){
	event = eventsJson[idx];
	$('#eventTitleH2').html(event.name);
	$('#eventLocationSpan').html(event.city);
	$('#eventDateSpan').html(event.date_day + ' ' + month[event.date_month-1] + ' ' + event.date_year);
	$('#eventDescP').html(event.description.substring(0, 150) + '. . .');
	$('#eventLinkA').attr('href', 'event.html?id=' + event.id_event);
}

function fillReview(bookRev){
    var bookReview = ``;

    for(y = 0; y < bookRev.length ; y++){
        var rev = bookRev[y];
        
        bookReview += `
                        <div class="font-i rev-align">
                        "${rev.text}"
                        </div>
                        <div class="writer">
                        <strong>${rev.writer}</strong>
                        </div>
                        <br>
                      `;
    }
    
    $("#book_review").append(bookReview);
}

function fillInterview(book){
    var interviewHTML = ``;
    if(book.interview){
        
        interviewHTML += `
                    <div class="title-box-d section-t2">
                         <h3 id="author_interview" class="title-d">Author's interview</h3>
                    </div>
                    <div class="embed-responsive embed-responsive-16by9">
                      <iframe width="560" height="315" src="${book.interview}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                     `;
    }
    $("#author_interview").append(interviewHTML);
}

function generatesPaginationHTMLEvents(eventsCount){
	for(i = 0; i < eventsCount; i++){
		$("#pagDivEvents").append( 
			`
				<li value="${i}" class="page-item` + (i==0 ? ` active` : ``)  + `">
					<a class="page-link">${i+1}</a>
				</li>
			`
		);
	}
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

        relatedDiv +=`
			<div class="col-xl-2 col-lg-2 col-md-3 col-6">
				<div class="card">
				  	<div class="frame">
                    <a href="book.html?id=${relBook.id_book}" class="stretched-link"><img class="card-img-top-list" src="${relBook.cover_img}" alt="${relBook.title}"></a>
                    ` + bestSellerHTML(relBook.best_seller) + `
				  	</div>
                    <div class="card-body">
						<ul class="list-unstyled author_list font-90">` + authorListHTML(relBook.auth_names, relBook.auth_ids) + `</ul>
						<h4 class="font-90"><a href="book.html?id=${relBook.id_book}">${relBook.title}</a></h4>
						<b class="font-90 color-b">€ 
								` + priceHTML(relBook.support, relBook.price_paper, relBook.price_ebook) + `								
						</b>
				  	</div>
				</div>
			</div>`;
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

function favoriteHTML(favorite){
    var our_favoriteHTML = ``;
    
    if(favorite == 'true'){
        
        our_favoriteHTML = `
                        <li class="d-flex justify-content-between">
					       <strong>Favorite:</strong>
					       <span>Yes</span>
		                </li>
                       `;
    }
    return our_favoriteHTML;
}

function bestSellerHTML(best_seller){
    if(best_seller=='true')
        return `<img id="over" src="../assets/img/best-seller.png">`;
    return ``;
}
