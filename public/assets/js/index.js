console.log("Loading Home page");

let booksJson;
let authorsJson;
let eventsJson;

let offset = 0;
let limit = 4;

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(document).ready(function(){
    getBestBooks();
    getEvents();
    getAuthors();
});

// -------------- REQUESTS ---------------

function getBestBooks(){
	var query = '?offset=' + offset + '&limit=' + limit + '&filter=1';
    
    fetch('/books' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		booksJson = json;
		$("#property-carousel").empty();
		if(!jQuery.isEmptyObject(booksJson)){
			fillBooksCarousel(booksJson);
		}else{
			$("#property-carousel").append( 
				'<h3 class="title-single">No Books suggested.</h3>'
			);
		}
 	});
}

function getAuthors(){
    var query = '?offset=' + offset + '&limit=' + limit;
    
	fetch('/authors' + query).then(function(response) {
			 return response.json();
	 }).then(function(json) {
		authorsJson = json;
        $("#authors-carousel").empty();
		if(!jQuery.isEmptyObject(authorsJson)){
			fillAuthorsCarousel(authorsJson);
		}else{
			$("#authors-carousel").append( 
				'<h3 class="title-single">No Authors available.</h3>'
			);
		}
	 });
}

function getEvents(){
    var query = '&offset=' + offset + '&limit=' + limit;
    
	fetch('/events?orderBy=latest' + query).then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
        $("#new-carousel").empty();
        if(!jQuery.isEmptyObject(eventsJson)){
			fillEventsCarousel(eventsJson);
		}else{    
			$("#new-carousel").append( 
				'<h3 class="title-single">No Events available.</h3>'
			);
		}
	 });
}

// -------------- GENERATES HTML ---------------

function fillBooksCarousel(books){
    
    var booksCarousel = ``;
    for(i = 0; i < books.length; i++){
        var book = books[i];
        booksCarousel += 
                `
                    <div class="card carousel-item-b">
                        <div class="frame">
						<a href="pages/book.html?id=${book.id_book}" class="stretched-link"><img class="img-b img-fluid card-img-top" src="${book.cover_img}" alt="${book.title}"></a>
                        ` + bestSellerHTML(book.best_seller) + `
                        </div>
                        <div class="card-body book_desc">
							<ul class="list-unstyled author_list font-90">
								` + authorListHTML(book.auth_names, book.auth_ids) + `
							</ul>
							<h6 class="font-90"><a href="pages/book.html?id=${book.id_book}">${book.title}</a></h6>
								<b class="font-90 color-b">€ 
								`+ priceHTML(book.support, book.price_paper, book.price_ebook) +
								`																		
								</b>
						</div>
                    </div>
                `        
    }
    $("#books-carousel").append(booksCarousel);
    carouselBooks();
}

function fillAuthorsCarousel(authors){
    var authorsCarousel = ``;
    for(w=0;w<authors.length;w++){
        var author = authors[w];
        authorsCarousel += 
            `
                <div class="carousel-item-b">
                    <div class="card-box-a container_img">
                        <a href="pages/author.html?id=${author.id_author}"><img src="${author.photo}" class="img-d img-fluid" alt="${author.name}"></a>
                        <div class="bottom_center"><a href="pages/author.html?id=${author.id_author}" class="color_white">${author.name}</a></div>
                    </div>
                </div>
            `;
    }
    $("#authors-carousel").append(authorsCarousel);
    carouselAuthors();
}

function fillEventsCarousel(events){
    var eventCarousel = ``;
    for(k = 0; k < events.length; k++){
        var event = events[k];
        eventCarousel +=
            `
                 <div class="carousel-item-b">
                    <div class="card-box-b card-shadow container_img">               
                        <a href="pages/event.html?id=${event.id_event}">
							 <img src="${event.img}" alt="${event.name}" class="img-b img-fluid">
							 <div class="card-header-b">
								<div class="card-category-b">
									<a class="category-b"><i class="fas fa-map-marker-alt"></i> ${event.city}</a>
								</div>
								<div class="card-title-b">
								  	<h2 class="title-2">
										<a class="font-80" href="pages/event.html?id=${event.id_event}">${event.name}</a>
								  	</h2>
								</div>
								<div class="card-date">
								  	<span class="date-b">${event.date_day} ${month[event.date_month-1]} ${event.date_year}</span>
								</div>
							</div>
						</a>
                     </div>
                  </div>
            `;
    }
    $("#events-carousel").append(eventCarousel);
    carouselEvents();
}

// -------------- AUXILIARY FUNCTIONS ---------------

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

function authorListHTML(authorsNameJson, authorsIdsJson){
	var authorsHTML = ``;
	
	for(z = 0; z < authorsNameJson.length; z++)
		authorsHTML += `
						<li>
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-70"> & </a>` :  ``) + `<a class="font-70" href="pages/author.html?id=${authorsIdsJson[z]}">${authorsNameJson[z]}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}

// -------------- CAROUSEL FUNCTIONS ---------------

function carouselBooks(){
        /*--/ Property owl /--*/
	$('#books-carousel').owlCarousel({
		loop: true,
		margin: 30,
		responsive: {
			0: {
				items: 2,
			},
			769: {
				items: 3,
			},
			992: {
				items: 4,
			}
		}
	});
}

function carouselAuthors(){
        /*--/ Property owl /--*/
	$('#authors-carousel').owlCarousel({
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
}

function carouselEvents(){
        /*--/ Property owl /--*/
	$('#events-carousel').owlCarousel({
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
}

function bestSellerHTML(best_seller){
    if(best_seller=='true')
        return `<img id="over" src="../assets/img/best-seller.png" alt="best_seller">`;
    return ``;
}
