chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.kursadmin.org', schemes: ['https'] },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'test.senitel.no', schemes: ['http'] },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    code: 'htfid = function(i){prompt("Vi har funnet dette objekt-id, kanskje det passer.", i);};var a = document.activeElement;if(a.id){htfid(a.id)}else{b=a.nextSibling;if(b){while(b.nodeType!=1&&b!=a){if(b.id){htfid(b.id);b=a;}else{b=b.nextSibling}}}if(b!=a){b=a.parentNode;if(a.parentNode.id){htfid(a.parentNode.id);}else if(a.parentNode.parentNode.id){htfid(a.parentNode.parentNode.id);}else{alert("Fant ingen objekt-id.")}}}'
  });
});