/**
 * JavaScript function to match (and return) the video Id 
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
function ytVidId(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

/**
site.js
*/
(function(){
	$("#video").on("focusout", function() { if(ytVidId($(this).val())) { $(this).val('//www.youtube.com/embed/' + ytVidId($(this).val())); } });
	$("#fhvht").on("click", function() { hjelpetekst($("#tittel").val(), $("#tekst").val(), $("#video").val(), $("#link").val()); });
	$("#leggut").on("click", function(e) {
		e.preventDefault();
		$("#leggut").attr("disabled", true);
		$.ajax({
			url: $(this).attr("href"),
			type: "POST",
			success: function() {
				alert("Dokumentet er lagt ut i produksjon.");
				$("#leggut").attr("disabled", false);
			}
		});
	});
	$("#beomtilgang").on("click", function() {
		var $m = $("#beomtilgang_merknad");
		if(!$m.val()){
			$m.parent("div").addClass("has-error");
			$m.focus();
			return;
		}
		$(this).text("Venter på tilgang...").attr("disabled", true);
		var stf = $("#stf").val();
		$.ajax({
			url: "/auth/" + stf,
			type: "PUT",
			data: {merknad: $m.val()},
			success: function() {
				alert("Forespørselen er sendt.");
				$m.remove();
			}
		});
	});
	window.authGodkjenn = function(key, po){
		$p = $(po);
		$p.text("Godkjenner...").attr("disabled", true);
		$.ajax({
			url: "/auth/0/" + key,
			type: "POST",
			success: function() {
				alert("Forespørselen er godkjent.");
				$p.remove();
			}
		});
	}
	window.authSlett = function(key, po){
		$p = $(po);
		$p.text("Sletter...").attr("disabled", true);
		$.ajax({
			url: "/auth/0/" + key,
			type: "DELETE",
			success: function() {
				alert("Tilgangen er slettet.");
				$p.parent("h4").parent("li").remove();
			}
		});
	}
	window.hjelpetekstStf = '1';
	window.hjelpetekstVis = '1';
	window.hjelpetekstUrl = '/js';
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "/js/hjelpetekst.min.js";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'hjelpetekst-js'));
}());
