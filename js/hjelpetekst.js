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
				stilark.innerHTML = "a.hjelpetekst{font-size:16px;font-family:sans-serif;vertical-align:middle;font-weight:700;text-align:center;line-height:1.2;display:inline-block;width:2ex;height:2ex;border-radius:1ex;color:#000;background:#FCE300;border:1px solid #000;text-decoration:none;transition-duration:.5s;-moz-border-radius:1ex;-webkit-border-radius:1ex;-webkit-transition-duration:.5s;cursor:pointer;margin:-1ex .5ex;}a.hjelpetekst:hover{background:orange;color:#000;text-decoration:none;}#hjelpetekst_overlay{background:rgba(0,0,0,0.4);display:block;}#hjelpetekst_overlay,#hjelpetekst_dialog{font-family:sans-serif;font-size:15px;line-height:21px;color:#000;height:100%;left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:1000;}#hjelpetekst_dialog{display:table;}#hjelpetekst_dialog div{display:table-cell;vertical-align:middle;}#hjelpetekst_dialog div div{box-sizing:content-box;background-color:#FCE300;border:3px solid #000;display:block;font-size:15px;line-height:1.4;margin:auto;padding:15px;width:280px;z-index:10001;}#hjelpetekst_dialog h3{font-family:sans-serif;font-size:18px;line-height:25px;border-bottom:1px solid #000;margin:0;padding-bottom:6px;font-weight:700;}#hjelpetekst_dialog h3 button{float:right;margin-left:4px;font-size:20px;}#hjelpetekst_dialog a,#hjelpetekst_dialog button{box-sizing:content-box;background:#fff;border:1px solid #000;color:#000;font-size:15px;line-height:21px;display:inline-block;font-weight:700;margin:-2px 0;padding:2px 10px;text-align:center;text-decoration:none;}#hjelpetekst_dialog p,#hjelpetekst_dialog iframe{box-sizing:content-box;border-bottom:1px solid #000;height:210px;margin:10px 0 15px;padding-bottom:10px;}";
				document.body.appendChild(stilark);
				var overlay = document.createElement('div');
				overlay.id = "hjelpetekst_overlay";
				overlay.onclick = function() {hjelpetekstHide();}
				document.body.appendChild(overlay);
				var dialog = document.createElement('div');
				dialog.id = "hjelpetekst_dialog";
				document.body.appendChild(dialog);
				// Javascript function JSON.parse to parse JSON data
				var j = JSON.parse(xmlhttp.responseText), c = 0;
				if("hjelp" in j) {
					for (var i = 0; i < j.hjelp.length; i ++) {
						var h = j.hjelp[i];
						var o = document.getElementById(h.selector);
						if(o) {
							c++;
							(function(t,h,o){
								t.innerHTML = "?";
								t.className = 'hjelpetekst';
								t.onclick = function () { hjelpetekst(h.tittel, h.tekst, encodeURI(h.video), encodeURI(h.link));}
								t.title = h.tittel + ' (Klikk for hjelp)';
								o.parentNode.insertBefore(t, o.nextSibbling);							
							}(document.createElement('a'), h, o));
						}
						else {
							console.log("Elementet '" + h.selector + "' finnes ikke i denne visningen, og bør fjernes fra dokumentet.");
						}
					}
					console.log("Hjelpetekst.js har lagt inn " + c + " hjelpetekster i denne visningen. Prosessen tok " + (new Date().getTime() - start) + " ms.");
				}
			}
		}
		if(!baseUrl){
			if(location.hostname=='www.kursadmin.org') // PRODUKSJON
				{ baseUrl = "https://storage.googleapis.com/hjelpetekst.appspot.com/h1"; }
			else // DEVELOPMENT
				{ baseUrl = "https://hjelpetekst.appspot.com/json-dev"; }
		}
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
			dddhb.textContent = "X";
			dddhb.title = "Lukk";
			dddhb.onclick = function() { hjelpetekstHide(); }
			dddh.insertBefore(dddhb, dddh.firstChild);
			ddd.appendChild(dddh);
			dddp.textContent = i;
			ddd.appendChild(dddp);
			if (v) {
				var dddb = document.createElement("a");
				dddb.href = v;
				dddb.style.width = "110px";
				dddb.textContent = "Video";
				dddb.onclick = function() { hjelpetekstVideo(this.href); return false; }
				ddd.appendChild(dddb);
			}
			if (m) {
				var dddb = document.createElement("a");
				dddb.href = m;
				dddb.target = "_blank";
				dddb.onclick = function() { hjelpetekstHide(); }
				dddb.style.width = "110px";
				dddb.style.cssFloat = "right";
				dddb.textContent = "Les mer";
				ddd.appendChild(dddb);
			}
			dd.appendChild(ddd);
			d.appendChild(dd);
			o.style.visibility = "visible";
			d.style.visibility = "visible";
		}
		window.hjelpetekstHide = function() {
			document.getElementById("hjelpetekst_overlay").style.visibility = "hidden";
			var d = document.getElementById("hjelpetekst_dialog");
			while(d.firstChild){
				d.removeChild(d.firstChild);
			}
		}
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
		}
	})(window.hjelpetekstStf || document.getElementById("pFlowId").value || "", window.hjelpetekstVis || document.getElementById("pFlowStepId").value || "", window.hjelpetekstUrl || false);