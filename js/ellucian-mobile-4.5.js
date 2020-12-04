//  Copyright (c) 2012-2016 Ellucian. All rights reserved.

if (!window.console) window.console = {log:function () {}};

window.EllucianMobile = (function() {
	internal = {
		_readyFlag: false,
		_callWhenReady: [],
		_isIOsValue: typeof window._isIOsValue != 'undefined' ? window._isIOsValue : undefined,
		_isIOs: function() {
			if (!internal._isIOsValue) {
				var ua = navigator.userAgent
				internal._isIOsValue = ua.search(/applewebkit/i) >= 0 &&
					(ua.search(/iphone/i) >= 0 || ua.search(/ipad/i) >= 0 || ua.search(/ipod/i) >= 0)
			}

			return internal._isIOsValue
		},
		_isReady: function() {
			var result = !internal._isIOs() || internal._readyFlag
			return result
		},
		_call: function(theFunction) {
			if (internal._isReady()) {
				theFunction()
			} else {
				internal._callWhenReady.push(theFunction)
			}
		},
		_ready: function() {
			internal._readyFlag = true
			while (queued = internal._callWhenReady.shift()) {
				queued(internal)
			}
		},
		_log: function(message) {
			typeof EllucianMobileDevice != 'undefined' && EllucianMobileDevice.log(message)
		},
		_openMenu: function(name, type) {
			typeof EllucianMobileDevice != 'undefined' && EllucianMobileDevice.openMenu(name, type)
		},
		_refreshRoles: function() {
			typeof EllucianMobileDevice != 'undefined' && EllucianMobileDevice.refreshRoles()
		},
		_reloadWebModule: function() {
			typeof EllucianMobileDevice != 'undefined' && EllucianMobileDevice.reloadWebModule()
		},
		_primaryColor: function() {
			if (typeof EllucianMobileDevice != 'undefined') {
				return EllucianMobileDevice.primaryColor()
			}
		},
		_accentColor: function() {
			if (typeof EllucianMobileDevice != 'undefined') {
				return EllucianMobileDevice.accentColor()
			}
		},
		_headerTextColor: function() {
			if (typeof EllucianMobileDevice != 'undefined') {
				return EllucianMobileDevice.headerTextColor()
			}
		},
		_subheaderTextColor: function() {
			if (typeof EllucianMobileDevice != 'undefined') {
				return EllucianMobileDevice.subheaderTextColor()
			}
		}
	}

	public = {
		_ellucianMobileInternalReady: function() {
			internal._ready()
		},

		log: function(message) {
			internal._call(function() { internal._log(message) });
		},

		openMenu: function(name, type) {
			internal._call(function() { internal._openMenu(name, type) });
		},

		refreshRoles: function() {
			internal._call(internal._refreshRoles)
		},

		reloadWebModule: function() {
			internal._call(internal._reloadWebModule)
		},

		primaryColor: function() {
			return internal._primaryColor();
		},

		accentColor: function() {
			return internal._accentColor();
		},

		headerTextColor: function() {
			return internal._headerTextColor();
		},

		subheaderTextColor: function() {
			return internal._subheaderTextColor();
		},

		isEmbeddedInEllucianMobile: !(typeof EllucianMobileDevice === 'undefined'),

		addCssToHead: function(css) {
			var head = document.getElementsByTagName('head')[0];
			var s = document.createElement('style');
			s.setAttribute('type', 'text/css');
			if (s.styleSheet) {
				// IE
				s.styleSheet.cssText = css;
			} else {
				s.appendChild(document.createTextNode(css));
			}
			head.appendChild(s);
		},
	}

	return public
})();
