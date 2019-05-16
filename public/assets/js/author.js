console.log("Loading author page ");

let urlParams = new URLSearchParams(window.location.search);
let id_author = urlParams.get('id');

let authorJson;
let authorBookJson;

let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

$(function() {    
    $('.owl-carousel').owlCarousel({
        margin:10,
        loop:true,
        autoWidth:true,
        items:4
    });
	/*--/ Related books owl /--*/
	$('#books-carousel').owlCarousel({
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

});

$(document).ready(function(){
    
    //PAGINATION
	$("#pagDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getWrittenBooks();
   	});
    getCountWrittenBooks();
	getAuthorsById();
});

// -------------- REQUESTS ---------------

function getAuthorsById(){    
    var query = '?offset=' + offset + '&limit=' + limit;
    
	fetch('/authors/' + id_author + query).then(function(response) {
		return response.json();
	 }).then(function(json) {
		authorJson = json;
		if(!jQuery.isEmptyObject(authorJson.author)){
			generatesAuthorBookHTML();
            if(!jQuery.isEmptyObject(authorJson.books)){
                fillBooks(authorJson.books, authorJson.author)
            }else{
			    $("#writtenBookDiv").append( 
				    '<h3 class="title-single">No Written Books.</h3>'
                );
            }
		}else{
			$("#author_title").html("Author not found"); 
            $("#writtenBookDiv").html('<h3 class="title-single">No Written Books.</h3>');
		}  
	 });
}

function getWrittenBooks(){
    var query = '?offset=' + offset + '&limit=' + limit;
    
	fetch('/authors/' + id_author + query).then(function(response) {
        return response.json();
    }).then(function(json) {
        writtenBookJson = json;
		$("#writtenBookDiv").empty();
        if(!jQuery.isEmptyObject(writtenBookJson)){
            fillBooks(writtenBookJson.books, writtenBookJson.author)
        }else{
            $("#writtenBookDiv").append( 
			    '<h3 class="title-single">No Written Books.</h3>'
            );
        }
    });
}

function getCountWrittenBooks(){
   
    fetch('/authors/' + id_author + '/count').then(function(response) {
		return response.json();
	 }).then(function(json) {
        pageNumber = json.count;
		if(pageNumber){
			$("#pagDiv").empty(); 
			pageNumber = Math.ceil(pageNumber/limit);
			generatesPaginationHTML();
		}
	 });
}

// -------------- GENERATES HTML ---------------

function generatesPaginationHTML(){
	for(i = 0; i < pageNumber; i++){
		$("#pagDiv").append( 
			`
				<li value="${i}" class="page-item` + (i==0 ? ` active` : ``)  + `">
					<a class="page-link">${i+1}</a>
				</li>
			`
		);
	}
}

function generatesAuthorBookHTML(){
    fillHeader(authorJson.author)
    fillBody(authorJson.author)  
}

// -------------- AUXILIARY FUNCTIONS ---------------

function fillHeader(author){
    $("#author_title").html(author.name);
    $("#author_name").html(author.name);
}

function fillBody(author){
    $("#author_photo").attr("src", author.photo);
    $("#author_body_name").html(author.name);
    $("#author_bio").html(author.bio);
}

function fillBooks(book,author){
    var writtenDiv = ``;
    for(i = 0; i < book.length; i++){
        var authorBook = book[i];
        writtenDiv +=
            `
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 book-img-margin">
                    <div class="book-img-margin-child>
						<div id="book" class="img-box-a">
						  <a href="book.html?id=${authorBook.id_book}"><img src="${authorBook.cover_img}" alt="${authorBook.title}" class="img-a img-fluid"></a>
						</div>

						<div class="book_desc">
							<ul class="list-unstyled author_list">
								` + authorListHTML(authorBook.auth_names, authorBook.auth_ids) + `
							</ul>
							<h6 class="card-titl-a book_title"><a class="font-70" href="book.html?id=${authorBook.id_book}">${authorBook.title}</a></h6>
							<div>
								<p>
										<b class="font-70 color-b">€ 
										`+ priceHTML(authorBook.support, authorBook.price_paper, authorBook.price_ebook) +
										`																		
										</b>
								</p>
							</div>
						</div>
					</div>
                </div>
            `;
    }
    $("#writtenBookDiv").append(writtenDiv);
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