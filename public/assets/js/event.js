console.log("Loading events page");

let eventsJson;
let this_month;

let urlParams = new URLSearchParams(window.location.search);
let id_event = urlParams.get('id');

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
   	});
    
    $("select.custom-select").change(function(){
        this_month = $(this).children("option:selected").val();
        offset = 0;
        getEventsCount();
        getEvents();
    });
    getEventsCount();
	getEvents();
});

function getPage(num){
    console.log("num: " + num);
    offset = (num-1)*limit;
    getEvents();
}

function getEventById(){
    
	fetch('/events/' + id_event).then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
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

function fillHead(event){
    $("#event_title").html(event.name);
    $("#event_name").html(event.name);
    $("#book_title").html(event.book_name);
}

function fillBody(event){
    
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
