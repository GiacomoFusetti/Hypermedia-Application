console.log("Loading book_by_genre page");
new WOW().init();

let genreJson;
let list = [];

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
            genreJson.sort((a, b) => a.name.localeCompare(b.name));
			generatesGenreHTML();
		}else{
			// TODO
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesGenreHTML(){
    generatesLetterList();
    
    var genreHTML = `
                        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                            <li class="list-by"><div class="title-box-d"><h3 class="title-d">` + list[0] + `</h3></div><ul class="list-unstyled">`;
    
    var z = 0;
    for(x = 0; x < genreJson.length; x++){
        var genre = genreJson[x];
        if(!genre.name.toUpperCase().startsWith(list[z])){
            z++;
            
            genreHTML += `
                            </ul></li></div>
                            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                                <li class="list-by"><div class="title-box-d"><h3 class="title-d">` + list[z] + `</h3></div><ul class="list-unstyled">
                         `;
        }
        
        genreHTML += `
                        <li  class="item-list-a"><i class="fa fa-angle-right"></i>
                            <a class="pointer-a link_style list-font" href='books.html?genre=${genre.id_genre}&bygenrex'>${genre.name}</a>
                        </li>
                     `;
    }
    genreHTML += `</div>`;
    $('#bodyDiv').html(genreHTML);
}

// -------------- AUXILIARY FUNCTIONS ---------------

function generatesLetterList(){
    
    for(y = 0; y <genreJson.length; y++){
        var letter = genreJson[y].name.substring(0,1).toUpperCase();
        if(list.indexOf(letter) === -1){
            list.push(letter);
        }
    }
}