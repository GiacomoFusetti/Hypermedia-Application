console.log("Loading books page");
new WOW().init();

let urlParams = new URLSearchParams(window.location.search);

let pageNumber;

let genreJson;
let themeJson;
let booksJson;

let radioId = 2;
let mainGroup = 'group0';
let genresGroup = 'group1'; //radiogroup for genres
let themesGroup = 'group2'; //radiogroup for themes
let ratingGroup = 'group3'; //radiogroup for rating

let mainFilter = urlParams.get('filter');
let genreid = urlParams.get('genre');
let themeid = urlParams.get('theme');
let rating = urlParams.get('rating');

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 12;

$(document).ready(function(){
	//BOOKSBY SIDEBAR animation
  	$("#booksby").on("hide.bs.collapse", function(){
		$("#h6booksby").html('<i class="far fa-caret-square-down color-b"></i> Books By');
  	});
  	$("#booksby").on("show.bs.collapse", function(){
		$("#h6booksby").html('<i class="far fa-caret-square-up color-b"></i> Books By');
  	});
	//FILTERS SIDEBAR animation
	$("#filters").on("hide.bs.collapse", function(){
		$("#h6filters").html('<i class="far fa-caret-square-down color-b"></i> Filters');
  	});
  	$("#filters").on("show.bs.collapse", function(){
		$("#h6filters").html('<i class="far fa-caret-square-up color-b"></i> Filters');
  	});
	//PAGINATION
	$("#paginationDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getBooks();
   	});
	//FILTERS
	$('#allFiltersDiv').on('change', 'input[type=radio]', function() {
		switch(this.name){
			case mainGroup:
				mainFilter = this.value;
				break;
			case genresGroup:
				genreid = this.value;
				break;
			case themesGroup:
				themeid = this.value;
				break;
			case ratingGroup:
				rating = this.value;
				break;
			default:
				return;
		}
		offset = 0;
		getBooksCount();
		getBooks();
	});
	
	getBooksCount();
	getGenres();
	getThemes();
	generatesRatingFilterHTML();
	getBooks();
});

// -------------- REQUESTS ---------------

function getBooksCount(){
	var query = '?offset=' + offset + '&limit=' + limit;
	if(genreid) query += '&genre=' + genreid;
	if(themeid) query += '&theme=' + themeid;
	if(rating) query += '&rating=' + rating;
	if(mainFilter) query += '&filter=' + mainFilter;
	
	console.log(query);
	
	fetch('/books/count' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		pageNumber = json.count;
		if(pageNumber){
			$("#paginationDiv").empty(); 
			pageNumber = Math.ceil(pageNumber/limit);
			generatesPaginationHTML();
		}
 	});
}

function getGenres(){
	fetch('/genres').then(function(response) {
		return response.json();
	}).then(function(json) {
		genreJson = json;
		if(!jQuery.isEmptyObject(genreJson)){
			generatesGenresFilterHTML();
		}
 	});
}

function getThemes(){
	fetch('/themes').then(function(response) {
		return response.json();
	}).then(function(json) {
		themeJson = json;
		if(!jQuery.isEmptyObject(themeJson)){
			generatesThemesFilterHTML();
		}
 	});
}

function getBooks(){
	var query = '?offset=' + offset + '&limit=' + limit;
	if(genreid) query += '&genre=' + genreid;
	if(themeid) query += '&theme=' + themeid;
	if(rating) query += '&rating=' + rating;
	if(mainFilter) query += '&filter=' + mainFilter;
	
	fetch('/books' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		booksJson = json;
		$("#booksDiv").empty();
		if(!jQuery.isEmptyObject(booksJson)){
			generatesBooksHTML();
		}else{
			$("#booksDiv").append( 
				'<h3 class="title-single">No Books available with the current filters selection.</h3>'
			);
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesPaginationHTML(){
	
	for(i = 0; i < pageNumber; i++){
		$("#paginationDiv").append( 
			`
				<li value="${i}" class="page-item` + (i==0 ? ` active` : ``)  + `">
					<a class="page-link">${i+1}</a>
				</li>
			`
		);
	}
}

function generatesGenresFilterHTML(){
	var genresHTML = 
		`
			<div class="filter-div-title" data-toggle="collapse" data-target="#genreDiv"><i class="fa fa-angle-right color-b"></i> <a>Genre</a></div>
			<div id="genreDiv" class="collapse">
				<div class="form-check">
					<input name="${genresGroup}" type="radio" id="radio${++radioId}" value="0" checked>
					<label for="radio${radioId}">All</label>
				</div>
		`;
	for(i = 0; i < genreJson.length; i++){
		var currentGenre = genreJson[i];
		genresHTML += 
			`
				<div class="form-check">
					<input name="${genresGroup}" type="radio" id="radio${++radioId}" value="${currentGenre.id_genre}">
					<label for="radio${radioId}">${currentGenre.name}</label>
				</div>
			`
	}	
	$("#filtersDiv").append( 
		genresHTML +=`</div>`
	);
}

function generatesThemesFilterHTML(){
	var themesHTML = 
		`
			<div class="filter-div-title" data-toggle="collapse" data-target="#themeDiv"><i class="fa fa-angle-right color-b"></i> <a>Theme</a></div>
			<div id="themeDiv" class="collapse">
				<div class="form-check">
					<input name="${themesGroup}" type="radio" id="radio${++radioId}" value="0" checked>
					<label for="radio${radioId}">All</label>
				</div>
		`;
	for(i = 0; i < themeJson.length; i++){
		var currentTheme = themeJson[i];
		themesHTML += 
			`
				<div class="form-check">
					<input name="${themesGroup}" type="radio" id="radio${++radioId}" value="${currentTheme.id_theme}">
					<label for="radio${radioId}">${currentTheme.theme_name}</label>
				</div>
			`
	}
	$("#filtersDiv").append( 
		themesHTML +=`</div>`
	);
}

function generatesRatingFilterHTML(){
	var maxrating = 5;
	var ratingHTML = 
		`
			<div class="filter-div-title" data-toggle="collapse" data-target="#ratingDiv"><i class="fa fa-angle-right color-b"></i> <a>Rating</a></div>
			<div id="ratingDiv" class="collapse">
				<div class="form-check">
					<input name="${ratingGroup}" type="radio" id="radio${++radioId}" value="0" checked>
					<label for="radio${radioId}">All</label>
				</div>
		`;
	for(i = 0; i < maxrating; i++){
		ratingHTML += 
			`
				<div class="form-check">
					<input name="${ratingGroup}" type="radio" id="radio${++radioId}" value="${maxrating-i}">
					<label for="radio${radioId}">
			`;
		for(x = i; x < maxrating; x++){
			ratingHTML += `<i class="fas fa-star color-b" aria-hidden="true"></i>`;
		}
		for(y = maxrating-i; y < maxrating; y++){
			ratingHTML += `<i class="far fa-star color-b" aria-hidden="true"></i>`;
		}
		ratingHTML += `</label></div>`;
		
	}
	$("#filtersDiv").append( 
		ratingHTML +=`</div>`
	);
}

function generatesBooksHTML(){		
	for(i = 0; i < booksJson.length; i++){
		var currentBook = booksJson[i];	
		/*$("#booksDiv").append( 
			`
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6 book-img-margin">
					<div class="frame2 book-img-margin-child wow zoomIn" data-wow-duration="1s">
						<div class="frame img-box-a">
						  <a href="book.html?id=${currentBook.id_book}"><span class="helper"></span><img src="${currentBook.cover_img}" alt="${currentBook.title}" class="img-a img-fluid"></a>
						</div>

						<div class="">
							<ul class="list-unstyled author_list">
								` + authorListHTML(currentBook.auth_names, currentBook.auth_ids) + `
							</ul>
							<h6 class="card-titl-a book_title"><a class="font-90" href="book.html?id=${currentBook.id_book}">${currentBook.title}</a></h6>
							<div>
								<p>`
									/*<span class="rating_text">Rating</span>
										`+ ratingHTML(currentBook.rating) 

									<span class="price_text"></span>*/ /*+ `
										<b class="font-90 color-b">€ 
										`+ priceHTML(currentBook.support, currentBook.price_paper, currentBook.price_ebook) +
										`																		
										</b>
								</p>
							</div>
						</div>
					</div>
				</div>
			`
		);*/
		$("#booksDiv").append( 
			`<div class="col-xl-3 col-lg-3 col-md-4 col-6 padding-col">
				<div class="card wow zoomIn" data-wow-duration="1s">
				  	<a href="book.html?id=${currentBook.id_book}" class="stretched-link"><img class="card-img-top" src="${currentBook.cover_img}" alt="${currentBook.title}"></a>
				  	<div class="card-body">
						<ul class="list-unstyled author_list font-90">` + authorListHTML(currentBook.auth_names, currentBook.auth_ids) + `</ul>
						<h4 class="font-90"><a href="book.html?id=${currentBook.id_book}">${currentBook.title}</a></h4>
						<b class="font-90 color-b">€ 
								` + priceHTML(currentBook.support, currentBook.price_paper, currentBook.price_ebook) + `																		
						</b>
				  	</div>
				</div>
			</div>`
		);
	}
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

function authorListHTML(authorsNameJson, authorsIdsJson){
	var authorsHTML = ``;
	
	for(z = 0; z < authorsNameJson.length; z++)
		authorsHTML += `
						<li>
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-90"> & </a>` :  ``) + `<a class="font-90" href="author.html?id=${authorsIdsJson[z]}">${authorsNameJson[z]}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}