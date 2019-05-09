console.log("Loading events page");

let eventsJson;
let this_month;

let offset = 0;
let limit = 12;

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(document).ready(function(){
    $('#first').click(function(e) {
		$('#second').removeClass('active');
        $('#third').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    $('#second').click(function(e) {
		$('#first').removeClass('active');
        $('#third').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    $('#third').click(function(e) {
		$('#first').removeClass('active');
        $('#second').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    
    $("select.custom-select").change(function(){
        this_month = $(this).children("option:selected").val();
        getEvents();
    });
    
	getEvents();
});

function getPage(num){
    console.log("num: " + num);
    offset = (num-1)*limit;
    getEvents();
}

function getEvents(){
    var query = '?offset=' + offset + '&limit=' + limit;
	if(this_month) query += '&current_month=' + this_month;
    
	fetch('/events' + query).then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
        console.log("EventJson: " + eventsJson);
        $("#eventsDiv").empty();
        
        if(!jQuery.isEmptyObject(eventsJson)){
			generatesHTML();
		}else{    
			$("#eventsDiv").append( 
				'<h3 class="title-single">No Events available.</h3>'
			);
		}
	 });
}

function generatesHTML(){
    console.log(eventsJson);
	for(i = 0; i < eventsJson.length; i++){
		$("#eventsDiv").append( 
			`
				<div class="col-md-4">
                  <div class="card-box-b card-shadow news-box">
                    <div class="img-box-b">
                      <img src="${eventsJson[i].img}" alt="" class="img-b img-fluid">
                    </div>
                    <div class="card-overlay">
                      <div class="card-header-b">
                        <div class="card-category-b">
                          <a href="#" class="category-b"><i class="fas fa-map-marker-alt"></i>
                                    ${eventsJson[i].city}</a>
                        </div>
                        <div class="card-title-b">
                          <h2 class="title-2">
                            <a href="event.html">${eventsJson[i].name}
                          </h2>
                        </div>
                        <div class="card-date">
                          <span class="date-b">${eventsJson[i].date_day} ${month[eventsJson[i].date_month]} ${eventsJson[i].date_year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
			`
		);
	}
}
