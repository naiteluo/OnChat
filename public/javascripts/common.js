
var setSlide = function () {
	var i = 0;
	var ads = new Array("images/de.png","images/de1.png");
	var step = function () {
		i ++;
		if (i == ads.length) {
			i = 0;
		}
		$("#roimg")[0].src = ads[i];
		if($('#describe').css('display') == 'none') return;
		setTimeout(step, 2000);
	}
	return step;
}();

function at() {
	$(".user").live('click', function () {
		$("#chat-input").val($("#chat-input").val() + "@" + $(this).html() + " " );
	});
}

function autoScroll() {
	setTimeout(function () {
		$('#logs').scrollTop($('#logs')[0].scrollHeight + 100000);
	}, 100);
}

$(function() {
	
	// init page
	$('form').submit(false);
	$('#welcome').hide();
	at();
	setSlide();

	// init websocket
	var server = document.location.origin;
	_CR.init(server);
});