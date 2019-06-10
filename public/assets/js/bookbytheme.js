console.log("Loading book_by_theme page");
new WOW().init();

let themesJson;
let list = [];

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
			themesJson.sort((a, b) => a.theme_name.localeCompare(b.theme_name));
            generatesThemeHTML();
		}else{
			// TODO
		}
 	});
}

// -------------- GENERATES HTML ---------------

function generatesThemeHTML(){
    generatesLetterList();
    
    var themeHTML = `
                        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                            <li class="list-by"><div class="title-box-d"><h3 class="title-d">` + list[0] + `</h3></div><ul class="list-unstyled">`;
    
    var z = 0;
    for(x = 0; x < themesJson.length; x++){
        var theme = themesJson[x];
        if(!theme.theme_name.toUpperCase().startsWith(list[z])){
            z++;
            
            themeHTML += `
                            </ul></li></div>
                            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                                <li class="list-by"><div class="title-box-d"><h3 class="title-d">` + list[z] + `</h3></div><ul class="list-unstyled">
                         `;
        }
        
        themeHTML += `
                        <li  class="item-list-a"><i class="fa fa-angle-right"></i>
                           <a class="pointer-a link_style list-font" href='books.html?theme=${theme.id_theme}&bythemex'>${theme.theme_name}</a>
                        </li>
                     `;
    }
    themeHTML += `</div>`;
    $('#bodyDiv').html(themeHTML);
}

// -------------- AUXILIARY FUNCTIONS ---------------

function generatesLetterList(){
    
    for(y = 0; y < themesJson.length; y++){
        var letter = themesJson[y].theme_name.substring(0,1).toUpperCase();
        if(list.indexOf(letter) === -1){
            list.push(letter);
        }
    }
}