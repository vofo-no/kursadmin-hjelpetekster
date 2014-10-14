(function($){
	'use strict';
	$.hjelpetekst = {
		version: '0.2',
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
					$('<style>a.hjelpetekst,div.sHTabs ul li a.hjelpetekst{font-size:16px;font-family:sans-serif;vertical-align:middle;font-weight:700;text-align:center;line-height:1.2;display:inline-block;width:2ex;height:2ex;border-radius:1ex;color:#000;background:#FCE300;border:1px solid #000;text-decoration:none;transition-duration:.5s;-moz-border-radius:1ex;-webkit-border-radius:1ex;-webkit-transition-duration:.5s;cursor:pointer;margin:-1ex .5ex;float:none;padding:0;}div.sHTabs ul li a.hjelpetekst{margin: 5px 5px 5px 0;}a.hjelpetekst:hover{background:orange;color:#000;text-decoration:none;}#hjelpetekst_dialog{font-family:sans-serif;font-size:15px;line-height:21px;color:#000;height:100%;left:0;position:fixed;top:0;width:100%;z-index:1000;background:rgba(0,0,0,0.4);display:table;}#hjelpetekst_dialog > div{display:table-cell;vertical-align:middle;}#hjelpetekst_dialog > div > div{box-sizing:content-box;background-color:#FCE300;border:3px solid #000;display:block;font-size:15px;line-height:1.4;margin:auto;padding:15px;width:280px;z-index:10001;}#hjelpetekst_dialog h3{font-family:sans-serif;font-size:18px;line-height:25px;border-bottom:1px solid #000;margin:0;padding-bottom:6px;font-weight:700;}#hjelpetekst_dialog h3 button{float:right;margin-left:4px;font-size:20px;}#hjelpetekst_dialog a,#hjelpetekst_dialog button{box-sizing:content-box;background:#fff;border:1px solid #000;color:#000;font-size:15px;line-height:21px;display:inline-block;font-weight:700;margin:-2px 0;padding:2px 10px;text-align:center;text-decoration:none;}#hjelpetekst_dialog p,#hjelpetekst_dialog iframe{box-sizing:content-box;border-bottom:1px solid #000;height:210px;margin:10px 0 15px;padding-bottom:10px;} #ht_p1000_cont h1, #ht_p1000_cont h2, #ht_p1000_cont h3, #ht_p1000_cont h4, #ht_p1000_cont h5, #ht_p1000_cont h6 { margin: 20px 0 6px;} #ht_p1000_cont p { margin: 0 0 16px; } #ht_p1000_cont img { max-width: 100%;vertical-align:middle; } #hjelpetekst_size_tool span.box{border: 2px solid #ccc;background-color: #fff;display: none;position: absolute;font-size: 4em;line-height: 1.6em;letter-spacing: 2pt;left: 0px;width: 98%;margin-left: 1%;z-index: 10000;margin-top: 14pt} #hjelpetekst_size_tool span.text {padding:20pt;display:block;}</style>'),
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
							makeHjelpetekst($('<a class="hjelpetekst" href="javascript:void(0)">?</a>'), h, $o);
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
			$('#hjelpetekst_dialog').show().empty().append($dd);
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
