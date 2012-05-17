$(function() {
	rotate();
	removeImess();
	userCall();
})

var thisAd = 0;

function rotate() {
	var adImages = new Array("img/de.png","img/de1.png");

	thisAd++;
	if (thisAd == adImages.length) {
		thisAd = 0;
	}
	document.getElementById("roimg").src = adImages[thisAd];

	setTimeout(rotate, 2000);
}

function removeImess() {
	$("#login").click(function() {
		$(".describe").hide();
	});
}

function userCall() {
	$(".user-name").click( function() {
		 $(".chat-input").html("@" + $(this).html() + " " );
	});
}