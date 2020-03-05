package mlog;

import Nvd.HXX;
import js.html.DOMElement;
import js.Browser.window;
import js.Browser.document;

/**
 Press "shift + F12" to lanuch.
*/
@:native("MLog")
class MLog {

	var root : DOMElement;

	var lines : Array<String>;

	var close(get, never) : js.html.LinkElement;

	var clear(get, never) : js.html.LinkElement;

	var input(get, never): js.html.InputElement;

	var output(get, never): js.html.DivElement;

	inline function get_close() return cast root.children[0]; // BEWARE, if the template is modified.

	inline function get_clear() return cast root.children[1];

	inline function get_input() return cast root.children[2];

	inline function get_output() return cast root.children[3];

	inline function OUT(e : js.html.Node) output.appendChild(e);

	inline function PUSH(s) lines.push(s);

	inline function isSingle() return lines.length == 1;

	public function new() {
		root = HXX(
			<div id="mlog">
				<a>x</a>
				<a title="clear output">C</a>
				<input type="text">
				<div></div>
			</div>
		);
	}

	function render() {
		root.style.display = "none";
		document.body.appendChild(root);
		attach(document.documentElement, "keydown", onShiftF12);
		attach(input, "keydown", onInputKeydown);
		attach(output, "click", onLinkClick);
		attach(close, "click", onClose);
		attach(clear, "click", onClear);
		js.Syntax.code("
			window.$ = function(s) {return document.querySelector(s)}
			window.$$ = function(s) {return document.querySelectorAll(s)}
		");
	}

	function clearOutput() {
		output.textContent = "";
		prev = null;
		prevCount = 1;
	}

	inline function clearInput() input.value = "";

	inline function toggle() root.style.display = root.style.display == "none" ? "block" : "none";

	function usage() {
		this.clearOutput();
		OUT( HXX(
<pre>Mini log[ver:{{Macros.gitVersion()}}] for IWebBrowser(Embeded IE)
cls      : clear output
$("s")   : document.querySelector("s")
$$("s")  : document.querySelectorAll("s")
</pre>
		));
	}
	function parse(v : Dynamic, first : Bool ) {
		switch( js.Syntax.typeof(v) ) {
		case "string":
			PUSH('"' + v +'"');
		case "object" if (v != null):
			if (js.Syntax.instanceof(v, Array))
				s_array(v, first);
			else
				s_object(v, first);
		case "function":
			PUSH("[" + "function" + "]");
		default:
			PUSH((cast String)(v));
		}
	}
	function s_array(a : Array<Dynamic>, rec : Bool) {
		if(!rec)
			return PUSH("[" + (a.length == 0 ? "" : "array") + "]");
		var i = 0;
		var len = a.length;
		var size = 0;
		while (i < len) {
			parse(a[i], false);      // PUSH a value
			size += lines[i].length; // String.length
			++ i;
		}
		if (size <= 80) {
			lines = ['(${i}) [${ lines.join(", ") }]'];
		} else {
			i = 0;
			while (i < len) {
				lines[i] = '[${i}]' + "  " + lines[i];
				++ i;
			}
		}
	}
	function s_object(o : haxe.DynamicAccess<Dynamic>, rec : Bool) {
		if (!rec)
			return PUSH(objLabel(o));
		var keys = o.keys();
		if (keys.length == 0 && js.lib.Object.prototype.toString.call(o) != "[object Object]")
			return PUSH((cast String)(o)); // Date, RegExp
		(cast keys).sort(); // the origin sort of js
		var size = 0;
		var max = 0;
		for (i in 0...keys.length) {
			var k = keys[i];
			var v = try o[k] catch(e:Dynamic) (cast String)(e); // access may denied
			parse(v, false);
			size += k.length + (lines[i]).length;
			if (k.length > max)
				max = k.length;
		}
		if (size <= 80) {
			for (i in 0...keys.length)
				lines[i] = keys[i] + ": " + lines[i];
			lines = ['{${lines.join(", ")}}'];
		} else {
			for (i in 0...keys.length)
				lines[i] = StringTools.rpad(keys[i], " ", max + 1) + lines[i];
		}
	}

	var prev : Dynamic;
	var prevCount : Int;

	inline function clearPrev() prev = null;

	function simple() {
		if (lines[0] != prev || output.firstChild == null) {
			prev = lines[0];
			prevCount = 1;
			return HXX(<li>{{prev}}</li>);
		}
		var last = output.lastChild;
		++ prevCount;
		if (last.nodeType == TElement) { //
			var conter = (cast last).querySelector(".ct");
			if (conter == null) {
				conter = HXX(<span class="ct"></span>);
				last.appendChild(conter);
			}
			conter.textContent = "" + prevCount;
		} else if (last.nodeType == TText) {
			last.nodeValue = prev + "  " + "(" + prevCount + ")";
		}
		return null;
	}

	function multiple(expr : String) {
		clearPrev();
		return HXX(<li>
			<a>{{ expr }}</a>
			<pre>{{ lines.join("\n") }}</pre>
		</li>);
	}

	function logInner(expr : String, v : Dynamic) {
		this.lines = [];
		parse(v, true);
		// collapse
		var li : DOMElement = cast output.lastChild;
		if (li != null && li.nodeName == "LI") {
			var a = li.firstChild;
			if (a != null && a.nodeName == "A" && (cast a).style.textDecoration != "underline")
				toggleBlock(cast a);
		}
		return this.isSingle() ? simple() : multiple(expr);
	}

	static function attach(obj: js.html.EventTarget, type: String, handler : haxe.Constraints.Function) {
		if (obj.addEventListener != null)
			obj.addEventListener(type, handler);
		else
			(cast obj).attachEvent("on" + type, handler);
	}

	static function detach(obj: js.html.EventTarget, type: String, handler : haxe.Constraints.Function) {
		if (obj.addEventListener != null)
			obj.removeEventListener(type, handler);
		else
			(cast obj).detachEvent("on" + type, handler);
	}

	static function onShiftF12(e: js.html.KeyboardEvent) {
		if (e.shiftKey && e.keyCode == js.html.KeyEvent.DOM_VK_F12) {
			mlog.toggle();
			e.preventDefault();
			e.stopPropagation();
		}
	}

	static function toggleBlock(a : DOMElement){
		var ul:Dynamic = a.nextSibling;
		while (ul.nodeType != TElement)
			ul = ul.nextSibling;
		// IE8 doesn't support the changes on css sibling(e.g: a.hidden + ul {display:none} ).
		if (ul.style.display == "none") {
			ul.style.display = "block";
			a.style.textDecoration = "none";
		} else {
			ul.style.display = "none";
			a.style.textDecoration = "underline";
		}
	}

	static function onLinkClick(e : js.html.MouseEvent){
		e.stopPropagation();
		var a : DOMElement = cast e.target;
		if (a.nodeName == "A")
			toggleBlock(a);
	}

	static function onClose( e : js.html.MouseEvent ) {
		var a : DOMElement = cast e.target;
		a.parentElement.style.display = "none";
		e.stopPropagation();
	}

	static function onClear( e : js.html.MouseEvent ) {
		e.stopPropagation();
		mlog.clearOutput();
	}

	static function onContextMenu(e : js.html.MouseEvent) {
		// TODO: clear console
	}

	static function onInputKeydown(e: js.html.KeyboardEvent) {
		if (!e.shiftKey) // bubbling to document for shift + F12
			e.stopPropagation();
		if (e.keyCode != js.html.KeyEvent.DOM_VK_RETURN)
			return;
		var value = mlog.input.value;
		try {
			var result = js.Syntax.code("(new Function('return ' + {0}))()", value);
			var li = mlog.logInner(value, result);
			if (li != null)
				mlog.OUT(li);
		} catch (e : Dynamic) {
			if (StringTools.fastCodeAt(value, 0) == "?".code) {
				mlog.usage();
			} else if (value == "cls") {
				mlog.clearOutput();
			} else {
				return mlog.OUT(HXX(<li class="err">{{e}}</li>));
			}
			mlog.clearInput();
		}
	}

	static function objLabel(o : Dynamic) : String {
		var ctor = o.constructor;
		if (ctor == null)
			return js.lib.Object.prototype.toString.call(o);
		if (ctor.name != null)
			return ctor.name;
		var s = ctor.toString();
		if (StringTools.fastCodeAt(s, 0) == "[".code)
			return s;
		return "[" + "object" +"]";
	}

	static function log(v:Dynamic, ?infos:haxe.PosInfos) {
		var label = objLabel(v);
		if (infos == null) {
			var node = mlog.logInner(label, v);
			if (node != null)
				mlog.OUT(node);
		} else {
			if (infos.customParams != null) {
				infos.customParams.unshift(v);
				v = infos.customParams;
			}
			var node = mlog.logInner(label, v);
			if (node != null) {
				node.appendChild(HXX(<span class="pos">{{ infos.fileName }}:{{ infos.lineNumber }}</span>));
				mlog.OUT(node);
			}
		}
	}

	// don't do inline here since https://github.com/HaxeFoundation/haxe/issues/6197
	@:analyzer(no_const_propagation) static function injectCSS() {
		var css = Macros.buildHSS("mlog/style.hss");
		one("head").appendChild( HXX(<style type="text/css">{{css}}</style>) );
	}

	static inline function one(s : String) return document.querySelector(s);

	@:keep static var mlog : MLog;

	static function main() {
		injectCSS();
		mlog = new MLog();
		mlog.render();
		haxe.Log.trace = log;
	}
}

extern enum abstract NodeType(Int) to Int {
	var TElement = 1;
	var TText    = 3;
}
