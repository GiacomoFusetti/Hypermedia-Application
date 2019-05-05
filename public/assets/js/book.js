console.log("Loading book page");


$(document).ready(function(){
    $('#paper-button').click(function(e) {
		$('#ebook-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#ebook-button').click(function(e) {
		$('#paper-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
        
    $('.owl-carousel').owlCarousel({
        margin:10,
        loop:true,
        autoWidth:true,
        items:4
    })
	/*--/ Related books owl /--*/
	$('#books-carousel').owlCarousel({
		loop: true,
		margin: 30,
		responsive: {
			0: {
				items: 1,
			},
			769: {
				items: 2,
			},
			992: {
				items: 3,
			}
		}
	});
	

  	$("#booksby").on("hide.bs.collapse", function(){
		console.log("wewe");
		$(".h6").html('<i class="far fa-caret-square-down color-b"></i> Books By');
  	});
  	$("#booksby").on("show.bs.collapse", function(){
		$(".h6").html('<i class="far fa-caret-square-up color-b"></i> Books By');
  	});
});



    
    
