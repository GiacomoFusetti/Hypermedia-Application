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
        var genre = bookByGenreJson[x];    
        $('#bodyDiv').append( 
                `<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                    <div class="tab-content">
                        <div class="tab-pane active  wow fadeInUp" id="grid" role="tabpanel">
                            <div class="category-books books grid-view">
                                <div class="property-agent">
                                    <div class="title-box-d section-t1">
                                        <h3 class="title-d">
                                            <a class="pointer-a" href='books.html?genre=${genre.id_genre}'>${genre.name}</a>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>`
        );
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

function bestSellerHTML(best_seller){
    if(best_seller=='true')
        return `<img id="over" src="../assets/img/best-seller.png">`;
    return ``;
}