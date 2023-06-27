//! for haxe
if (window.console == null) {
	window.console = {
		log: function() {
			var slice = Array.prototype.slice;
			var args = slice.call(arguments, 0);
			var pinfo = null;
			if (typeof(args[0]) == "string") {
				var p = args[0].split(":");
				if (p.length >= 3) {
					args = slice.call(args, 1);
					if (args.length == 0)
						args = [slice.call(p, 2).join(":")];
					pinfo = {fileName: p[0], lineNumber: p[1] | 0};
				}
			}
			MLog.log(args.length == 1 ? args[0] : args, pinfo);
		}
	}
}
//! polyfill : target, stopPropagation, preventDefault
if (typeof(Event) == "object" && Object.defineProperty) {
	var proto = Event.prototype;
	var tar = Object.getOwnPropertyDescriptor(proto, "target");
	if (!(tar && tar.get)) {
		Object.defineProperty(proto, "target", {
			get : function() {
				return this.srcElement
			}
		})
	}
	if (!proto.stopPropagation) {
		proto.stopPropagation = function() {
			this.cancelBubble = true;
		}
	}
	if (!proto.preventDefault) {
		proto.preventDefault = function() {
			this.returnValue = false;
		}
	}
	proto = tar = null;
}
