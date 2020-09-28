package mlog;

#if macro
using haxe.io.Path;
import sys.io.File;
import sys.FileSystem;
import haxe.macro.Expr;
import haxe.macro.Context;

typedef CData = {
	css : String,
	ver : String,  // git version
}
#end

class Macros {

#if macro
	@:persistent static var data : CData = {css: null, ver: null};

	static function repoDir(dir:String):String{
		var exist = false;
		var prev = "";
		var ret;
		do {
			ret = FileSystem.fullPath(dir);
			exist = FileSystem.exists(ret + "/.git");
			if (exist)
				break;
			if (ret == prev) // disk root
				throw "can not found git repo;";
			prev = ret;
			dir += "/..";
		} while (true);
		return ret;
	}

	static function mtime(file) : Float {
		if (sys.FileSystem.exists(file))
			return sys.FileSystem.stat(file).mtime.getTime();
		return 0.;
	}
#end
	macro public static function buildHSS(path : String) {
		var args = ["--minify", "-output", "bin/", path];
		var output = "bin/" + path.withoutExtension().withoutDirectory() + ".css";
		var outdate = mtime(output) < mtime(path);
		if (data.css == null || outdate) {
			if (outdate) {
				var proc = new sys.io.Process("hss", args);
				if (proc.exitCode() != 0)
					Context.fatalError(proc.stderr.readAll().toString(), Context.currentPos());
				proc.close();
			}
			data.css = sys.io.File.getContent(output);
			Context.registerModuleDependency(Context.getLocalModule(), path);
		}
		return macro $v{data.css};
	}

	macro public static function gitVersion() {
		if (data.ver != null)
			return macro $v{data.ver};
		try {
			var dir = repoDir(".");
			dir += "/.git";
			var ref = File.getContent(dir + "/HEAD").split("\n")[0].split(": ")[1];
			var hash = File.getContent(dir + "/" + ref);
			var branch = ref.split("/")[2]; // refs/heads/master
			data.ver = branch + " " + hash.substr(0, 7);
		} catch(e:Dynamic) {
			data.ver = "0.1.0"; // if downloaded by zip
		}
		return macro $v{data.ver};
	}

	macro static public function display(node) return macro ($node : js.html.DOMElement).style.display;
	macro static public function text(node) return macro ($node : js.html.DOMElement).innerText;
}