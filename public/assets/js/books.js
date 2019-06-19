console.log("Loading books page");
new WOW().init();

let urlParams = new URLSearchParams(window.location.search);

let pageNumber;
let bookCount;

let genreJson;
let themeJson;
let booksJson;
let input = '';

let radioId = 2;
let mainGroup = 'group0';
let genresGroup = 'group1'; //radiogroup for genres
let themesGroup = 'group2'; //radiogroup for themes
let ratingGroup = 'group3'; //radiogroup for rating
let formatGroup = 'group4'; //radiogroup for book's format

let mainFilter = urlParams.get('filter');
let formatFilter = urlParams.get('format');
let genreid = urlParams.get('genre');
let themeid = urlParams.get('theme');
let rating = urlParams.get('rating');
let search = urlParams.get('search') || '';

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
		Promise.all([getBooks()]).then(() => {
			fillFilterActive();
			scrollOnTop();
		});
   	});
	//FILTERS
	$('#allFiltersDiv').on('change', 'input[type=radio]', function() {
		switch(this.name){
			case mainGroup:
				mainFilter = this.value;
				break;
            case formatGroup:
                formatFilter = this.value;
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
		Promise.all([getBooksCount(), getBooks()]).then(() => {
			fillFilterActive();
		});
	});
	//SEARCH
    $(document).on('input', '#search', function () {  
        search = $('#search').val();
        
        if(search.trim() != '' || search.trim() != input.trim()){
            input = search;
            Promise.all([getBooksCount(), getBooks()]).then(() => {
				fillFilterActive();
			});
        };
	});
	
	// SET FILTERS WHEN APPEAR IN PATHQUERY
	Promise.all([getGenres(), getThemes(), getBooksCount(), getBooks()]).then(() => {
		handleInPathFilters();
		fillFilterActive();
	});

	generatesRatingFilterHTML();
    generatesFormatFilterHTML();
	
});

// -------------- REQUESTS ---------------

function getBooksCount(){
	var query = '?offset=' + offset + '&limit=' + limit;
	if(genreid) query += '&genre=' + genreid;
	if(themeid) query += '&theme=' + themeid;
	if(rating) query += '&rating=' + rating;
	if(mainFilter) query += '&filter=' + mainFilter;
    if(formatFilter) query += '&format=' + formatFilter;
    if(search) query += '&search=' + search;
	
	return fetch('/books/count' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		bookCount = json.count;
		if(bookCount){
			$("#paginationDiv").empty(); 
			pageNumber = Math.ceil(bookCount/limit);
			generatesPaginationHTML();
		}
 	});
}

function getGenres(){
	return fetch('/genres').then(function(response) {
		return response.json();
	}).then(function(json) {
		genreJson = json;
		if(!jQuery.isEmptyObject(genreJson)){
			generatesGenresFilterHTML();
		}
 	});
}

function getThemes(){
	return fetch('/themes').then(function(response) {
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
    if(formatFilter) query += '&format=' + formatFilter;
    if(search) query += '&search=' + search;

	return fetch('/books' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		booksJson = json;
        
		$("#booksDiv").empty();
		if(!jQuery.isEmptyObject(booksJson)){
			generatesBooksHTML();
		}else{
			$("#booksDiv").append( 
				`<div class="col-12">
					<h3 class="title-single">No Books available with the current filters selection.</h3>
				</div>`
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
			<div id="genreHeader" class="filter-div-title" data-toggle="collapse" data-target="#genreDiv"><i class="fa fa-angle-right color-b"></i> <a>Genre</a></div>
			<div id="genreDiv" class="collapse">
				<div class="form-check">
					<input name="${genresGroup}" type="radio" id="radio${genresGroup + 0}" value="0" checked>
					<label for="radio${genresGroup + 0}">All</label>
				</div>
		`;
	for(i = 0; i < genreJson.length; i++){
		var currentGenre = genreJson[i];
		genresHTML += 
			`
				<div class="form-check">
					<input name="${genresGroup}" type="radio" id="radio${genresGroup + (i+1)}" value="${currentGenre.id_genre}">
					<label for="radio${genresGroup + (i+1)}">${currentGenre.name}</label>
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
			<div id="themeHeader" class="filter-div-title" data-toggle="collapse" data-target="#themeDiv"><i class="fa fa-angle-right color-b"></i> <a>Theme</a></div>
			<div id="themeDiv" class="collapse">
				<div class="form-check">
					<input name="${themesGroup}" type="radio" id="radio${themesGroup + 0}" value="0" checked>
					<label for="radio${themesGroup + 0}">All</label>
				</div>
		`;
	for(i = 0; i < themeJson.length; i++){
		var currentTheme = themeJson[i];
		themesHTML += 
			`
				<div class="form-check">
					<input name="${themesGroup}" type="radio" id="radio${themesGroup + (i+1)}" value="${currentTheme.id_theme}">
					<label for="radio${themesGroup + (i+1)}">${currentTheme.theme_name}</label>
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
			<div id="ratingHeader" class="filter-div-title" data-toggle="collapse" data-target="#ratingDiv"><i class="fa fa-angle-right color-b"></i> <a>Rating</a></div>
			<div id="ratingDiv" class="collapse">
				<div class="form-check">
					<input name="${ratingGroup}" type="radio" id="radio${ratingGroup + 0}" value="0" checked>
					<label for="radio${ratingGroup + 0}">All</label>
				</div>
		`;
	for(i = 0; i < maxrating; i++){
		ratingHTML += 
			`
				<div class="form-check">
					<input name="${ratingGroup}" type="radio" id="radio${ratingGroup + (maxrating-i)}" value="${maxrating-i}">
					<label for="radio${ratingGroup + (maxrating-i)}">
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

function generatesFormatFilterHTML(){
    var formatHTML = `
        <div id="formatHeader" class="filter-div-title" data-toggle="collapse" data-target="#formatDiv"><i class="fa fa-angle-right color-b"></i> <a>Format</a></div>
			<div id="formatDiv" class="collapse">
				<div class="form-check">
					<input name="${formatGroup}" type="radio" id="radio${formatGroup + 0}" value="0" checked>
					<label for="radio${formatGroup + 0}">All</label>
				</div>
                <div class="form-check">
					<input name="${formatGroup}" type="radio" id="radio${formatGroup + 1}" value="1">
					<label for="radio${formatGroup + 1}">Paper</label>
				</div>
                <div class="form-check">
					<input name="${formatGroup}" type="radio" id="radio${formatGroup + 2}" value="2">
					<label for="radio${formatGroup + 2}">eBook</label>
				</div>
            </div>
        </div>
    `;
    $("#filtersDiv").append(formatHTML);
}

function generatesBooksHTML(){		
	for(i = 0; i < booksJson.length; i++){
		var currentBook = booksJson[i];
		$("#booksDiv").append( 
			`<div class="col-xl-3 col-lg-3 col-md-4 col-6 padding-col">
				<div class="card">
				  	<div class="frame"><a href="book.html?id=${currentBook.id_book}" class="stretched-link"><img class="card-img-top" src="${currentBook.cover_img}" alt="${currentBook.title}"></a>
                    ` + bestSellerHTML(currentBook.best_seller) + `
                    </div>
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

function fillFilterActive(){
	var result = '';
	
	if(bookCount > 0){
		result += (offset + 1) + ' - ';
		if(limit > (bookCount - offset))
			result += bookCount + ' results';
		else
			result += limit + ' of ' + bookCount + ' results'
	}else
		result = 'no results';
	
	if(genreid && genreid != 0) result += ' - <b>' + genreJson[parseInt(genreid) - 1].name + '</b>';
	if(themeid && themeid != 0) result += ' - <b>' + themeJson[parseInt(themeid) - 1].theme_name + '</b>';
	if(rating && rating != 0) result += ' - <b>' + rating + ' stars</b>';
	if(mainFilter && mainFilter != 0) result += ' - <b>' + ((mainFilter == 1) ? 'BestSeller' : 'OurSuggestion') + '</b>';   
	if(formatFilter && formatFilter != 0) result += ' - <b>' + ((formatFilter == 1) ? 'Paper' : 'eBook') + '</b>';
    if(search) result += ': <i>\'' + search + '\'</i>';
	
	$('#filterActive').html(result);
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

function bestSellerHTML(best_seller){
    
    if(best_seller=='true')
        return `<img id="over" src="../assets/img/best-seller.png">`;
    return ``;
}

function handleInPathFilters(){
	$("#filtersHeader").click();
	if(mainFilter || genreid || themeid || rating || formatFilter || search){

		if(mainFilter){
			$("#radio" + mainGroup + mainFilter).click();
		}if(rating){
			var timer = setInterval(function() {
				 if ($('#ratingHeader')) {
					clearInterval(timer);
					$("#ratingHeader").click();
					$("#radio" + ratingGroup + rating).click();
				 }
			}, 100);
        }if(formatFilter){
			var timer = setInterval(function() {
				 if ($('#formatHeader')) {
					clearInterval(timer);
					$("#formatHeader").click();
					$("#radio" + formatGroup + formatFilter).click();
				 }
			}, 100);
        }if(genreid){
			var timer = setInterval(function() {
				 if ($('#genreHeader')) {
					clearInterval(timer);
					if(window.location.href.split('&').pop() == 'bygenrex') {
						//$("input[name='" + genresGroup + "']").attr('disabled', true);
						$("#genreHeader").hide();
						$('#genreDiv').hide();
						$('#h1Title').append(' by genre: ' + genreJson[parseInt(genreid) - 1].name);
						$('#navList').append(`
							<li class="breadcrumb-item active" aria-current="page">
                				By Genre
              				</li>
						`);
						$('#homeLi').html(`<a href="books.html">Books</a>`);
					}else{
						$("#genreHeader").click();
						$("#radio" + genresGroup + genreid).click();
					}
				 }
			}, 100);
			
		}if(themeid){
			var timer = setInterval(function() {
				 if ($('#themeHeader')) {
					clearInterval(timer);
					if(window.location.href.split('&').pop() == 'bythemex') {
						//$("input[name='" + themesGroup + "']").attr('disabled', true);
						$("#themeHeader").hide();
						$('#themeDiv').hide();
						$('#h1Title').append(' by theme: ' + themeJson[parseInt(themeid) - 1].theme_name);
						$('#navList').append(`
							<li class="breadcrumb-item active" aria-current="page">
                				By Theme
              				</li>
						`);
						$('#homeLi').html(`<a href="books.html">Books</a>`);
					}else{
						$("#themeHeader").click();
						$("#radio" + themesGroup + themeid).click(); 
					}
				 }
			}, 100);
		}
		if(search)
			$('#search').val(search);
	}
}
