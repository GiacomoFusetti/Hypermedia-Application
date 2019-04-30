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
});