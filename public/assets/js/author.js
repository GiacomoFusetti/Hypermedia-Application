console.log("Loading author page ");
let urlParams = new URLSearchParams(window.location.search);
let id_author = urlParams.get('id');
let authorJson;
let authorBookJson;


let offset = 0;
let limit = 6;

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
    console.log("before getAuthorById()");
    getCountWrittenBooks();
	getAuthorsById();
    getWrittenBooks();
});

function getAuthorsById(){
    var query = '/' + id_author;
    console.log(query);
    
	fetch('/authors' + query).then(function(response) {
        console.log(response.json);
			 return response.json();
	 }).then(function(json) {
		authorJson = json;
        console.log(authorJson);
		if(!jQuery.isEmptyObject(authorJson)){
			generatesAuthorHTML();
		}else{
			$("#authorDiv").append( 
				'<h3 class="title-single">No Author not found.</h3>'
			);
		}
	 });
}

function getWrittenBooks(){
    var queryId = id_author;
    console.log(id_author);
    var query = '?offset=' + offset + '&limit=' + limit;
    
    fetch('/authors/' + queryId + '/written_books' + query).then(function(response) {
        console.log(response.json);
			 return response.json();
	 }).then(function(json) {
		authorBookJson = json;
        console.log(authorBookJson);
		if(!jQuery.isEmptyObject(authorBookJson)){
            console.log("hey");
			//generatesAuthorBookHTML();
		}else{
			$("#writtenDiv").append( 
				'<h3 class="title-single">No Written Books.</h3>'
			);
		}
	 });
}

function getCountWrittenBooks(){
    var query = id_author;
    console.log(id_author);
    fetch('/authors/' + query + '/count_books').then(function(response) {
        console.log(response.json);
			 return response.json();
	 }).then(function(json) {
		authorBookJson = json;
        console.log(authorBookJson);
		if(!jQuery.isEmptyObject(authorBookJson)){
            console.log("hey");
			//generatesAuthorBookHTML();
		}else{
			$("#writtenDiv").append( 
				'<h3 class="title-single">No Written Books.</h3>'
			);
		}
	 });
}

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

function generatesAuthorHTML(){
    authorJson = authorJson[0];
    $("#IntroAuthor").append( 
			`
                <div class="col-md-12 col-lg-8">
                  <div class="title-single-box">
                    <h1 class="title-single">${authorJson.name}</h1>
                  </div>
                </div>
                <div class="col-md-12 col-lg-4">
                  <nav aria-label="breadcrumb" class="breadcrumb-box d-flex justify-content-lg-end">
                    <ol class="breadcrumb">
                      <li class="breadcrumb-item">
                        <a href="../index.html">Home</a>
                      </li>
                      <li class="breadcrumb-item">
                        <a href="authors.html">Authors</a>
                      </li>
                      <li class="breadcrumb-item active" aria-current="page">
                        ${authorJson.name}
                      </li>
                    </ol>
                  </nav>
                </div>
              
            `
    );
    $("#authorSingle").append(
        `
            <div class="col-sm-12">
              <div class="row">
                <div class="col-md-6">
                  <div class="agent-avatar-box">
                    <img src="${authorJson.photo}" alt="" class="agent-avatar img-fluid">
                  </div>
                </div>
                <div class="col-md-5 section-md-t3">
                  <div class="agent-info-box">
                    <div class="agent-title">
                      <div class="title-box-d">
                        <h3 class="title-d">Biography</h3>
                      </div>
                    </div>
                    <div class="agent-content mb-3">
                      <p class="content-d color-text-a">
                        ${authorJson.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `
    );
}

function generatesAuthorBookHTML(){
    var writtenDiv = ``;
    for(i = 0; i < authorBookJson.length; i++){
        var authorBook = authorBookJson[i];
        writtenDiv +=
            `
                <div class="book_carousel">
					<div class="card-box-a">
						<div class="img-box-a">
							<a href="book.html"><img src="${authorBook.cover_img}" alt="" class="img-a img-fluid" width="200" height="100"></a>
						</div>
					</div>
					<div class="book_desc">
						<h5 class="card-titl-a book_author"><a href="author.html?id=${authorBook.id_author}">${authorBook.name}</a></h5>
						<h6 class="card-titl-a book_title"><a href="${authorBook.id_book}"><i>${authorBook.title}</i></a></h6>
						<div class="book_rating">
							<p> 
                                `
                                + ratingHTML(authorBook.rating) +
                                
				                `
                            </p>
						</div>
					</div>
				</div>
            `;
    }
    $("#books-carousel").append(writtenDiv);
    console.log(writtenBook);
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