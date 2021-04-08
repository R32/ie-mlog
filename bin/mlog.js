// Generated by Haxe 4.3.0-rc.1
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

;(function (console, $global) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
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
var haxe_Exception = function(message,previous,$native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = $native != null ? $native : this;
};
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
});
var haxe_ValueException = function(value,previous,$native) {
	haxe_Exception.call(this,String(value),previous,$native);
	this.value = value;
};
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
});
var MLog = function() {
	var tmp = dt.h("a",{ title : "close"},"x");
	var tmp1 = dt.h("a",{ title : "clear output"},"c");
	var tmp2 = dt.h("a",{ title : "refresh"},"r");
	var tmp3 = dt.h("input",{ type : "text"});
	var tmp4 = document.createElement("div");
	this.ui = dt.h("div",{ id : "mlog"},[tmp,tmp1,tmp2,tmp3,tmp4]);
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
		_this.ui.style.display = _this.ui.style.display == "none" ? "block" : "none";
		e.preventDefault();
		e.stopPropagation();
	}
};
MLog.toggleBlock = function(a) {
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
MLog.onClick = function(e) {
	e.stopPropagation();
	var a = e.target;
	if(a.tagName != "A") {
		return;
	}
	var ui = MLog.mlog.ui;
	switch(a.innerText) {
	case "c":
		MLog.mlog.clearOutput();
		break;
	case "r":
		window.location.reload();
		break;
	case "x":
		ui.style.display = "none";
		break;
	default:
		MLog.toggleBlock(a);
	}
};
MLog.onInputKeydown = function(e) {
	if(!e.shiftKey) {
		e.stopPropagation();
	}
	if(e.keyCode != 13) {
		return;
	}
	var value = MLog.mlog.ui.children[3].value;
	try {
		var result = (new Function('return ' + value))();
		var li = MLog.mlog.logInner(value,result);
		if(li != null) {
			MLog.mlog.ui.children[4].appendChild(li);
		}
	} catch( _g ) {
		var _g1 = haxe_Exception.caught(_g).unwrap();
		if(value.charCodeAt(0) == 63) {
			MLog.mlog.usage();
		} else if(value == "cls") {
			MLog.mlog.clearOutput();
		} else {
			MLog.mlog.ui.children[4].appendChild(dt.h("li",{ 'class' : "err"},_g1));
			return;
		}
		MLog.mlog.ui.children[3].value = "";
	}
};
MLog.objLabel = function(o) {
	if(o == null) {
		return String(o);
	}
	var ctor = o.constructor;
	if(ctor == null) {
		return Object.prototype.toString.call(o);
	}
	if(ctor.name != null) {
		return ctor.name;
	}
	var s = ctor.toString();
	if(s.charCodeAt(0) == 91) {
		return s;
	}
	return "[" + "object" + "]";
};
MLog.show = function() {
	MLog.mlog.ui.style.display = "block";
};
MLog.log = function(v,infos) {
	var label = MLog.objLabel(v);
	if(infos == null) {
		var node = MLog.mlog.logInner(label,v);
		if(node != null) {
			MLog.mlog.ui.children[4].appendChild(node);
		}
	} else {
		if(infos.customParams != null) {
			infos.customParams.unshift(v);
			v = infos.customParams;
		}
		var node = MLog.mlog.logInner(label,v);
		if(node != null) {
			node.appendChild(dt.h("span",{ 'class' : "pos"},infos.fileName + ":" + infos.lineNumber));
			MLog.mlog.ui.children[4].appendChild(node);
		}
	}
};
MLog.injectCSS = function() {
	var css = "#mlog{position:fixed;display:none;left:10%;right:10%;bottom:0;min-width:600px;border:#999999 1px solid;color:#2f363d;z-index:10;}#mlog>a{position:absolute;display:block;box-sizing:border-box;width:20px;height:20px;line-height:1;color:#666;cursor:pointer;background-color:transparent;border:1px solid #999999;font-family:consolas,monospace;font-size:16px;text-align:center;}#mlog>a:first-child{top:-20px;right:-1px;}#mlog>a[title^=clear]{top:29px;left:-20px;}#mlog>a[title=refresh]{top:-20px;right:18px;}#mlog>input[type=text]{display:block;width:100%;box-sizing:border-box;padding:4px 0;font-family:Arial,sans-serif;color:inherit;font-size:16px;outline:0;}#mlog>input[type=text]::-ms-clear{display:none;}#mlog>div{height:192px;font-family:consolas,monospace;background-color:#efefef;white-space:pre;overflow-y:auto;font-size:14px;list-style:none;}#mlog>div>pre{margin:0;font-family:consolas,monospace;color:#0366d6;}#mlog>div>li{margin:0;padding:0;border:1px #efefef solid;}#mlog>div>li pre{margin:0;padding-left:20px;}#mlog>div>li a{cursor:pointer;color:#0366d6;text-decoration:none;}#mlog>div>li.err{color:#f00;background-color:#ffeded;border-top-color:#da9393;border-bottom-color:#da9393;}#mlog>div span.ct{vertical-align:top;padding:1px 4px;margin-left:2px;background-color:#998fc7;color:#fff;font-size:12px;}#mlog>div span.pos{color:#666;float:right;text-align:right;padding:1px 2px 0 0;font-size:12px;}";
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
	window.MLog = MLog;
};
MLog.prototype = {
	render: function() {
		this.ui.style.display = "none";
		window.document.body.appendChild(this.ui);
		MLog.attach(window.document.documentElement,"keydown",MLog.onShiftF12);
		MLog.attach(this.ui.children[3],"keydown",MLog.onInputKeydown);
		MLog.attach(this.ui,"click",MLog.onClick);
		
			window.$ = function(s) {return document.querySelector(s)}
			window.$$ = function(s) {return document.querySelectorAll(s)}
		;
	}
	,clearOutput: function() {
		this.ui.children[4].innerText = "";
		this.prev = null;
		this.prevCount = 1;
	}
	,usage: function() {
		this.clearOutput();
		var pre = document.createElement("pre");
		pre.innerText = "Mini log[ver:" + "master de26269" + "] for IWebBrowser(Embeded IE)\r\ncls      : clear output\r\n$(\"s\")   : document.querySelector(\"s\")\r\n$" + "(\"s\")  : document.querySelectorAll(\"s\")\r\n";
		this.ui.children[4].appendChild(pre);
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
			var s = String(v);
			this.lines.push(s);
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
			var s = MLog.objLabel(o);
			this.lines.push(s);
			return;
		}
		var keys = Reflect.fields(o);
		if(keys.length == 0 && Object.prototype.toString.call(o) != "[object Object]") {
			var s = String(o);
			this.lines.push(s);
			return;
		}
		keys.sort();
		var size = 0;
		var max = 0;
		var _g = 0;
		var _g1 = keys.length;
		while(_g < _g1) {
			var i = _g++;
			var k = keys[i];
			var v;
			try {
				v = o[k];
			} catch( _g2 ) {
				v = String(haxe_Exception.caught(_g2).unwrap());
			}
			this.parse(v,false);
			size += k.length + this.lines[i].length;
			if(k.length > max) {
				max = k.length;
			}
		}
		if(size <= 80) {
			var _g = 0;
			var _g1 = keys.length;
			while(_g < _g1) {
				var i = _g++;
				this.lines[i] = keys[i] + ": " + this.lines[i];
			}
			this.lines = ["{" + this.lines.join(", ") + "}"];
		} else {
			var _g = 0;
			var _g1 = keys.length;
			while(_g < _g1) {
				var i = _g++;
				this.lines[i] = StringTools.rpad(keys[i]," ",max + 1) + this.lines[i];
			}
		}
	}
	,simple: function() {
		if(this.lines[0] != this.prev || this.ui.children[4].firstChild == null) {
			this.prev = this.lines[0];
			this.prevCount = 1;
			return dt.h("li",null,this.prev);
		}
		var last = this.ui.children[4].lastChild;
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
		return null;
	}
	,multiple: function(expr) {
		this.prev = null;
		return dt.h("li",null,[dt.h("a",null,expr),dt.h("pre",null,this.lines.join("\n"))]);
	}
	,logInner: function(expr,v) {
		this.lines = [];
		this.parse(v,true);
		var li = this.ui.children[4].lastChild;
		if(li != null && li.nodeName == "LI") {
			var a = li.firstChild;
			if(a != null && a.nodeName == "A" && a.style.textDecoration != "underline") {
				MLog.toggleBlock(a);
			}
		}
		if(this.lines.length == 1) {
			return this.simple();
		} else {
			return this.multiple(expr);
		}
	}
};
var dt = function() { };
dt.h = function(name,attr,sub) {
	var dom = window.document.createElement(name);
	if(attr != null) {
		for(var k in attr) dom.setAttribute(k, attr[k]);
	}
	if(sub) {
		dt.hrec(dom,sub,false);
	}
	return dom;
};
dt.hrec = function(box,sub,loop) {
	if(((sub) instanceof Array)) {
		var i = 0;
		var len = sub.length;
		while(i < len) {
			dt.hrec(box,sub[i],true);
			++i;
		}
	} else if(typeof(sub) == "object") {
		box.appendChild(sub);
	} else if(loop) {
		box.appendChild(window.document.createTextNode(sub));
	} else {
		box.textContent = sub;
	}
};
MLog.main();
})(typeof console != "undefined" ? console : {log:function(){}}, {});
