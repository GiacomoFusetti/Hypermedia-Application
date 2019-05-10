console.log("Loading author page ");

let urlParams = new URLSearchParams(window.location.search);
let id_author = urlParams.get('id');

let authorJson;
let authorBookJson;

let pageNumber;

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
    
    getCountWrittenBooks();

	getAuthorsById();
    getWrittenBooks();
});

function getAuthorsById(){
    var query = '/' + id_author;
    
	fetch('/authors' + query).then(function(response) {
			 return response.json();
	 }).then(function(json) {
		authorJson = json;
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
    
    var query = '?offset=' + offset + '&limit=' + limit;
    
    fetch('/authors/' + queryId + '/written_books' + query).then(function(response) {
			 return response.json();
	 }).then(function(json) {
		authorBookJson = json;
		if(!jQuery.isEmptyObject(authorBookJson)){
			generatesAuthorBookHTML();
		}else{
			$("#writtenDiv").append( 
				'<h3 class="title-single">No Written Books.</h3>'
			);
		}
	 });
}

function getCountWrittenBooks(){
    var query = id_author;
    
    fetch('/authors/' + query + '/count_books').then(function(response) {
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
                <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                    <div class="">
                        <div class="img-box-a">
                          <a href="book.html"><img src="${authorBook.cover_img}" alt="" class="img-a img-fluid"></a>
                        </div>

                    </div>
                    <div class="book_desc">
                        <h5 class="card-titl-a book_author"><a href="author.html?id=${authorBook.id_author}">${authorBook.name}</a></h5> 
                        <h6 class="card-titl-a book_title"><a href="book.html?id=${authorBook.id_book}"><i>${authorBook.title}</i></a></h6>
                        <div class="book_rating">
                            <p>
                                <strong class="color-b">€ 
									`+ priceHTML(authorBook.support, authorBook.price_paper, authorBook.price_eBook) +
									`																		
								</strong>
                            </p>
                        </div>
                    </div>
                </div>
            `;
    }
    $("#writtenBookDiv").append(writtenDiv);
}

function priceHTML(support, price_paper, price_eBook){
	switch(support){
		case 'eBook':
			return parseFloat(price_eBook).toFixed(2);
		case 'paper':
		case 'both':
			return parseFloat(price_paper).toFixed(2);
		default:
			return 'NaN';
	}
}