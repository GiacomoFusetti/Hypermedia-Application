console.log("Loading authors page");

let authorsJson;

$(document).ready(function(){
	getAuthors();
});

function getAuthors(){
	fetch('/authors').then(function(response) {
			 return response.json();
	 }).then(function(json) {
		authorsJson = json;
        console.log("AuthorJson: " + authorsJson);
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
                        <div class="bottom_center"><a href="author.html" class="color_white">${authorsJson[i].name}</a></div>
                    </div>
                </div>
			`
		);
	}
}
