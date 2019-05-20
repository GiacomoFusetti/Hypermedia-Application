console.log("Loading book_by_genre page");
new WOW().init();

let bookByGenreJson;

$(document).ready(function(){
	getBookByGenre();
});
				  
// -------------- REQUESTS ---------------

function getBookByGenre(){
	
	fetch('/books_by_genre').then(function(response) {
		return response.json();
	}).then(function(json) {
		bookByGenreJson = json;
		if(!jQuery.isEmptyObject(bookByGenreJson)){
			generatesBookByGenreHTML();
		}else{
			// TODO
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesBookByGenreHTML(){
	
	for(x = 0; x < bookByGenreJson.length; x++){
		var genreHTML = ``;
		var genre = bookByGenreJson[x];
		
		genreHTML += `<div class="property-agent">
								<div class="title-box-d section-t1">
									<h3 class="title-d"><a class="pointer-a" href='books.html?genre=${genre.id_genre}'>${genre.name}</a></h3>
								</div>
							<div class="row">`;
		for(y = 0; y < genre.books.length; y++){
			var currentBook = genre.books[y];
			var authors = genre.books[y].f6
			genreHTML +=`
						<div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6"">
							<div class="card wow zoomIn" data-wow-duration="1s">
								<a href="book.html?id=${currentBook.f1}" class="stretched-link"><img class="card-img-top-list" src="${currentBook.f5}" alt="${currentBook.f2}"></a>
								<div class="card-body">
									<ul class="list-unstyled author_list font-90">` + authorListHTML(currentBook.f7) + `</ul>
									<h4 class="font-90"><a href="book.html?id=${currentBook.f1}">${currentBook.f2}</a></h4>
									<b class="font-90 color-b">€ 
											` + priceHTML(currentBook.f6, currentBook.f3, currentBook.f4) + `																		
									</b>
								</div>
							</div>
						</div>
						`;
		}
		genreHTML += `</div></div>`;
		$('#bodyDiv').append(genreHTML);		
	}
	
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

function authorListHTML(authorsJson){
	var authorsHTML = ``;
	
	for(z = 0; z < authorsJson.length; z++)
		authorsHTML += `
						<li>
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-85"> & </a>` :  ``) + `<a class="font-85" href="author.html?id=${authorsJson[z].f1}">${authorsJson[z].f2}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}