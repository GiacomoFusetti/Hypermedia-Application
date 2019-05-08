console.log("Loading books page");

let genreJson;
let themeJson;
let radioId = 2;


$(document).ready(function(){
	//BOOKSBY SIDEBAR animation
  	$("#booksby").on("hide.bs.collapse", function(){
		$("#h6booksby").html('<i class="far fa-caret-square-down color-b"></i> Books By');
  	});
  	$("#booksby").on("show.bs.collapse", function(){
		$("#h6booksby").html('<i class="far fa-caret-square-up color-b"></i> Books By');
  	});
	//FILTERS SIDEBAR animation
	$("#filters").on("hide.bs.collapse", function(){
		$("#h6filters").html('<i class="far fa-caret-square-down color-b"></i> Filters');
  	});
  	$("#filters").on("show.bs.collapse", function(){
		$("#h6filters").html('<i class="far fa-caret-square-up color-b"></i> Filters');
  	});
	
	getGenres();
	getThemes();
});

// -------------- REQUESTS ---------------

function getGenres(){
	console.log('fetch');
	fetch('/genres').then(function(response) {
		return response.json();
	}).then(function(json) {
		genreJson = json;
		console.log(genreJson);
		if(!jQuery.isEmptyObject(genreJson)){
			generatesGenresFilterHTML();
		}
 	});
}

function getThemes(){
	fetch('/themes').then(function(response) {
		return response.json();
	}).then(function(json) {
		themeJson = json;
		if(!jQuery.isEmptyObject(themeJson)){
			generatesThemesFilterHTML();
		}
 	});
}

// -------------- HTML ---------------

function generatesGenresFilterHTML(){
	var genresGroup = 1;
	
	$("#filtersDiv").append( 
		`
			<i class="fa fa-angle-right color-b"></i> <a>Genre</a>
			<div class="form-check">
				<input name="group${genresGroup}" type="radio" id="radio${radioId++}" checked>
				<label for="radio1">All</label>
			</div>
		`
	);
	for(i = 0; i < genreJson.length; i++){
		var currentGenre = genreJson[i];
		$("#filtersDiv").append( 
			`
				<div class="form-check">
					<input name="group${genresGroup}" type="radio" id="radio${radioId++} value="${currentGenre.id_genre}">
					<label for="radio${radioId}">${currentGenre.name}</label>
				</div>
			`
		);
	}	
}

function generatesThemesFilterHTML(){
	var themesGroup = 2;
	
	$("#filtersDiv").append( 
		`
			<i class="fa fa-angle-right color-b"></i> <a>Theme</a>
			<div class="form-check">
				<input name="group${themesGroup}" type="radio" id="radio${radioId++}" checked>
				<label for="radio1">All</label>
			</div>
		`
	);
	for(i = 0; i < themeJson.length; i++){
		var currentTheme = themeJson[i];
		$("#filtersDiv").append( 
			`
				<div class="form-check">
					<input name="group${themesGroup}" type="radio" id="radio${radioId++} value="${currentTheme.id_theme}">
					<label for="radio${radioId}">${currentTheme.theme_name}</label>
				</div>
			`
		);
	}
}