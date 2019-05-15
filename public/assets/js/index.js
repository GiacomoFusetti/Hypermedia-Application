let booksJson;

let offset = 0;
let limit = 4;

$(document).ready(function(){
    getBestBooks();
});

function getBestBooks(){
	var query = '?offset=' + offset + '&limit=' + limit + '&filter=1';
    
    fetch('/books' + query).then(function(response) {
		return response.json();
	}).then(function(json) {
		booksJson = json;
		$("#property-carousel").empty();
		if(!jQuery.isEmptyObject(booksJson)){
			generatesBestBooksHTML();
		}else{
			$("#property-carousel").append( 
				'<h3 class="title-single">No Books suggested.</h3>'
			);
		}
 	});
}

function generatesBestBooksHTML(){

    fillBookCarousel(booksJson);
}

function fillBookCarousel(books){
    
    var booksCarousel = ``;
    for(i = 0; i < books.length; i++){
        console.log(books[i]);
        var book = books[i];
        booksCarousel += 
                `
                    <div class="carousel-item-b">
                        <div class="card-box-a">
                            <div class="img-box-a">
                                <a href="book.html?id=${book.id_book}"><img src="${book.cover_img}" alt="" class="img-a img-fluid" width="200" height="100"></a>
                            </div>
                        </div>
                        <div class="book_desc">
							<ul class="list-unstyled author_list">
								` + authorListHTML(book.auth_names, book.auth_ids) + `
							</ul>
							<h6 class="card-titl-a book_title"><a class="font-70" href="book.html?id=${book.id_book}">${book.title}</a></h6>
							<div>
								<p>
										<b class="font-70 color-b">€ 
										`+ priceHTML(book.support, book.price_paper, book.price_ebook) +
										`																		
										</b>
								</p>
							</div>
						</div>
                    </div>
                `;
        
    }
    $("#property-carousel").append(booksCarousel);
    carouselProperty();
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
							<h5 class="card-titl-a ` + (z > 0 ? `book_author_li` :  `book_author`) + `"> ` + (z > 0 ? `<a class="font-70"> & </a>` :  ``) + `<a class="font-70" href="author.html?id=${authorsIdsJson[z]}">${authorsNameJson[z]}</a></h5> 
						</li>
					   `;
	return authorsHTML;	
}

function carouselProperty(){
        /*--/ Property owl /--*/
	$('#property-carousel').owlCarousel({
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