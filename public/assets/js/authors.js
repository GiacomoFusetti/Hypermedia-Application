console.log("Loading authors page");

let urlParams = new URLSearchParams(window.location.search);

let authorsJson;
let pageNumber;

let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;
let search = urlParams.get('search') || '';

let input = '';

$(document).ready(function(){
    
    //PAGINATION
	$("#pagDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getAuthors();
		scrollOnTop();
   	});
    
    $(document).on('input', '#search', function () {  
        search = $('#search').val();
        
        if(search.trim() != '' || search.trim() != input.trim()){
            input = search;
            getAuthors();
            getCountAuthors();
        };
	});
    
    getCountAuthors();
	getAuthors();
});

// -------------- REQUESTS ---------------

function getAuthors(){
    var query = '?offset=' + offset + '&limit=' + limit + '&search=' + search;
    
	fetch('/authors' + query).then(function(response) {
			 return response.json();
	 }).then(function(json) {
		authorsJson = json;
        console
        $("#authorsDiv").empty();
		if(!jQuery.isEmptyObject(authorsJson)){
			generatesHTML();
		}else{
			$("#authorsDiv").append( 
				'<div class="col-12"><h3 class="title-single">No Authors available.</h3></div>'
			);
		}
	 });
}

function getCountAuthors(){
    
	var query = '?search=' + search;
    
    fetch('/authors/count' + query).then(function(response) {
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

function generatesHTML(){
    
	for(i = 0; i < authorsJson.length; i++){
        $("#authorsDiv").append( 
			`
				<div class="col-6 col-md-4">
                    <div class="card-box-a container_img">
                        <a href="author.html?id=${authorsJson[i].id_author}"><img src="${authorsJson[i].photo}" class="img-d img-fluid"></a>
                        <div class="bottom_center"><a href="author.html?id=${authorsJson[i].id_author}" class="color_white">${authorsJson[i].name}</a></div>
                    </div>
                </div>
			`
		);
	}
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
