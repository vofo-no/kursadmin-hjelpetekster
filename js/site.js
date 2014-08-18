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
 * bootstrap-notify.js v1.0
 * --
  * Copyright 2012 Goodybag, Inc.
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function ($) {
  var Notification = function (element, options) {
    // Element collection
    this.$element = $(element);
    this.$note    = $('<div class="alert"></div>');
    this.options  = $.extend(true, {}, $.fn.notify.defaults, options);

    // Setup from options
    if(this.options.transition) {
      if(this.options.transition == 'fade')
        this.$note.addClass('in').addClass(this.options.transition);
      else
        this.$note.addClass(this.options.transition);
    } else
      this.$note.addClass('fade').addClass('in');

    if(this.options.type)
      this.$note.addClass('alert-' + this.options.type);
    else
      this.$note.addClass('alert-success');

    if(!this.options.message && this.$element.data("message") !== '') // dom text
      this.$note.html(this.$element.data("message"));
    else
      if(typeof this.options.message === 'object') {
        if(this.options.message.html)
          this.$note.html(this.options.message.html);
        else if(this.options.message.text)
          this.$note.text(this.options.message.text);
      } else
        this.$note.html(this.options.message);

    if(this.options.closable) {
      var link = $('<a class="close pull-right" href="#">&times;</a>');
      $(link).on('click', $.proxy(onClose, this));
      this.$note.prepend(link);
    }

    return this;
  };

  var onClose = function() {
    this.options.onClose();
    $(this.$note).remove();
    this.options.onClosed();
    return false;
  };

  Notification.prototype.show = function () {
    if(this.options.fadeOut.enabled)
      this.$note.delay(this.options.fadeOut.delay || 3000).fadeOut('slow', $.proxy(onClose, this));

    this.$element.append(this.$note);
    this.$note.alert();
  };

  Notification.prototype.hide = function () {
    if(this.options.fadeOut.enabled)
      this.$note.delay(this.options.fadeOut.delay || 3000).fadeOut('slow', $.proxy(onClose, this));
    else onClose.call(this);
  };

  $.fn.notify = function (options) {
    return new Notification(this, options);
  };

  $.fn.notify.defaults = {
    type: 'success',
    closable: true,
    transition: 'fade',
    fadeOut: {
      enabled: true,
      delay: 3000
    },
    message: null,
    onClose: function () {},
    onClosed: function () {}
  }
})(window.jQuery);

/**/
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);
/**
site.js
*/
(function(){
	var suc = $.QueryString['success'];
	if(suc==1){			$(".top-left").notify({message: {text: "Hjelpeteksten er opprettet.", type: "success"}}).show();}
	else if(suc==2){	$(".top-left").notify({message: {text: "Hjelpeteksten er lagret.", type: "success"}}).show();}
	else if(suc==3){	$(".top-left").notify({message: {text: "Siden er opprettet.", type: "success"}}).show();}
	else if(suc==4){	$(".top-left").notify({message: {text: "Endringene er lagret.", type: "success"}}).show();}
	
	$("#video").on("focusout", function() { if(ytVidId($(this).val())) { $(this).val('//www.youtube.com/embed/' + ytVidId($(this).val())); } });
	$("#fhvht").on("click", function() { hjelpetekst($("#tittel").val(), $("#tekst").val(), $("#video").val(), $("#link").val()); });
	$("#fhvmd").on("click", function() { $("#fhvdiv").html("Laster forhåndsvisning...").load("/md", {"raw": $("#raw").val()}); });
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
