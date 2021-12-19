/*!
 for haxe
*/
if (window.console == null) {
	window.console = {
		log: function() {
			var slice = Array.prototype.slice;
			var args = slice.call(arguments, 0);
			var pinfo = null;
			var p = args[0].split(":");
			if (p.length >= 3) {
				args = slice.call(args, 1);
				if (args.length == 0)
					args = [slice.call(p, 2).join(":")];
				pinfo = {fileName: p[0], lineNumber: p[1] | 0};
			}
			MLog.log(args.length == 1 ? args[0] : args, pinfo);
		}
	}
}
/*!
Event.prototype.target, preventDefault, stopPropagation.(no currentTarget)
*/
if (Object.defineProperty
  && Object.getOwnPropertyDescriptor
  && Object.getOwnPropertyDescriptor(Event.prototype, "target")
  && !Object.getOwnPropertyDescriptor(Event.prototype, "target").get) {
  (function(){
    var target = Object.getOwnPropertyDescriptor(Event.prototype, "srcElement");
    Object.defineProperty(Event.prototype, "target",
     {
       get: function() {
         return target.get.call(this);
       }
     }
    )
  })();
  (function(){
    if (!Event.prototype.preventDefault) {
      Event.prototype.preventDefault=function() {
        this.returnValue=false;
      };
    }
    if (!Event.prototype.stopPropagation) {
      Event.prototype.stopPropagation=function() {
        this.cancelBubble=true;
      };
    }
  })();
}

/*! Date.now */
if (!Date.now) {
	Date.now = function now() { return new Date().getTime(); };
}
