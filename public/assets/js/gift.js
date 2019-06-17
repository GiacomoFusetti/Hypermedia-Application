console.log("Loading gift page");
var code = "gift10";

$(function() {
    $('#10-value-button').click(function(e) {
        code = "gift10";
		$('#20-value-button').removeClass('active');
        $('#30-value-button').removeClass('active');
        $('#50-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#20-value-button').click(function(e) {
		code = "gift20";
        $('#10-value-button').removeClass('active');
        $('#30-value-button').removeClass('active');
        $('#50-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    $('#30-value-button').click(function(e) {
		code = "gift30";
        $('#20-value-button').removeClass('active');
        $('#10-value-button').removeClass('active');
        $('#50-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
    $('#50-value-button').click(function(e) {
		code = "gift50";
        $('#20-value-button').removeClass('active');
        $('#30-value-button').removeClass('active');
        $('#10-value-button').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});        
});

function checkInputs(dom) {
    var f = dom.find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
    
    f.children('input').each(function() { // run all inputs
      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    
    if (ferror) return false;
    else return true;
}



jQuery(document).ready(function($) {
  "use strict";
    
    var validate = false;
    $('#purchase-form').submit(function(e) {
        e.preventDefault();
        validate = checkInputs($('#purchase-form'));
        
        if (validate){
            var email = $("#purchase-form").serializeArray()[1].value;
            Swal.fire({
                title: 'Confirmed purchase!',
                html: 'The coupon code has been sent to: <b>' + email + '</b><br>The code is: <b> ' + code + '</b>',
                type: 'success',
                confirmButtonColor:'#00983d',
                confirmButtonText: 'Ok, got it!'
            })
        }
        return false;

    });
});