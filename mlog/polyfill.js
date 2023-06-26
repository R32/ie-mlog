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
//! reverse polyfill : srcElement, cancelBubble, returnValue
if (typeof(Event) == "object" && Object.defineProperty) {
	var proto = Event.prototype;
	var tar = Object.getOwnPropertyDescriptor(proto, "srcElement");
	if (!(tar && tar.get)) {
		//console.log("srcElement");
		Object.defineProperty(proto, "srcElement", {
			get : function() {
				return this.target
			}
		})
	}
	var bubble = Object.getOwnPropertyDescriptor(proto, "cancelBubble")
	if (proto.stopPropagation && !(bubble && bubble.set)) {
		//console.log("cancelBubble");
		Object.defineProperty(proto, "cancelBubble", {
			set : function(_) {
				this.stopPropagation();
			},
		})
	}
	var halt = Object.getOwnPropertyDescriptor(proto, "returnValue")
	if (proto.preventDefault && !(halt && halt.set)) {
		//console.log("returnValue");
		Object.defineProperty(proto, "returnValue", {
			set : function(_) {
				this.preventDefault();
			},
		})
	}
}
