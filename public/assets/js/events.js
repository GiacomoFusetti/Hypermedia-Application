
let option;
let eventsJson;
let this_month;
let selection;

let urlParams = new URLSearchParams(window.location.search);
let offset = urlParams.get('offset') || 0;
let limit = urlParams.get('limit') || 6;

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(document).ready(function(){
    
    //PAGINATION
	$("#pagDiv").on("click", "li.page-item", function() {
  		// remove classes from all
  		$("li.page-item").removeClass("active");
      	// add class to the one we clicked
      	$(this).addClass("active");

		offset = $(this).val() * limit;
		getEvents();
		scrollOnTop();
   	});
    
    $("select.custom-select").change(function(){
        option = $(this).children("option:selected").val();
        
        switch(option){
            case "1":
                selection = "current_month";
                break;
            case "2":    
                selection = "latest";
                break;
            default:
                selection = 0;
        }
        offset = 0;
        getEventsCount();
        getEvents();
    });
    getEventsCount();
	getEvents();
});

// -------------- REQUESTS ---------------

function getPage(num){
    console.log("num: " + num);
    offset = (num-1)*limit;
    getEvents();
}

function getEvents(){
    var query = '?offset=' + offset + '&limit=' + limit;
    
	if(selection) query += '&orderBy=' + selection;
	fetch('/events' + query).then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
        $("#eventsDiv").empty();
        if(!jQuery.isEmptyObject(eventsJson)){
			generatesHTML();
		}else{    
			$("#eventsDiv").append( 
				'<div class="col-12"><h3 class="title-single">No Events available.</h3></div>'
			);
		}
	 });
}

function getEventsCount(){
    
	var query = '?offset=' + offset + '&limit=' + limit;
    
	if(selection) query += '&orderBy=' + selection;
    fetch('/events/count' + query).then(function(response) {
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
	for(i = 0; i < eventsJson.length; i++){
		$("#eventsDiv").append( 
			`
				<div class="col-md-4">
					<div class="carousel-item-b">
						<div class="card-box-b card-shadow container_img">               
							<a href="event.html?id=${eventsJson[i].id_event}">
								 <img src="${eventsJson[i].img}" alt="${eventsJson[i].name}" class="img-b img-fluid">
								 <div class="card-header-b">
									<div class="card-category-b">
										<a class="category-b"><i class="fas fa-map-marker-alt"></i> ${eventsJson[i].city}</a>
									</div>
									<div class="card-title-b">
										<h2 class="title-2">
											<a class="font-80" href="event.html?id=${eventsJson[i].id_event}">${eventsJson[i].name}</a>
										</h2>
									</div>
									<div class="card-date">
										<span class="date-b">${eventsJson[i].date_day} ${month[eventsJson[i].date_month-1]} ${eventsJson[i].date_year}</span>
									</div>
								</div>
							</a>
						 </div>
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
