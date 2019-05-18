console.log("Loading login page");

// Switch between log in and register form
$(function() {
    $('#login-form-link').click(function(e) {
        $("#logintitle").text("Log in")
        $("#orientationinfo").text("Log in")
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
        $("#logintitle").text("Register")
        $("#orientationinfo").text("Register")
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
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
    if(window.location.href.split('?').pop() == 'register') {
        $("#register-form-link").trigger('click');
    }

    var validate = false;
    $('form.loginForm').submit(function() {
        validate = checkInputs($('form.loginForm'));

        if (validate) postLogin($('form.loginForm'));
        return false;

    });
    $('form.registerForm').submit(function() {
        validate = checkInputs($('form.registerForm'));
        
        if($("#psw").val() === $("#confirmpsw").val()){
            if (validate) postRegister($('form.registerForm'));
        }else{
            $("#spanRegisterError").text("Passwords must be equal.");
            $('#registererror').show();
        }
        return false;
    });
});

function postRegister(form) {
    var str = form.serialize()

    fetch('/user/register', {
        body: str,
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        method: "post",
    }).then(function(response) {
        response.json().then(function(json) {
            if(json.error){
                $("#spanRegisterError").text(json.error);
                $('#registererror').show();
            }else{
                $('#registererror').hide();
                $('#login-form-link').trigger('click');
				Toast.fire({
				  type: 'success',
				  title: 'Registration done!'
				})
            }
        });
    });
}   


function postLogin(form) {
    var str = form.serialize()

    fetch('/user/login', {
        body: str,
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        method: "post",
    }).then(function(response) {
         return response.json();
     }).then(function(json) {
        console.log(json);
        
        if(jQuery.isEmptyObject(json)){
            $('#loginerror').show();
        }else{
            $('#loginerror').hide();
            window.location.replace("../index.html");
        }
     });
}
