(function(doc, win) {
	var docEl = doc.documentElement,
	  resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	  recalc = function() {
		var clientWidth = docEl.clientWidth;
		if (clientWidth >= 1320) {
		  clientWidth = 1320;
		};
		if (!clientWidth) return;
		docEl.style.fontSize = 100 * (clientWidth / 1320) + 'px';
	  };
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window);