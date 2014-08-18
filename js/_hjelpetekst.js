(function(stf, vis, baseUrl){
		var xmlhttp, start = new Date().getTime();
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange  = function(){
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
			    var stilark = document.createElement('style');
				stilark.innerHTML = "a.hjelpetekst{font-size:16px;font-family:sans-serif;vertical-align:middle;font-weight:700;text-align:center;line-height:1.2;display:inline-block;width:2ex;height:2ex;border-radius:1ex;color:#000;background:#FCE300;border:1px solid #000;text-decoration:none;transition-duration:.5s;-moz-border-radius:1ex;-webkit-border-radius:1ex;-webkit-transition-duration:.5s;cursor:pointer;margin:-1ex .5ex;}a.hjelpetekst:hover{background:orange;color:#000;text-decoration:none;}#hjelpetekst_overlay{background:rgba(0,0,0,0.4);display:block;}#hjelpetekst_overlay,#hjelpetekst_dialog{font-family:sans-serif;font-size:15px;line-height:21px;color:#000;height:100%;left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:1000;}#hjelpetekst_dialog{display:table;}#hjelpetekst_dialog > div{display:table-cell;vertical-align:middle;}#hjelpetekst_dialog > div > div{box-sizing:content-box;background-color:#FCE300;border:3px solid #000;display:block;font-size:15px;line-height:1.4;margin:auto;padding:15px;width:280px;z-index:10001;}#hjelpetekst_dialog h3{font-family:sans-serif;font-size:18px;line-height:25px;border-bottom:1px solid #000;margin:0;padding-bottom:6px;font-weight:700;}#hjelpetekst_dialog h3 button{float:right;margin-left:4px;font-size:20px;}#hjelpetekst_dialog a,#hjelpetekst_dialog button{box-sizing:content-box;background:#fff;border:1px solid #000;color:#000;font-size:15px;line-height:21px;display:inline-block;font-weight:700;margin:-2px 0;padding:2px 10px;text-align:center;text-decoration:none;}#hjelpetekst_dialog p,#hjelpetekst_dialog iframe{box-sizing:content-box;border-bottom:1px solid #000;height:210px;margin:10px 0 15px;padding-bottom:10px;} #ht_p1000_cont h1, #ht_p1000_cont h2, #ht_p1000_cont h3, #ht_p1000_cont h4, #ht_p1000_cont h5, #ht_p1000_cont h6 { margin: 20px 0 6px;} #ht_p1000_cont p { margin: 0 0 16px; } #ht_p1000_cont img { max-width: 100%;vertical-align:middle; }";
				document.body.appendChild(stilark);
				var overlay = document.createElement('div');
				overlay.id = "hjelpetekst_overlay";
				overlay.onclick = function() {hjelpetekstHide();};
				document.body.appendChild(overlay);
				var dialog = document.createElement('div');
				dialog.id = "hjelpetekst_dialog";
				document.body.appendChild(dialog);
				// Javascript function JSON.parse to parse JSON data
				var j = JSON.parse(xmlhttp.responseText), c = 0;
				if("hjelp" in j) {
					for (var i = 0; i < j.hjelp.length; i ++) {
						var h = j.hjelp[i];
						// Extract HTML pages for view 1000
						if(window.hjelpetekstVisParam == 1000) {
							if(/^\$\$__(.+)__\$\$$/.test(h.selector)) {
								//look for containers
								var ht_body = document.getElementById("body");
								var ht_p1000_cont = document.getElementById("ht_p1000_cont");
								if(!ht_p1000_cont) {
									ht_p1000_cont = document.createElement("div");
									ht_p1000_cont.id = 'ht_p1000_cont';
									ht_p1000_cont.className = "ui-tabs-panel ui-widget-content ui-corner-all";
									ht_p1000_cont.style.margin = "0 3px 10px";
									ht_p1000_cont.style.maxWidth = "605px";
									ht_p1000_cont.style.fontSize = "125%";
									ht_p1000_cont.style.lineHeight = "1.4";
									var ht_p1000_cont_inner = document.createElement("div");
									ht_p1000_cont_inner.style.margin = "2ex";
									ht_p1000_cont.appendChild(ht_p1000_cont_inner);
									ht_body.insertBefore(ht_p1000_cont, ht_body.childNodes[0]);
								}
								var ht_p1000_tabs = document.getElementById("ht_p1000_tabs");
								if(!ht_p1000_tabs) {
									ht_p1000_tabs = document.createElement("div");
									ht_p1000_tabs.id = 'ht_p1000_tabs';
									ht_p1000_tabs.style.margin = "0 3px";
									ht_p1000_tabs.className = "sHTabs";
									var ht_p1000_tabs_inner = document.createElement("div");
									ht_p1000_tabs_inner.className = "sHTabsInner";
									ht_p1000_tabs_inner.appendChild(document.createElement("ul"));
									ht_p1000_tabs.appendChild(ht_p1000_tabs_inner);
									ht_body.insertBefore(ht_p1000_tabs, ht_p1000_cont);
								}
								(function(h,t,l){
									t.onclick = function() { 
										document.getElementById("ht_p1000_cont").childNodes[0].innerHTML = h.tekst; 
										for (var _ii=0; _ii < this.parentNode.parentNode.childNodes.length; _ii++) {
											var isthis = 'non-';
											var iin = this.parentNode.parentNode.childNodes[_ii];
											if(iin==this.parentNode) { isthis = '';}
											if(iin.className.substr(0,6) == 'first-'){
												iin.className = 'first-' + isthis + 'current';
											} else if(iin.className.substr(0,5) == 'last-'){
												iin.className = 'last-' + isthis + 'current';
											} else {
												iin.className = isthis + 'current';
											}
										}
									};
									l.appendChild(t);
									l.className = 'non-current';
									if(h.selector=='$$__FAQ__$$') {
										t.innerHTML = "<span>Ofte stilte spørsmål</span>";
										t.href = "#faq";
										t.id = "ht_p1000_cont_faq";
										ht_p1000_tabs.childNodes[0].childNodes[0].appendChild(l);
									}
									else if(h.selector=='$$__HJEM__$$') {
										t.innerHTML = "<span>Velkommen</span>";
										t.href = "#hjem";
										t.id = "ht_p1000_cont_hjem";
										ht_p1000_tabs.childNodes[0].childNodes[0].insertBefore(l, ht_p1000_tabs.childNodes[0].childNodes[0].childNodes[0]);
									}
								}(h,document.createElement("a"),document.createElement("li")));
								//TODO: Fix!!
								continue; //Don't look for me in DOM...
							}
						}
						var o = document.getElementById(h.selector);
						if(o) {
							c++;
							(function(t,h,o){
								t.innerHTML = "?";
								t.className = 'hjelpetekst';
								t.onclick = function () { hjelpetekst(h.tittel, h.tekst, encodeURI(h.video), encodeURI(h.link));};
								t.title = h.tittel + ' (Klikk for hjelp)';
								t.href = "javascript:void(0)"; // This will add me to tabindex.
								o.parentNode.insertBefore(t, o.nextSibbling);							
							}(document.createElement('a'), h, o));
						}
						else {
							console.log("Elementet '" + h.selector + "' finnes ikke i denne visningen, og bør fjernes fra dokumentet.");
						}
					}
					// Fix injected tabs in view 1000
					if(window.hjelpetekstVisParam == 1000) {
						var ht_p1000_tabs2 = document.getElementById("ht_p1000_tabs");
						if(ht_p1000_tabs2) {
							ht_p1000_tabs2.childNodes[0].childNodes[0].lastChild.className = 'last-non-current';
							ht_p1000_tabs2.childNodes[0].childNodes[0].childNodes[0].className = 'first-non-current';
							if(location.hash && document.getElementById("ht_p1000_cont_" + location.hash.substr(1))) {
								document.getElementById("ht_p1000_cont_" + location.hash.substr(1)).onclick();
							} else { 
								ht_p1000_tabs2.childNodes[0].childNodes[0].childNodes[0].childNodes[0].onclick(); 
							}
						}
					}
					console.log("Hjelpetekst.js har lagt inn " + c + " hjelpetekster i denne visningen. Prosessen tok " + (new Date().getTime() - start) + " ms.");
				}
			}
		};
		if(!baseUrl){
			if(location.hostname=='www.kursadmin.org') // PRODUKSJON
				{ baseUrl = "https://storage.googleapis.com/hjelpetekst.appspot.com/h1"; }
			else // DEVELOPMENT
				{ baseUrl = "https://hjelpetekst.appspot.com/json-dev"; }
		}
		window.hjelpetekstVisParam = vis;
		xmlhttp.open("GET", baseUrl + '/' + stf + '-' + vis + '.json', true);
		xmlhttp.send();
		window.hjelpetekst = function(t, i, v, m) { // tittel, innhold, video-link, mer-link
			var o = document.getElementById("hjelpetekst_overlay"), d = document.getElementById("hjelpetekst_dialog"),
				dd = document.createElement("div"), ddd = document.createElement("div"), dddh = document.createElement("h3"), 
				dddhb = document.createElement("button"), dddp = document.createElement("p");
			while(d.firstChild){
				d.removeChild(d.firstChild);
			}
			dddh.textContent = t;
			dddhb.textContent = "×";
			dddhb.title = "Lukk";
			dddhb.onclick = function() { hjelpetekstHide(); };
			dddh.insertBefore(dddhb, dddh.firstChild);
			ddd.appendChild(dddh);
			dddp.textContent = i;
			ddd.appendChild(dddp);
			var dddb;
			if (v) {
				dddb = document.createElement("a");
				dddb.href = v;
				dddb.style.width = "110px";
				dddb.textContent = "Video";
				dddb.onclick = function() { hjelpetekstVideo(this.href); return false; };
				ddd.appendChild(dddb);
			}
			if (m) {
				dddb = document.createElement("a");
				dddb.href = m;
				dddb.target = "_blank";
				dddb.onclick = function() { hjelpetekstHide(); };
				dddb.style.width = "110px";
				dddb.style.cssFloat = "right";
				dddb.textContent = "Les mer";
				ddd.appendChild(dddb);
			}
			var dddx = document.createElement("div");
			dddx.style.clear = "both";
			ddd.appendChild(dddx);
			dd.appendChild(ddd);
			d.appendChild(dd);
			o.style.visibility = "visible";
			d.style.visibility = "visible";
		};
		window.hjelpetekstHide = function() {
			document.getElementById("hjelpetekst_overlay").style.visibility = "hidden";
			var d = document.getElementById("hjelpetekst_dialog");
			while(d.firstChild){
				d.removeChild(d.firstChild);
			}
			d.style.visibility = "hidden";
		};
		window.hjelpetekstVideo = function(vid) {
			var d = document.getElementById("hjelpetekst_dialog").getElementsByTagName("p")[0];
			var vd = document.getElementById("hjelpetekst_dialog").getElementsByTagName("iframe");
			if(vd.length){vd[0].parentNode.removeChild(vd[0]);d.style.display = "block";}
			else{
			d.style.display = "none";
			var v = document.createElement("iframe");
			v.width= 280;
			v.height = 210;
			v.src = vid + "?rel=0&autoplay=1";
			v.setAttribute("frameborder", "0");
			v.setAttribute("allowfullscreen", "");
			d.parentNode.insertBefore(v, d);
			}
		};
		window.hjelpetekstKeyPress = function(e) {
			e = e || window.event;
			if(e.keyCode==27){ hjelpetekstHide(); }
		};
		if(window.addEventListener){
			window.addEventListener("keydown", hjelpetekstKeyPress, false);
		}
		else {
			window.attachEvent("onkeydown", hjelpetekstKeyPress);
		}
	})(window.hjelpetekstStf || document.getElementById("pFlowId").value || "", window.hjelpetekstVis || document.getElementById("pFlowStepId").value || "", window.hjelpetekstUrl || false);