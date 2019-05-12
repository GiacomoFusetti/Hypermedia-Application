console.log("Loading book page");
let urlParams = new URLSearchParams(window.location.search);

let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

let bookId = urlParams.get('id');

let bookJson;


$(document).ready(function(){
    $('#paper-button').click(function(e) {
		$('#ebook-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#ebook-button').click(function(e) {
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
	
	//PRICES BOX
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
	fillHeader(bookJson.book, bookJson.authors)
	fillMainPage(bookJson.book)
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

function fillMainPage(book){
	
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
    
