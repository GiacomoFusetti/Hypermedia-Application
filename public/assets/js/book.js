console.log("Loading book page");
let urlParams = new URLSearchParams(window.location.search);

let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

let bookId = urlParams.get('id');

let bookJson;

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


$(document).ready(function(){
    $('#pricePaperDiv').on('click', '#paper-button', function(e) {
		$('#ebook-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#priceEBookDiv').on('click', '#ebook-button', function(e) {
		$('#paper-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
        
    $('.owl-carousel').owlCarousel({
        margin:10,
        loop:true,
        autoWidth:true,
        items:4
    })
	/*--/ Related books owl /--*/
	$('#books-carousel').owlCarousel({
		loop: true,
		margin: 30,
		responsive: {
			0: {
				items: 1,
			},
			769: {
				items: 2,
			},
			992: {
				items: 3,
			}
		}
	});
	
	// ?????????
  	$("#booksby").on("hide.bs.collapse", function(){
		$(".h6").html('<i class="far fa-caret-square-down color-b"></i> Books By');
  	});
  	$("#booksby").on("show.bs.collapse", function(){
		$(".h6").html('<i class="far fa-caret-square-up color-b"></i> Books By');
  	});
	
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

// -------------- GENERATES HTML ---------------

function generatesBookHTML(){
	fillHeader(bookJson.book, bookJson.authors);
	fillBodyPage(bookJson.book);
	fillBookDetailsEvent(bookJson.book, bookJson.genre[0], bookJson.themes, bookJson.event);
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
			$('#pricePaperDiv').html(`<span id="paper-button" class="price-button active">Paper | € ${parseFloat(book.price_paper).toFixed(2)}</span>`);
			$('#priceEBookDiv').html(`<span id="ebook-button" class="price-button">eBook | € ${parseFloat(book.price_eBook).toFixed(2)}</span>`);
			$('#addCartDiv').attr("class", `col-xs-12 col-md-12 col-lg-4 price-box`); 
			break;
		case 'paper':
			$('#pricePaperDiv').html(`<span id="paper-button" class="price-button active">Paper | € ${parseFloat(book.price_paper).toFixed(2)}</span>`);
			$('#priceEBookDiv').remove();
			$('#addCartDiv').attr("class", `col-xs-6 col-md-6 col-lg-6 price-box`); 
			break;
		case 'eBook':
			$('#pricePaperDiv').remove();
			$('#priceEBookDiv').html(`<span id="ebook-button" class="price-button">eBook | € ${parseFloat(book.price_eBook).toFixed(2)}</span>`);
			$('#addCartDiv').attr("class", `col-xs-6 col-md-6 col-lg-6 price-box`); 
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
	$('#eventDescP').html(event.desciption.substring(0, 150) + '. . .');
	$('#eventLinkA').attr('href', 'event.html?id=' + event.id_event);
	
	
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
    
