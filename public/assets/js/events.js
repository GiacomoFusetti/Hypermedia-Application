console.log("Loading events page");

let eventsJson;

$(document).ready(function(){
	getEvents();
});

function getEvents(){
	fetch('/events').then(function(response) {
		return response.json();
	 }).then(function(json) {
		eventsJson = json;
        console.log("EventJson: " + eventsJson);
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
    $("#eventsDiv").append( 
        `         
            <div class="col-sm-12">
              <div class="grid-option">
                <form>
                  <select class="custom-select">
                    <option selected>All</option>
                    <option value="1">Events in this month</option>
                  </select>
                </form>
              </div>
            </div>
        `
    );
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
                              <!--<br> ${eventsJson[i].id_book}</a>-->
                          </h2>
                        </div>
                        <div class="card-date">
                          <span class="date-b">${eventsJson[i].date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
			`
		);
	}
    /*
    $("#eventsDiv").append( 
			`
                <div class="col-sm-12">
                  <nav class="pagination-a">
                    <ul class="pagination justify-content-end">
                      <li class="page-item disabled">
                        <a class="page-link" href="#" tabindex="-1">
                          <span class="ion-ios-arrow-back"></span>
                        </a>
                      </li>
                    `
        );
                      for(i = 0; i < eventsJson.length; i++){
                         $("#eventsDiv").append( 
			                `
                              <li class="page-item active">
                                <a class="page-link" href="#">1</a>
                              </li>
                              <li class="page-item">
                                <a class="page-link" href="#">2</a>
                              </li>
                              <li class="page-item">
                                <a class="page-link" href="#">3</a>
                              </li>
                      }
                      $("#eventsDiv").append(
                      <li class="page-item next">
                        <a class="page-link" href="#">
                          <span class="ion-ios-arrow-forward"></span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
            `
        );*/
}
/*
<div class="row">
            <div class="col-sm-12">
              <div class="grid-option">
                <form>
                  <select class="custom-select">
                    <option selected>All</option>
                    <option value="1">Events in this month</option>
                  </select>
                </form>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-box-b card-shadow news-box">
                <div class="img-box-b">
                  <img src="../assets/img/post-1.jpg" alt="" class="img-b img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-header-b">
                    <div class="card-category-b">
                      <a href="#" class="category-b">Location</a>
                    </div>
                    <div class="card-title-b">
                      <h2 class="title-2">
                        <a href="event.html">Event - Name
                          <br> Book - Title</a>
                      </h2>
                    </div>
                    <div class="card-date">
                      <span class="date-b">Date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-box-b card-shadow news-box">
                <div class="img-box-b">
                  <img src="../assets/img/post-2.jpg" alt="" class="img-b img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-header-b">
                    <div class="card-category-b">
                      <a href="event.html" class="category-b">Travel</a>
                    </div>
                    <div class="card-title-b">
                      <h2 class="title-2">
                        <a href="event.html">Travel is comming
                          <br> new</a>
                      </h2>
                    </div>
                    <div class="card-date">
                      <span class="date-b">18 Sep. 2017</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-box-b card-shadow news-box">
                <div class="img-box-b">
                  <img src="../assets/img/post-3.jpg" alt="" class="img-b img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-header-b">
                    <div class="card-category-b">
                      <a href="#" class="category-b">Travel</a>
                    </div>
                    <div class="card-title-b">
                      <h2 class="title-2">
                        <a href="event.html">Travel is comming
                          <br> new</a>
                      </h2>
                    </div>
                    <div class="card-date">
                      <span class="date-b">18 Sep. 2017</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-box-b card-shadow news-box">
                <div class="img-box-b">
                  <img src="../assets/img/post-4.jpg" alt="" class="img-b img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-header-b">
                    <div class="card-category-b">
                      <a href="#" class="category-b">Travel</a>
                    </div>
                    <div class="card-title-b">
                      <h2 class="title-2">
                        <a href="event.html">Travel is comming
                          <br> new</a>
                      </h2>
                    </div>
                    <div class="card-date">
                      <span class="date-b">18 Sep. 2017</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-box-b card-shadow news-box">
                <div class="img-box-b">
                  <img src="../assets/img/post-5.jpg" alt="" class="img-b img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-header-b">
                    <div class="card-category-b">
                      <a href="#" class="category-b">Travel</a>
                    </div>
                    <div class="card-title-b">
                      <h2 class="title-2">
                        <a href="event.html">Travel is comming
                          <br> new</a>
                      </h2>
                    </div>
                    <div class="card-date">
                      <span class="date-b">18 Sep. 2017</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card-box-b card-shadow news-box">
                <div class="img-box-b">
                  <img src="../assets/img/post-6.jpg" alt="" class="img-b img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-header-b">
                    <div class="card-category-b">
                      <a href="#" class="category-b">Travel</a>
                    </div>
                    <div class="card-title-b">
                      <h2 class="title-2">
                        <a href="event.html">Travel is comming
                          <br> new</a>
                      </h2>
                    </div>
                    <div class="card-date">
                      <span class="date-b">18 Sep. 2017</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
        <div class="row">
        <div class="col-sm-12">
          <nav class="pagination-a">
            <ul class="pagination justify-content-end">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1">
                  <span class="ion-ios-arrow-back"></span>
                </a>
              </li>
              <li class="page-item active">
                <a class="page-link" href="#">1</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">2</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">3</a>
              </li>
              <li class="page-item next">
                <a class="page-link" href="#">
                  <span class="ion-ios-arrow-forward"></span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>*/