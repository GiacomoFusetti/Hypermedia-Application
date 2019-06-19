let user = {};

let pathname = window.location.pathname;
let pages = "";

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
        
if(pathname === '/' || pathname === '/index.html')
	pages = "pages/";

// -------------- REQUESTS ---------------

function getUser(){
    fetch('/user', {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        method: "GET",
        credentials: 'include'
    }).then(function(response) {
        return response.json();		
    }).then(function(json) {
		console.log(json);
		if(!json.error){
			user = json;
			toggleLogin(user);
			getCartCount();
		} 
    });
}

function getCartCount(){
    fetch('/cart/count', {
        method: "GET",
        credentials: 'include'
    }).then(function(response) {
         return response.json();
     }).then(function(json) {
        
		if(json.total_count == 0)
        	toggleCartIcon(false);
		else if(json.total_count > 0){
			toggleCartIcon(true);
			$('span.cartCount').text(json.total_count);
		}
     });
}

function toggleLogin(user){
    $('#navbarLogin').empty();
    if(!jQuery.isEmptyObject(user)){
		toggleCartIcon(true);
        $('#navbarLogin').append(
            `
            <li class="nav-item dropdown">
                <a class="nav-link dropdownb dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    Welcome ${user.name}!
                </a>
                <div class="dropdown-content" aria-labelledby="navbarDropdown">
                    <a id="logOutButton" class="dropdown-item" href="#">Log out</a>
                </div>
            </li>
            `
         );
    }else{
		toggleCartIcon(false);
        $('#navbarLogin').append(
            `
            <li class="nav-item"><a class="nav-link" href="${pages}login.html?login">Log in</a></li>
            <li class="nav-item"><a class="nav-link" href="${pages}login.html?register">Register</a></li>
            `
         );
    }
}

function toggleCartIcon(toggle){
	if(toggle)
		$('span.cartCount').show();
	else
		$('span.cartCount').hide();
}

function scrollOnTop(){
	window.scrollTo(0, 0);
    return false;
}

jQuery(document).ready(function($) {
  "use strict";
	
	getUser();
	
	//Handle cart button
	$('.btn-cart').click(function(){
		if(!jQuery.isEmptyObject(user))
			window.location.href = pages + "cart.html";
		else
			window.location.href = pages + "login.html?login";
	});
    
    $('#navbarLogin').on("click", "#logOutButton", function(){
        fetch('../user/logout', {
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            method: "DELETE",
            credentials: 'include'
        }).then(function(response) {
			
			if(response.status == 200){
				user = response.json;
				toggleLogin(user);
				window.location.href = "../index.html";
			}
         });
    });
  
  // Preloader
  $(window).ready(function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });
  
	var nav = $('nav');
	var navHeight = nav.outerHeight();

	/*--/ ScrollReveal /Easy scroll animations for web and mobile browsers /--*/
	window.sr = ScrollReveal();
	sr.reveal('.foo', { duration: 1000, delay: 15 });

	/*--/ Carousel owl /--*/
	$('#carousel').owlCarousel({
		loop: true,
		margin: -1,
		items: 1,
		nav: true,
		navText: ['<i class="ion-ios-arrow-back" aria-hidden="true"></i>', '<i class="ion-ios-arrow-forward" aria-hidden="true"></i>'],
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true
	});

	/*--/ Animate Carousel /--*/
	$('.intro-carousel').on('translate.owl.carousel', function () {
		$('.intro-content .intro-title').removeClass('zoomIn animated').hide();
		$('.intro-content .intro-price').removeClass('fadeInUp animated').hide();
		$('.intro-content .intro-title-top, .intro-content .spacial').removeClass('fadeIn animated').hide();
	});

	$('.intro-carousel').on('translated.owl.carousel', function () {
		$('.intro-content .intro-title').addClass('zoomIn animated').show();
		$('.intro-content .intro-price').addClass('fadeInUp animated').show();
		$('.intro-content .intro-title-top, .intro-content .spacial').addClass('fadeIn animated').show();
	});
	/*--/ Navbar Collapse /--*/
	$('.navbar-toggle-box-collapse').on('click', function () {
		$('body').removeClass('box-collapse-closed').addClass('box-collapse-open');
	});
	$('.close-box-collapse, .click-closed').on('click', function () {
		$('body').removeClass('box-collapse-open').addClass('box-collapse-closed');
		$('.menu-list ul').slideUp(700);
	});

	/*--/ Navbar Menu Reduce /--*/
	$(window).trigger('scroll');
	$(window).bind('scroll', function () {
		var pixels = 50;
		var top = 1200;
		if ($(window).scrollTop() > pixels) {
			$('.navbar-default').addClass('navbar-reduce');
			$('.navbar-default').removeClass('navbar-trans');
		} else {
			$('.navbar-default').addClass('navbar-trans');
			$('.navbar-default').removeClass('navbar-reduce');
		}
		if ($(window).scrollTop() > top) {
			$('.scrolltop-mf').fadeIn(1000, "easeInOutExpo");
		} else {
			$('.scrolltop-mf').fadeOut(1000, "easeInOutExpo");
		}
	});   

});


