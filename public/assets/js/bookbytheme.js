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
			var currentBook = theme.books[y];
			var authors = theme.books[y].f6
			themeHTML +=`
						<div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6">
							<div class="card wow zoomIn" data-wow-duration="1s">
								<a href="book.html?id=${currentBook.f1}" class="stretched-link"><img class="card-img-top" src="${currentBook.f5}" alt="${currentBook.f2}"></a>
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
		for(z = 0; z < authorsJson.length; z++)
			authorsHTML += `
						<li>
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-85"> & </a>` :  ``) + `<a class="font-85" href="author.html?id=${authorsJson[z].f1}">${authorsJson[z].f2}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}