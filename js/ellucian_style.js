// css overrides to be injected when embedded in Ellucian Mobile
if (EllucianMobile.isEmbeddedInEllucianMobile) {
	var css = '\
		header {\
			display: none;\
		}\
		footer {\
			display: none;\
		}\
		'
	EllucianMobile.addCssToHead(css)
}