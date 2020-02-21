// Generated by Haxe 4.1.0-rc.1
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

/*!
  Source: Eli Grey @ http://eligrey.com/blog/post/textcontent-in-ie8
*/
if (Object.defineProperty
  && Object.getOwnPropertyDescriptor
  && Object.getOwnPropertyDescriptor(Element.prototype, "textContent")
  && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
	(function() {
		var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");

		Object.defineProperty(Element.prototype, "textContent",
		  { // It won't work if you just drop in innerText.get
			// and innerText.set or the whole descriptor.
			get : function() {
			  return innerText.get.call(this)
			},
			set : function(x) {
			  return innerText.set.call(this, x)
			}
		  }
		);
	})();
}

/*! Date.now */
if (!Date.now) {
	Date.now = function now() { return new Date().getTime(); };
}

;var $global = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
var console = $global.console || {log:function(){}};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var MLog = function() {
	this.root = dt.h("div",{ id : "mlog"},[dt.h("input",{ type : "text"}),dt.h("div")]);
};
MLog.attach = function(obj,type,handler) {
	if(obj.addEventListener != null) {
		obj.addEventListener(type,handler);
	} else {
		obj.attachEvent("on" + type,handler);
	}
};
MLog.onShiftF12 = function(e) {
	if(e.shiftKey && e.keyCode == 123) {
		var _this = MLog.mlog;
		_this.root.style.display = _this.root.style.display == "none" ? "block" : "none";
		e.preventDefault();
		e.stopPropagation();
	}
};
MLog.onLinkClick = function(e) {
	e.stopPropagation();
	var a = e.target;
	if(a.nodeName != "A") {
		return;
	}
	var ul = a.nextSibling;
	while(ul.nodeType != 1) ul = ul.nextSibling;
	if(ul.style.display == "none") {
		ul.style.display = "block";
		a.style.textDecoration = "none";
	} else {
		ul.style.display = "none";
		a.style.textDecoration = "underline";
	}
};
MLog.onInputKeydown = function(e) {
	if(!e.shiftKey) {
		e.stopPropagation();
	}
	if(e.keyCode != 13) {
		return;
	}
	var value = MLog.mlog.root.children[0].value;
	try {
		var result = (new Function('return ' + value))();
		MLog.mlog.logInner(value,result);
	} catch( e1 ) {
		var e2 = ((e1) instanceof js__$Boot_HaxeError) ? e1.val : e1;
		if(value.charCodeAt(0) == 63) {
			MLog.mlog.usage();
		} else if(value == "cls") {
			var _this = MLog.mlog;
			_this.root.children[1].textContent = "";
			_this.prev = null;
			_this.prevCount = 1;
		} else {
			MLog.mlog.errInner(e2);
			return;
		}
		MLog.mlog.root.children[0].value = "";
	}
};
MLog.log = function(v,infos) {
	var node = dt.h("li",null,v);
	if(infos != null) {
		node.appendChild(dt.h("span",{ 'class' : "pos"},infos.fileName + ":" + infos.lineNumber));
	}
	MLog.mlog.root.children[1].appendChild(node);
};
MLog.injectCSS = function() {
	var css = "#mlog{position:fixed;display:block;left:10%;right:10%;bottom:0;min-width:600px;border:#999999 1px solid;color:#2f363d;}#mlog>input[type=text]{display:block;width:100%;box-sizing:border-box;padding:4px 0;font-family:Arial,sans-serif;color:inherit;font-size:16px;}#mlog>div{height:192px;font-family:consolas,monospace;background-color:#efefef;white-space:pre;overflow-y:auto;font-size:14px;list-style:none;}#mlog>div>pre{margin:0;font-family:consolas,monospace;color:#0366d6;}#mlog>div>li{margin:0;padding:0;border:1px #efefef solid;}#mlog>div>li ul{list-style:none;margin:0;padding:0;}#mlog>div>li ul li{padding-left:20px;}#mlog>div>li a{cursor:pointer;color:#0366d6;text-decoration:none;}#mlog>div>li.err{color:#f00;background-color:#ffeded;border-top-color:#da9393;border-bottom-color:#da9393;}#mlog>div span.ct{vertical-align:top;padding:1px 4px;margin-left:2px;background-color:#998fc7;color:#fff;font-size:12px;}#mlog>div span.pos{color:#666;float:right;text-align:right;padding:1px 2px 0 0;font-size:12px;}";
	var tmp = window.document.querySelector("head");
	var n = dt.h("style",{ type : "text/css"});
	if(n.styleSheet) {
		n.styleSheet.cssText = css;
	} else {
		n.textContent = css;
	}
	tmp.appendChild(n);
};
MLog.main = function() {
	MLog.injectCSS();
	MLog.mlog = new MLog();
	MLog.mlog.render();
	haxe_Log.trace = MLog.log;
};
MLog.prototype = {
	render: function() {
		window.document.body.appendChild(this.root);
		MLog.attach(window.document.documentElement,"keydown",MLog.onShiftF12);
		MLog.attach(this.root.children[0],"keydown",MLog.onInputKeydown);
		MLog.attach(this.root.children[1],"click",MLog.onLinkClick);
		
			window.$ = function(s) {return document.querySelector(s)}
			window.$$ = function(s) {return document.querySelectorAll(s)}
		;
	}
	,usage: function() {
		this.root.children[1].textContent = "";
		this.prev = null;
		this.prevCount = 1;
		this.root.children[1].appendChild(dt.h("pre",null,"Mini log[ver:" + "master 880e1b2" + "] for IWebBrowser(Embeded IE)\r\ncls      : clear output\r\n$(\"s\")   : document.querySelector(\"s\")\r\n$$(\"s\")  : document.querySelectorAll(\"s\")\r\n"));
	}
	,parse: function(v,first) {
		switch(typeof(v)) {
		case "function":
			this.lines.push("[" + "function" + "]");
			break;
		case "object":
			if(v != null) {
				if(((v) instanceof Array)) {
					this.s_array(v,first);
				} else {
					this.s_object(v,first);
				}
			} else {
				var s = String(v);
				this.lines.push(s);
			}
			break;
		case "string":
			this.lines.push("\"" + Std.string(v) + "\"");
			break;
		default:
			var s1 = String(v);
			this.lines.push(s1);
		}
	}
	,s_array: function(a,rec) {
		if(!rec) {
			this.lines.push("[" + (a.length == 0 ? "" : "array") + "]");
			return;
		}
		var i = 0;
		var len = a.length;
		var size = 0;
		while(i < len) {
			this.parse(a[i],false);
			size += this.lines[i].length;
			++i;
		}
		if(size <= 80) {
			this.lines = ["(" + i + ") [" + this.lines.join(", ") + "]"];
		} else {
			i = 0;
			while(i < len) {
				this.lines[i] = "[" + i + "]" + "  " + this.lines[i];
				++i;
			}
		}
	}
	,s_object: function(o,rec) {
		if(!rec) {
			this.lines.push("[" + "object" + "]");
			return;
		}
		var max = 0;
		var keys = Reflect.fields(o);
		keys.sort();
		var _g = 0;
		while(_g < keys.length) {
			var k = keys[_g];
			++_g;
			if(k.length > max) {
				max = k.length;
			}
		}
		var size = 0;
		var _g1 = 0;
		var _g2 = keys.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var k1 = keys[i];
			this.parse(o[k1],false);
			size += k1.length + this.lines[i].length;
		}
		if(size <= 80) {
			var _g3 = 0;
			var _g4 = keys.length;
			while(_g3 < _g4) {
				var i1 = _g3++;
				this.lines[i1] = keys[i1] + ": " + this.lines[i1];
			}
			this.lines = ["{ " + this.lines.join(", ") + " }"];
		} else {
			var _g31 = 0;
			var _g41 = keys.length;
			while(_g31 < _g41) {
				var i2 = _g31++;
				this.lines[i2] = StringTools.rpad(keys[i2]," ",max + 1) + this.lines[i2];
			}
		}
	}
	,simple: function() {
		if(this.lines[0] != this.prev || this.root.children[1].firstChild == null) {
			this.prev = this.lines[0];
			this.prevCount = 1;
			this.root.children[1].appendChild(dt.h("li",null,this.prev));
			return;
		}
		var last = this.root.children[1].lastChild;
		++this.prevCount;
		if(last.nodeType == 1) {
			var conter = last.querySelector(".ct");
			if(conter == null) {
				conter = dt.h("span",{ 'class' : "ct"});
				last.appendChild(conter);
			}
			conter.textContent = "" + this.prevCount;
		} else if(last.nodeType == 3) {
			last.nodeValue = Std.string(this.prev) + "  " + "(" + this.prevCount + ")";
		}
	}
	,multiple: function(expr) {
		this.prev = null;
		this.prevCount = 1;
		var frag = window.document.createDocumentFragment();
		var _g = 0;
		var _g1 = this.lines;
		while(_g < _g1.length) frag.appendChild(dt.h("li",null,_g1[_g++]));
		var li = dt.h("li",null,[dt.h("a",null,expr),dt.h("ul")]);
		li.querySelector("ul").appendChild(frag);
		this.root.children[1].appendChild(li);
	}
	,logInner: function(expr,v) {
		this.lines = [];
		this.parse(v,true);
		if(this.lines.length == 1) {
			this.simple();
		} else {
			this.multiple(expr);
		}
	}
	,errInner: function(v) {
		this.root.children[1].appendChild(dt.h("li",{ 'class' : "err"},v));
	}
};
var Reflect = function() { };
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
var Std = function() { };
Std.string = function(s) {
	return String(s);
};
var StringTools = function() { };
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	var buf_b = "";
	buf_b = "" + (s == null ? "null" : "" + s);
	while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
	return buf_b;
};
var haxe_Log = function() { };
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) str += ", " + Std.string(_g1[_g++]);
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var dt = function() { };
dt.h = function(name,attr,dyn) {
	var dom = window.document.createElement(name);
	if(attr != null) {
		for(var k in attr) dom.setAttribute(k, attr[k]);
	}
	if(dyn != null) {
		if(((dyn) instanceof Array)) {
			var i = 0;
			while(i < dyn.length) {
				var v = dyn[i];
				if(typeof(v) == "string") {
					dom.appendChild(window.document.createTextNode(v));
				} else {
					dom.appendChild(v);
				}
				++i;
			}
		} else {
			dom.textContent = dyn;
		}
	}
	return dom;
};
try{Object.defineProperty(js__$Boot_HaxeError.prototype, "message", {get: function(){return String(this.val)}})}catch(e){}
MLog.main();