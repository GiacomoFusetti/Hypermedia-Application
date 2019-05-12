console.log("Loading authors page");
let urlParams = new URLSearchParams(window.location.search);

let authorsJson;
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
		getAuthors();
   	});
    
    getCountAuthors();
	getAuthors();
});

function getAuthors(){
    var query = '?offset=' + offset + '&limit=' + limit;
    
	fetch('/authors' + query).then(function(response) {
			 return response.json();
	 }).then(function(json) {
		authorsJson = json;
        $("#authorsDiv").empty();
		if(!jQuery.isEmptyObject(authorsJson)){
			generatesHTML();
		}else{
			$("#authorsDiv").append( 
				'<h3 class="title-single">No Authors available.</h3>'
			);
		}
	 });
}

function generatesHTML(){	
	for(i = 0; i < authorsJson.length; i++){
		$("#authorsDiv").append( 
			`
				<div class="col-md-4">
                    <div class="card-box-a container_img">
                        <a href="author.html?id=${authorsJson[i].id_author}"><img src="${authorsJson[i].photo}" class="img-d img-fluid"></a>
                        <div class="bottom_center"><a href="author.html?id=${authorsJson[i].id_author}" class="color_white">${authorsJson[i].name}</a></div>
                    </div>
                </div>
			`
		);
	}
}

function getCountAuthors(){
    
	var query = '?offset=' + offset + '&limit=' + limit;
    
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