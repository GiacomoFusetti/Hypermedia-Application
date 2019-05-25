console.log("Loading events page");

let eventsJson;
let this_month;

let urlParams = new URLSearchParams(window.location.search);
let id_event = urlParams.get('id');

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(document).ready(function(){
    
    getEventById();
});

// -------------- REQUESTS ---------------

function getEventById(){
    
	fetch('/events/' + id_event).then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
        if(!jQuery.isEmptyObject(eventsJson)){
			generatesEventHTML();
		}else{    
			$("#eventsDiv").append( 
				'<h3 class="title-single">No Events available.</h3>'
			);
		}
	 });
}

// -------------- GENERATES HTML ---------------

function generatesEventHTML(){
    fillHead(eventsJson.event,eventsJson.authors,eventsJson.book);
    fillBody(eventsJson.event, eventsJson.book,eventsJson.genre,eventsJson.themes);
    fillBookDetailsEvent(eventsJson.event, eventsJson.authors, eventsJson.book,eventsJson.genre,eventsJson.themes);
}

function bookHTML(book,authorsNameJson, authorsIdsJson){
	var authorsHTML = `<h5 class="color-text-a" href="book.html?id=${book.id_book}">${book.title}</h5>`;
	
	for(z = 0; z < authorsNameJson.length; z++)
		authorsHTML += 
                `
						<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-70"> & </a>` :  ``) + `<a class="font-70" href="author.html?id=${authorsIdsJson[z]}">${authorsNameJson[z]}</a></h5> 
				`;
	return authorsHTML;	
}

// -------------- AUXILIARY FUNCTIONS ---------------

function fillHead(event,author,book){
    $("#event_title").html(event.name);
    $("#event_name").html(event.name);
    $("#book_title").html(`<a href="book.html?id=${book.id_book}">${book.title}</a>`);
    for(x = 0; x < author.length; x++)
    $("#authorsDiv").append(
        (x > 0 ? `<a class="authors-font">& </a>` :  ``) +
        `	
            <a class="authors-font" href="author.html?id=${author[x].id_author}" class="color-text-a">${author[x].name}</a>
        `
        );
}

function fillBody(event,book,genre,theme){
    $("#event_img").attr("src", event.location_img);
    $("#event_date").html(
        `   <strong>Date: </strong>
            <span class="date-b">${event.date_day} ${month[event.date_month-1]} ${event.date_year}</span>`);
    $("#event_when").html(
        `<strong>When: </strong>
                <span class="color-text-a">${event.when}</span>`);
    $("#event_where").html(
        `<strong>Where: </strong>
                <span class="color-text-a">${event.city}</span>`);
    $("#event_description").html(`<p>
                ${event.description}
            </p>`);
    $("#book_body").html(`<a href="book.html?id=${book.id_book}"><img src="${book.cover_img}" alt="img" class="img-fluid"></a>`
                        + bestSellerHTML(book.best_seller));
    
    $("#map").html(`<iframe src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=${event.location}+()&amp;ie=UTF8&amp;iwloc=A&amp;output=embed"
                width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>`);
    
}

function fillBookDetailsEvent(event, author, book, genre, themes){
    
	var detailsHTML = ``;
	
	detailsHTML +=
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
    $('#detailsListUl').html(detailsHTML);
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

function bestSellerHTML(best_seller){
    if(best_seller=='true')
        return `<img id="over" src="../assets/img/best-seller.png">`;
    return ``;
}
