(function($){
	'use strict';
	$.hjelpetekst = {
		version: '0.3',
		isInitialized: false,
		init: function(stf,vis,baseUrl){
			if($.hjelpetekst.isInitialized) { return; }
			var start = new Date().getTime();
			var c = 0;
			stf = typeof stf !== 'undefined' ? stf : $('#pFlowId').val() || '';
			// break unless stf is admitted
			if($.inArray(stf, ['200','230']) == -1) { return; }
			vis = typeof vis !== 'undefined' ? vis : $('#pFlowStepId').val() || '';
			baseUrl = typeof baseUrl !== 'undefined' ? baseUrl : location.hostname === 'www.kursadmin.org' ? 'https://storage.googleapis.com/hjelpetekst.appspot.com/h1' : 'https://hjelpetekst.appspot.com/json-dev';
			$('#tabs').first().append('<li style="float:right;"><a class="tab_link" href="#" id="hjelpetekst_size_tool" style="background:yellow;border:1px solid #ABABAB;height:38px;"><small>A</small><big>A<big>A</big></big><span class="box"><span class="text">For å endre tekststørrelsen, hold Ctrl-tasten nede og trykk på + for å forstørre eller - for å forminske.</span></span></a></li>');
			$('#hjelpetekst_size_tool').on('focusin mouseenter', function() { $(this).find('span.box').show(); }).on('focusout mouseleave', function() { $(this).find('span.box').hide(); }).on('click', function(e) { e.preventDefault(); }).find('span.box').hide();
			//define functions
			var checkAndInsertContainers = function($ht_body, $ht_cont, $ht_tabs){
									if (!$ht_cont.length) {
										$ht_cont = $('<div id="ht_p1000_cont" class="ui-tabs-panel ui-widget-content ui-corner-all" style="margin: 0 3px 10px; max-width: 605px; font-size: 125%; line-height: 1.4"><div style="margin: 2ex"></div></div>');
										$ht_body.prepend($ht_cont);
									}
									if (!$ht_tabs.length) {
										$ht_tabs = $('<div id="ht_p1000_tabs" class="sHTabs" style="margin: 0 3px;"><div class="sHTabsInner"><ul></ul></div></div>');
										$ht_body.prepend($ht_tabs);
									}
								};
			var insertHTMLPages = function(h,$t,$l){
									$t.on('click', function() {
										var caller_tab = this.parentNode;
										$('#ht_p1000_cont').find(':first-child').html(h.tekst);
										$('#ht_p1000_tabs').find('li').removeClass().addClass(function(){
											return ($(this).is(':first-child') ? 'first-' : $(this).is(':last-child') ? 'last-' : '') + (caller_tab === this ? '' : 'non-') + 'current';
										});
									});
									$l.append($t);
									for(var text_i = 5;text_i > 0;text_i--){
										if(h.selector==='$$__T' + text_i + '__$$') {
											$t.attr('href', '#t' + text_i).attr('id', 'ht_p1000_cont_t' + text_i).append($('<span/>').text(h.tittel));
											$('#ht_p1000_tabs').find('ul').append($l);
										}
									}
								};
			var makeHjelpetekst = function($t,h,$o){
								$t.attr('title', h.tittel + ' (Klikk for hjelp)');
								$t.on('click', function () { $.hjelpetekst.show(h.tittel, h.tekst, encodeURI(h.video), encodeURI(h.link));});
								$t.insertAfter($o);
							};
			$.getJSON(baseUrl + '/' + stf + '-' + vis + '.json', function(data) {
				(function($stylesheet, $dialog){
					$('head').append($stylesheet);
					$dialog.on('click', function(e){ if ($(e.target).is('.hjelpetekst-dialog-outer')) { $.hjelpetekst.hide();}});
					$('body').append($dialog);
					$dialog.hide();
				}(
					$('<link rel="stylesheet" type="text/css" href="https://hjelpetekst.appspot.com/css/hjelpetekst.min.css" />'),
					$('<div id="hjelpetekst_dialog"></div>')
				));
				if ('hjelp' in data){
					for (var i = 0; i < data.hjelp.length; i ++) {
						var h = data.hjelp[i];
						// Extract HTML pages for view 1000
						if(vis == '1000') {
							if(/^\$\$__(.+)__\$\$$/.test(h.selector)) {
								//look for containers
								checkAndInsertContainers($('#body'),$('#ht_p1000_cont'),$('#ht_p1000_tabs'));
								insertHTMLPages(h,$('<a />'),$('<li class="non-current" />'));
								c++;
								continue; //Don't look for me in DOM...
							}
						}
						// Assume that selectors without "#", ".", and " " are 'plain' id-s.
						h.selector = /^([^#\. ]*)$/.test(h.selector) ? '#' + h.selector : h.selector;
						var $o = $(h.selector);
						if($o.length) {
							c++;
							if(h.tittel.substr(0,11)==='Veiledning:') {
								makeHjelpetekst($('<a class="hjelpetekst hjelpetekst-veiledning" href="javascript:void(0)">? <span>Veiledning</span></a>'), h, $o);
							}
							else {
								makeHjelpetekst($('<a class="hjelpetekst" href="javascript:void(0)">?</a>'), h, $o);
							}
						}
						else {
							console.log("Elementet '" + h.selector + "' finnes ikke i denne visningen, og bør fjernes fra dokumentet.");
						}
					}
					// Fix injected tabs in view 1000
					if(vis == '1000') {
						$('#ht_p1000_tabs').find('li')
							.filter(':last-child').removeClass().addClass('last-non-current').end()
							.filter(':first-child').removeClass().addClass('first-non-current').end()
							.find($('#ht_p1000_cont_' + location.hash.substr(1)).length ? ('#ht_p1000_cont_' + location.hash.substr(1)) : ':first-child').first().trigger('click');
					}
					console.log("Hjelpetekst.js har lagt inn " + c + " hjelpetekster i denne visningen. Prosessen tok " + (new Date().getTime() - start) + " ms.");
				}
			});
			$(document).on('keydown.hjelpetekst', function(e) {
				if(e.keyCode==27){ $.hjelpetekst.hide(); }
			});
			$.hjelpetekst.isInitialized = true;
		},
		hide: function() {
			$("#hjelpetekst_dialog").empty().hide();
		},
		show: function(t, i, v, m) { // tittel, innhold, video-link, mer-link
			var $dd = $('<div class="hjelpetekst-dialog-outer"><div class="hjelpetekst-dialog-content"><h3></h3><p></p></div></div>');
			var $ddhb = $('<button title="Lukk">&times;</button>');
			$ddhb.on('click', function() { $.hjelpetekst.hide(); });
			$dd.find('h3').text(t).prepend($ddhb);
			$dd.find('p').text(i);
			if (v) {
				(function($ddb){
					$ddb.attr('href', v);
					$ddb.on('click', function(e) { e.preventDefault(); $.hjelpetekst.video(this.href); });
					$(".hjelpetekst-dialog-content", $dd).append($ddb);
				}($('<a style="width:110px;">Video</a>')));
			}
			if (m) {
				(function($ddb){
					$ddb.attr('href', m);
					$ddb.on('click', function() { $.hjelpetekst.hide(); });
					$(".hjelpetekst-dialog-content", $dd).append($ddb);
				}($('<a style="width:110px; float:right;" target="_blank">Les mer</a>')));
			}
			$(".hjelpetekst-dialog-content", $dd).append($('<div style="clear:both;"></div>'));
			$('#hjelpetekst_dialog').show().css('display','table').empty().append($dd);
		},
		video: function(vid) {
			var $d = $('#hjelpetekst_dialog').find('p');
			var $vd = $('#hjelpetekst_dialog').find('iframe');
			if($vd.length) {
				$vd.remove();
				$d.show();
			} else {
				$d.hide();
				$vd = $('<iframe height="210" width="280" frameborder="0" allowfullscreen />');
				$vd.attr('src', vid + '?rel=0&autoplay=1');
				$vd.insertBefore($d);
			}
		}
	};
}(window.jQuery));
window.jQuery(window.jQuery.hjelpetekst.init(window.hjelpetekstStf, window.hjelpetekstVis, window.hjelpetekstUrl));
