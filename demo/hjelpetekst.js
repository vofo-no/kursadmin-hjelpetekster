(function(stf, vis, baseUrl){
		var xmlhttp;
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange  = function(){
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
			    var stilark = document.createElement('style');
				stilark.innerHTML = "a.hjelpetekst:before{content: \"?\";margin-left: 3px;width: 15px;height: 16px;margin-top: -8px;font-size: 14px;font-weight: bold;line-height: 15px;text-align: center;color: #000;background: #FCE300;-webkit-border-radius: 16px;-moz-border-radius: 16px;border-radius: 16px;display:inline-block;border: 1px solid #000;font-family:arial;padding-right:1px;-webkit-transition-duration: .5s;transition-duration: .5s;}a.hjelpetekst{cursor:pointer;}a.hjelpetekst:hover:before{background-color:orange;}#hjelpetekst_overlay{background:rgba(0,0,0,0.4);display:block;}#hjelpetekst_overlay,#hjelpetekst_dialog{position:fixed;z-index:1000;top:0;left:0;width:100%;height:100%;visibility:hidden;}#hjelpetekst_dialog{display:table;}#hjelpetekst_dialog div{display:table-cell;vertical-align:middle;}#hjelpetekst_dialog div div{width:280px;margin:auto;background-color:#FCE300;font-size:15px;line-height:1.4;padding: 15px;border: 3px solid #000;display:block;z-index:10001;}#hjelpetekst_dialog h3{margin:0;border-bottom: 1px solid #000;padding-bottom: 6px;}#hjelpetekst_dialog h3 a{float:right;margin-left: 4px;}#hjelpetekst_dialog a{text-decoration:none;border: 1px solid #000;background:#fff; padding: 2px 10px; margin: -2px 0; display: inline-block; text-align: center; font-weight: bold; }#hjelpetekst_dialog p, #hjelpetekst_dialog iframe { margin: 10px 0 15px; padding-bottom: 10px; border-bottom: 1px solid #000; height: 210px; }";
				document.body.appendChild(stilark);
				var overlay = document.createElement('div');
				overlay.id = "hjelpetekst_overlay";
				overlay.onclick = function() {hjelpetekstHide();}
				document.body.appendChild(overlay);
				var dialog = document.createElement('div');
				dialog.id = "hjelpetekst_dialog";
				document.body.appendChild(dialog);
				// Javascript function JSON.parse to parse JSON data
				var j = JSON.parse(xmlhttp.responseText);
				function san(s){ return s.replace(/"/g, '&quot;').replace(/'/g, "\\'"); }
				if("hjelp" in j) {
					for (var i = 0; i < j.hjelp.length; i ++) {
						var h = j.hjelp[i];
						var o = document.getElementById(h.id);
						if(o) {
							var t = document.createElement('a');
							t.className = 'hjelpetekst';
							t.href = "javascript:hjelpetekst('" + san(h.tittel) + "', '" + san(h.tekst) + "', '" + encodeURI(h.video) + "','" + encodeURI(h.link) + "')";
							t.title = h.tittel + ' (Klikk for hjelp)';
							o.parentNode.insertBefore(t, o.nextSibbling);
						}
					}
				}
			}
		}
		xmlhttp.open("GET", baseUrl + '/' + stf + '-' + vis + '.json', true);
		xmlhttp.send();
		window.hjelpetekst = function(t, i, v, m) { // tittel, innhold, video-link, mer-link
			var o = document.getElementById("hjelpetekst_overlay");
			var d = document.getElementById("hjelpetekst_dialog");
			var btns = '';
			if (v) { btns = '<a href="javascript:hjelpetekstVideo(\'' + v + '\')" style="width: 110px">Video</a> '; }
			if (m) { btns = '<a href="' + m + '" target="_blank" style="width: 110px;float:right;">Les mer</a>' + btns; }
			d.innerHTML = "<div><div><h3><a href=\"javascript:hjelpetekstHide();\">X</a> " + t + "</h3><p>" + i + "</p>" + btns + "</div></div>";
			o.style.visibility = "visible";
			d.style.visibility = "visible";
		}
		window.hjelpetekstHide = function() {
			document.getElementById("hjelpetekst_overlay").style.visibility = "hidden";document.getElementById("hjelpetekst_dialog").innerHTML = "";
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
	})(hjelpetekstStf, hjelpetekstVis, ".");