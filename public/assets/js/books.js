console.log("Loading books page");

let genreJson;
let themeJson;
let booksJson;

let radioId = 2;

let genreid;
let themeid;
let rating;

let offset = 0;
let limit = 12;

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
	
	getGenres();
	getThemes();
	
	getBooks()
});

// -------------- REQUESTS ---------------

function getGenres(){
	console.log('fetch');
	fetch('/genres').then(function(response) {
		return response.json();
	}).then(function(json) {
		genreJson = json;
		console.log(genreJson);
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
	
	fetch('/books' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		booksJson = json;
		console.log(booksJson);
		if(!jQuery.isEmptyObject(booksJson)){
			generatesBooksHTML();
		}else{
			$("#booksDiv").append( 
				'<h3 class="title-single">No Books available with the current filters selection.</h3>'
			);
		}
 	});
}

// -------------- HTML ---------------

function generatesGenresFilterHTML(){
	var genresGroup = 1;
	
	$("#filtersDiv").append( 
		`
			<i class="fa fa-angle-right color-b"></i> <a>Genre</a>
			<div class="form-check">
				<input name="group${genresGroup}" type="radio" id="radio${++radioId}" checked>
				<label for="radio${radioId}">All</label>
			</div>
		`
	);
	for(i = 0; i < genreJson.length; i++){
		var currentGenre = genreJson[i];
		$("#filtersDiv").append( 
			`
				<div class="form-check">
					<input name="group${genresGroup}" type="radio" id="radio${++radioId} value="${currentGenre.id_genre}">
					<label for="radio${radioId}">${currentGenre.name}</label>
				</div>
			`
		);
	}	
}

function generatesThemesFilterHTML(){
	var themesGroup = 2;
	
	$("#filtersDiv").append( 
		`
			<i class="fa fa-angle-right color-b"></i> <a>Theme</a>
			<div class="form-check">
				<input name="group${themesGroup}" type="radio" id="radio${++radioId}" checked>
				<label for="radio${radioId}">All</label>
			</div>
		`
	);
	for(i = 0; i < themeJson.length; i++){
		var currentTheme = themeJson[i];
		$("#filtersDiv").append( 
			`
				<div class="form-check">
					<input name="group${themesGroup}" type="radio" id="radio${++radioId} value="${currentTheme.id_theme}">
					<label for="radio${radioId}">${currentTheme.theme_name}</label>
				</div>
			`
		);
	}
}

function generatesBooksHTML(){
	$("#booksDiv").empty();
		
	for(i = 0; i < booksJson.length; i++){
		var currentBook = booksJson[i];
		var rating_stars = ratingHTML(currentBook.rating);
		$("#booksDiv").append( 
			`
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
					<div class="">
						<div class="img-box-a">
						  <a href="book.html?id=${currentBook.id_book}"><img src="${currentBook.cover_img}" alt="${currentBook.title}" class="img-a img-fluid"></a>
						</div>

					</div>
					<div class="book_desc">
						<h5 class="card-titl-a book_author"><a href="author.html?id=${currentBook.id_author}">${currentBook.name}</a></h5> 
						<h6 class="card-titl-a book_title"><a href="book.html?id=${currentBook.id_book}"><i>${currentBook.title}</i></a></h6>
						<div class="book_rating">
							<p>
								<span class="rating_text">Rating</span>
			`+ rating_stars +
			`
								<br><span class="price_text">price</span> <strong class="color-b">€ 12.90</strong>
							</p>
						</div>
					</div>
				</div>
			`
		);
	}
}

function ratingHTML(rating){
	var star = ``;
	for(x = 0; x < rating; x++){
		star += `<i class="fas fa-star color-b" aria-hidden="true"></i>`;
	}
	for(y = 0; y < 5-rating; y++){
		star += `<i class="far fa-star color-b" aria-hidden="true"></i>`
	}
	return star;
}