console.log("Loading faq page");

let faqJson;

$(document).ready(function(){
	getFaq();
});

function getFaq(){
	fetch('/faq').then(function(response) {
			 return response.json();
	 }).then(function(json) {
		faqJson = json;
		if(!jQuery.isEmptyObject(faqJson)){
			generatesHTML();
		}else{
			$("#faqDiv").append( 
				'<h3 class="title-single">No FAQ available.</h3>'
			);
		}
	 });
}

function generatesHTML(){	
	for(i = 0; i < faqJson.length; i++){
		$("#faqDiv").append( 
			`
				<h3 class="title-single">${faqJson[i].question}</h3>
				<hr>
				<p>${faqJson[i].answer}</p>
			`
		);
	}
}