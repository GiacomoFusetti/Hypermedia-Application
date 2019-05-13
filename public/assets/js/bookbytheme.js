console.log("Loading book_by_genre page");
new WOW().init();

let bookByThemeJson;

$(document).ready(function(){
	getBookByTheme();
});
				  
// -------------- REQUESTS ---------------

function getBookByTheme(){
	
	fetch('/books_by_theme').then(function(response) {
		return response.json();
	}).then(function(json) {
		bookByThemeJson = json;
		if(!jQuery.isEmptyObject(bookByThemeJson)){
			generatesBookByThemeHTML();
		}else{
			// TODO
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesBookByThemeHTML(){

	for(x = 0; x < bookByThemeJson.length; x++){
		var themeHTML = ``;
		var theme = bookByThemeJson[x];
		
		themeHTML += `<div class="property-agent">
								<div class="title-box-d section-t1">
									<h3 class="title-d"><a class="pointer-a" href='books.html?theme=${theme.id_theme}'>${theme.theme_name}</a></h3>
								</div>
							<div class="row">`;
		for(y = 0; y < theme.books.length; y++){
			var book = theme.books[y];
			var authors = theme.books[y].f6
			themeHTML +=`
						<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 book-img-margin">
							<div class="book-img-margin-child wow zoomIn" data-wow-duration="1s">
								<div class="img-box-a">
								  <a href="book.html?id=${book.f1}"><img src="${book.f5}" alt="${book.f2}" class="img-a img-fluid"></a>
								</div>

								<div class="book_desc">
									<ul class="list-unstyled author_list">
										` + authorListHTML(book.f7) + `
									</ul>
									<h6 class="card-titl-a book_title"><a class="font-70" href="book.html?id=${book.f1}">${book.f2}</a></h6>
									<div>
										<p>
												<b class="font-70 color-b">€ 
												`+ priceHTML(book.f6, book.f3, book.f4) +
												`																		
												</b>
										</p>
									</div>
								</div>
							</div>
						</div>
						`;
		}
		themeHTML += `</div></div>`;
		$('#bodyDiv').append(themeHTML);		
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
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-70"> & </a>` :  ``) + `<a class="font-70" href="author.html?id=${authorsJson[z].f1}">${authorsJson[z].f2}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}