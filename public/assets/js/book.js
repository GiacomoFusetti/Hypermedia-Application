console.log("Loading book page");

// Switch between log in and register form
$(function() {
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

});



    
    
