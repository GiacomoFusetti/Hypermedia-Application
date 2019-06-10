console.log("Loading book_by_genre page");
new WOW().init();

let genreJson;

$(document).ready(function(){
	getGenre();
});
				  
// -------------- REQUESTS ---------------

function getGenre(){
	
	fetch('/genres').then(function(response) {
		return response.json();
	}).then(function(json) {
		genreJson = json;
		if(!jQuery.isEmptyObject(genreJson)){
			generatesGenreHTML();
		}else{
			// TODO
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesGenreHTML(){
    
    for(x = 0; x < genreJson.length; x++){
        var genre = genreJson[x];    
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