mini log
------

[usage](bin/index.html) Press `Shift + F12` to switch On/Off.

```bash
Mini log[ver:{{Macros.gitVersion()}}] for IWebBrowser(Embeded IE)
cls      : clear output
$("s")   : document.querySelector("s")
$$("s")  : document.querySelectorAll("s")
```

### Configuration for haxe projects

installs from git repo

```bash
git clone https://github.com/R32/ie-mlog.git ie-mlog
haxelib dev ie-mlog ie-mlog
```

HTML : put mlog.js before your main.js

```html
<body>
	<!-- others... -->
	<script src="mlog.js"></script>
	<script src="main.js"></script>
</body>
```

haxe

```haxe
class Main {
	static function main() {
		haxe.Log.trace = MLog.log;
		trace("hello world!");
	}
}
```