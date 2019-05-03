console.log("Loading gift page");

$(function() {
    $('#10-value-button').click(function(e) {
		$('#20-value-button').removeClass('active');
        $('#30-value-button').removeClass('active');
        $('#50-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#20-value-button').click(function(e) {
		$('#10-value-button').removeClass('active');
        $('#30-value-button').removeClass('active');
        $('#50-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    $('#30-value-button').click(function(e) {
		$('#20-value-button').removeClass('active');
        $('#10-value-button').removeClass('active');
        $('#50-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    $('#50-value-button').click(function(e) {
		$('#20-value-button').removeClass('active');
        $('#30-value-button').removeClass('active');
        $('#10-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
});