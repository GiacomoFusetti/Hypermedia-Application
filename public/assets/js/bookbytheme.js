console.log("Loading book_by_genre page");
new WOW().init();

let themesJson;

$(document).ready(function(){
	getThemes();
});
				  
// -------------- REQUESTS ---------------

function getThemes(){
	
	fetch('/themes').then(function(response) {
		return response.json();
	}).then(function(json) {
		themesJson = json;
		if(!jQuery.isEmptyObject(themesJson)){
			generatesBookByThemeHTML();
		}else{
			// TODO
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesBookByThemeHTML(){

	for(x = 0; x < themesJson.length; x++){
		var theme = themesJson[x];
		$('#bodyDiv').append( 
                `<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
					<div class="category-books books grid-view">
						<div class="title-box-d section-t1">
							<h3 class="title-d">
								<a class="pointer-a link_style" href='books.html?genre=${theme.id_theme}'>${theme.theme_name}</a>
							</h3>
						</div>
					</div>
                </div>`
        );		
	}
	
}