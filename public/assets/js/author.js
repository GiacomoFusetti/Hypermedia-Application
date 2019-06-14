console.log("Loading author page ");

let urlParams = new URLSearchParams(window.location.search);
let id_author = urlParams.get('id');

let authorJson;
let authorBookJson;

let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

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
			    '<div class="col-12"> <h3 class="title-single">No Written Books.</h3> </div>'
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
    $("#author_bio").html(author.bio);
}

function fillBooks(book,author){
    var writtenDiv = ``;
    for(i = 0; i < book.length; i++){
        var authorBook = book[i];
        writtenDiv +=`<div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-6">
				<div class="card wow zoomIn" data-wow-duration="1s">
				  	<div class="frame"><a href="book.html?id=${authorBook.id_book}" class="stretched-link"><img class="card-img-top-list" src="${authorBook.cover_img}" alt="${authorBook.title}"></a>
                    ` + bestSellerHTML(authorBook.best_seller) +`
                    </div>
				  	<div class="card-body">
						<ul class="list-unstyled author_list font-90">` + authorListHTML(authorBook.auth_names, authorBook.auth_ids) + `</ul>
						<h4 class="font-90"><a href="book.html?id=${authorBook.id_book}">${authorBook.title}</a></h4>
						<b class="font-90 color-b">€ 
								` + priceHTML(authorBook.support, authorBook.price_paper, authorBook.price_ebook) + `																		
						</b>
				  	</div>
				</div>
			</div>`;
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