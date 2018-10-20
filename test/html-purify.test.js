'use strict';

const mock = require('egg-mock');
const { assert } = require('egg-mock/bootstrap');

describe('it/html-purify.it.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should have app.purify', () => {
    assert(app.purify);
  });

  it('should have ctx.purify', () => {
    const ctx = app.mockContext();
    assert(ctx.purify);
  });

  it('html5sec #1', () => {
    const input = '<form id="it"></form><button form="it" formaction="javascript:alert(1)">X</button>';
    const output = '<form id="it"></form><button form="it" formaction="x-javascript:alert(1)">X</button>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #2', () => {
    const input = '<meta charset="x-imap4-modified-utf7">&ADz&AGn&AG0&AEf&ACA&AHM&AHI&AGO&AD0&AGn&ACA&AG8Abg&AGUAcgByAG8AcgA9AGEAbABlAHIAdAAoADEAKQ&ACAAPABi';
    const output = '<meta charset="x-imap4-modified-utf7" />&ADz&AGn&AG0&AEf&ACA&AHM&AHI&AGO&AD0&AGn&ACA&AG8Abg&AGUAcgByAG8AcgA9AGEAbABlAHIAdAAoADEAKQ&ACAAPABi';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #3', () => {
    const input = '<meta charset="x-imap4-modified-utf7">&<script&S1&TS&1>alert&A7&(1)&R&UA;&&<&A9&11/script&X&>';
    const output = '<meta charset="x-imap4-modified-utf7" />&alert&A7&(1)&R&UA;&&&lt;&A9&11/script&X&>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #4', () => {
    const input = "0?<script>Worker(\"#\").onmessage=function(_)eval(_.data)</script> :postMessage(importScripts(\'data:;base64,cG9zdE1lc3NhZ2UoJ2FsZXJ0KDEpJyk\'))";
    const output = "0? :postMessage(importScripts(\'data:;base64,cG9zdE1lc3NhZ2UoJ2FsZXJ0KDEpJyk\'))";
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #5', () => {
    const input = "<script>crypto.generateCRMFRequest(\'CN=0\',0,0,null,\'alert(1)\',384,null,\'rsa-dual-use\')</script>";
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #6', () => {
    const input = '<script>({set/**/$($){_/**/setter=$,_=1}}).$=alert</script>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #7', () => {
    const input = '<input onfocus=write(1) autofocus>';
    const output = '<input autofocus />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #8', () => {
    const input = '<input onblur=write(1) autofocus><input autofocus>';
    const output = '<input autofocus /><input autofocus />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #9', () => {
    const input = "<a style=\"-o-link:\'javascript:alert(1)\';-o-link-source:current\">X</a>";
    const output = "<a style=\"-o-link:\'javascript:alert(1)\';-o-link-source:current\">X</a>";
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #10', () => {
    const input = '<video poster=javascript:alert(1)//></video>';
    const output = '<video poster="x-javascript:alert(1)//"></video>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #11', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg"><g onload="javascript:alert(1)"></g></svg>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #12', () => {
    const input = '<body onscroll=alert(1)><br><br><br><br><br><br>...<br><br><br><br><input autofocus>';
    const output = '<body><br /><br /><br /><br /><br /><br />...<br /><br /><br /><br /><input autofocus /></body>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #13', () => {
    const input = '<x repeat="template" repeat-start="999999">0<y repeat="template" repeat-start="999999">1</y></x>';
    const output = '01';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #14', () => {
    const input = '<input pattern=^((a+.)a)+$ value=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!>';
    const output = '<input pattern="^((a+.)a)+$" value="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #15', () => {
    const input = '<script>({0:#0=alert/#0#/#0#(0)})</script>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #16', () => {
    const input = 'X<x style=`behavior:url(#default#time2)` onbegin=`write(1)` >';
    const output = 'X';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #17', () => {
    const input = '<?xml-stylesheet href="javascript:alert(1)"?><root/>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #18', () => {
    const input = '<script xmlns="http://www.w3.org/1999/xhtml">&#x61;l&#x65;rt&#40;1)</script>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #19', () => {
    const input = '<meta charset="x-mac-farsi">\xBCscript \xBEalert(1)//\xBC/script \xBE';
    const output = '<meta charset="x-mac-farsi" />\xBCscript \xBEalert(1)//\xBC/script \xBE';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #20', () => {
    const input = "<script>ReferenceError.prototype.__defineGetter__(\'name\', function(){alert(1)}),x</script>";
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #21', () => {
    const input = "<script>Object.__noSuchMethod__ = Function,[{}][0].constructor._(\'alert(1)\')()</script>";
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #22', () => {
    const input = '<input onblur=focus() autofocus><input>';
    const output = '<input autofocus /><input />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #23', () => {
    const input = '<form id=it onforminput=alert(1)><input></form><button form=it onformchange=alert(2)>X</button>';
    const output = '<form id="it"><input /></form><button form="it">X</button>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #24', () => {
    const input = '1<set/xmlns=`urn:schemas-microsoft-com:time` style=`beh&#x41vior:url(#default#time2)` attributename=`innerhtml` to=`&lt;img/src=&quot;x&quot;onerror=alert(1)&gt;`>';
    const output = '1';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #25', () => {
    const input = '<script src="#">{alert(1)}</script>;1';
    const output = ';1';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #26', () => {
    const input = '+ADw-html+AD4APA-body+AD4APA-div+AD4-top secret+ADw-/div+AD4APA-/body+AD4APA-/html+AD4-.toXMLString().match(/.*/m),alert(RegExp.input);';
    const output = '+ADw-html+AD4APA-body+AD4APA-div+AD4-top secret+ADw-/div+AD4APA-/body+AD4APA-/html+AD4-.toXMLString().match(/.*/m),alert(RegExp.input);';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #27', () => {
    const input = "<style>p[foo=bar{}*{-o-link:\'javascript:alert(1)\'}{}*{-o-link-source:current}*{background:red}]{background:green};</style>";
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #28', () => {
    const input = '1<animate/xmlns=urn:schemas-microsoft-com:time style=behavior:url(#default#time2) attributename=innerhtml values=&lt;img/src=&quot;.&quot;onerror=alert(1)&gt;>';
    const output = '1';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #29', () => {
    const input = '<link rel=stylesheet href=data:,*%7bx:expression(write(1))%7d';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #30', () => {
    const input = '<style>@import "data:,*%7bx:expression(write(1))%7D";</style>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #31', () => {
    const input = '<frameset onload=alert(1)>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #32', () => {
    const input = '<table background="javascript:alert(1)"></table>';
    const output = '<table background="x-javascript:alert(1)"></table>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #33', () => {
    const input = '<a style="pointer-events:none;position:absolute;"><a style="position:absolute;" onclick="alert(1);">XXX</a></a><a href="javascript:alert(2)">XXX</a>';
    const output = '<a style="pointer-events:none;position:absolute;"><a style="position:absolute;">XXX</a></a><a href="x-javascript:alert(2)">XXX</a>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #34', () => {
    const input = '1<vmlframe xmlns=urn:schemas-microsoft-com:vml style=behavior:url(#default#vml);position:absolute;width:100%;height:100% src=it.vml#xss></vmlframe>';
    const output = '1';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #35', () => {
    const input = '1<a href=#><line xmlns=urn:schemas-microsoft-com:vml style=behavior:url(#default#vml);position:absolute href=javascript:alert(1) strokecolor=white strokeweight=1000px from=0 to=1000 /></a>';
    const output = '1<a href="#"></a>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #36', () => {
    const input = '<a style="behavior:url(#default#AnchorClick);" folder="javascript:alert(1)">XXX</a>';
    const output = '<a style="behavior:url(#default#AnchorClick);" folder="x-javascript:alert(1)">XXX</a>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #37', () => {
    const input = '<!--<img src="--><img src=x onerror=alert(1)//">';
    const output = '<img src="x" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #38', () => {
    const input = '<comment><img src="</comment><img src=x onerror=alert(1)//">';
    const output = '<img src="%3C/comment%3E%3Cimg%20src=x%20onerror=alert(1)//" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #39', () => {
    const input = '<!-- up to Opera 11.52, FF 3.6.28 -->\r\n<![><img src="]><img src=x onerror=alert(1)//">\r\n\r\n<!-- IE9+, FF4+, Opera 11.60+, Safari 4.0.4+, GC7+ -->\r\n<svg><![CDATA[><image xlink:href="]]><img src=xx:x onerror=alert(2)//"></svg>';
    const output = '\n<img src="%5D%3E%3Cimg%20src=x%20onerror=alert(1)//" />\n\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #40', () => {
    const input = '<style><img src="</style><img src=x onerror=alert(1)//">';
    const output = '<img src="x" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #41', () => {
    const input = '<li style=list-style:url() onerror=alert(1)></li>\n<div style=content:url(data:image/svg+xml,%3Csvg/%3E);visibility:hidden onload=alert(1)></div>';
    const output = '<li style="list-style:url()"></li>\n<div style="content:url(data:image/svg+xml,%3Csvg/%3E);visibility:hidden"></div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #42', () => {
    const input = '<head><base href="javascript://"/></head><body><a href="/. /,alert(1)//#">XXX</a></body>';
    const output = '<head><base href="x-javascript://" /></head><body><a href="/.%20/,alert(1)//#">XXX</a></body>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #43', () => {
    const input = '<?xml version="1.0" standalone="no"?>\r\n<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head>\r\n<style type="text/css">\r\n@font-face {font-family: y; src: url("font.svg#x") format("svg");} body {font: 100px "y";}\r\n</style>\r\n</head>\r\n<body>Hello</body>\r\n</html>';
    const output = '\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n\n</head>\n<body>Hello</body>\n</html>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #45', () => {
    const input = "<style>*[{}@import\'it.css?]{color: green;}</style>X";
    const output = 'X';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #46', () => {
    const input = "<div style=\"font-family:\'foo[a];color:red;\';\">XXX</div>";
    const output = "<div style=\"font-family:\'foo[a];color:red;\';\">XXX</div>";
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #47', () => {
    const input = '<div style="font-family:foo}color=red;">XXX</div>';
    const output = '<div>XXX</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #48', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #49', () => {
    const input = '<SCRIPT FOR=document EVENT=onreadystatechange>alert(1)</SCRIPT>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #50', () => {
    const input = '<OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83"><PARAM NAME="DataURL" VALUE="javascript:alert(1)"></OBJECT>';
    const output = '<object classid="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83"><param name="DataURL" value="javascript:alert(1)" /></object>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #51', () => {
    const input = '<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="></object>';
    const output = '<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="></object>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #52', () => {
    const input = '<embed src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="></embed>';
    const output = '<embed src="x-data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #53', () => {
    const input = '<x style="behavior:url(it.sct)">';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #54', () => {
    const input = '<xml id="xss" src="it.htc"></xml>\r\n<label dataformatas="html" datasrc="#xss" datafld="payload"></label>';
    const output = '\n<label></label>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #55', () => {
    const input = "<script>[{\'a\':Object.prototype.__defineSetter__(\'b\',function(){alert(arguments[0])}),\'b\':[\'secret\']}]</script>";
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #56', () => {
    const input = '<video><source onerror="alert(1)">';
    const output = '<video><source /></video>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #57', () => {
    const input = '<video onerror="alert(1)"><source></source></video>';
    const output = '<video><source /></video>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #58', () => {
    const input = '<b <script>alert(1)//</script>0</script></b>';
    const output = '<b>alert(1)//0</b>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #59', () => {
    const input = '<b><script<b></b><alert(1)</script </b></b>';
    const output = '<b></b>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #60', () => {
    const input = '<div id="div1"><input value="``onmouseover=alert(1)"></div> <div id="div2"></div><script>document.getElementById("div2").innerHTML = document.getElementById("div1").innerHTML;</script>';
    const output = '<div id="div1"><input value="``onmouseover=alert(1)" /></div> <div id="div2"></div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #61', () => {
    const input = '<div style="[a]color[b]:[c]red">XXX</div>';
    const output = '<div>XXX</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #62', () => {
    const input = '<div style="\\63&#9\\06f&#10\\0006c&#12\\00006F&#13\\R:\\000072 Ed;color\\0\\bla:yellow\\0\\bla;col\\0\\00 \\&#xA0or:blue;">XXX</div>';
    const output = '<div>XXX</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #63', () => {
    const input = "<!-- IE 6-8 -->\r\n<x \'=\"foo\"><x foo=\'><img src=x onerror=alert(1)//\'>\r\n\r\n<!-- IE 6-9 -->\r\n<! \'=\"foo\"><x foo=\'><img src=x onerror=alert(2)//\'>\r\n<? \'=\"foo\"><x foo=\'><img src=x onerror=alert(3)//\'>";
    const output = '\n\n\n\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #64', () => {
    const input = '<embed src="javascript:alert(1)"></embed> // O10.10â†“, OM10.0â†“, GC6â†“, FF\r\n<img src="javascript:alert(2)">\r\n<image src="javascript:alert(2)"> // IE6, O10.10â†“, OM10.0â†“\r\n<script src="javascript:alert(3)"></script> // IE6, O11.01â†“, OM10.1â†“';
    const output = '<embed src="x-javascript:alert(1)" /> // O10.10â†“, OM10.0â†“, GC6â†“, FF\n<img src="x-javascript:alert(2)" />\n // IE6, O10.10â†“, OM10.0â†“\n // IE6, O11.01â†“, OM10.1â†“';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #65', () => {
    const input = '<!DOCTYPE x[<!ENTITY x SYSTEM "http://htmlsec.org/it.xxe">]><y>&x;</y>';
    const output = ']>&x;';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #66', () => {
    const input = '<svg onload="javascript:alert(1)" xmlns="http://www.w3.org/2000/svg"></svg>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #67', () => {
    const input = "<?xml version=\"1.0\"?>\n<?xml-stylesheet type=\"text/xsl\" href=\"data:,%3Cxsl:transform version=\'1.0\' xmlns:xsl=\'http://www.w3.org/1999/XSL/Transform\' id=\'xss\'%3E%3Cxsl:output method=\'html\'/%3E%3Cxsl:template match=\'/\'%3E%3Cscript%3Ealert(1)%3C/script%3E%3C/xsl:template%3E%3C/xsl:transform%3E\"?>\n<root/>";
    const output = '\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #68', () => {
    const input = '<!DOCTYPE x [\r\n\t<!ATTLIST img xmlns CDATA "http://www.w3.org/1999/xhtml" src CDATA "xx:x"\r\n onerror CDATA "alert(1)"\r\n onload CDATA "alert(2)">\r\n]><img />';
    const output = '\n]><img />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #69', () => {
    const input = '<doc xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:html="http://www.w3.org/1999/xhtml">\r\n\t<html:style /><x xlink:href="javascript:alert(1)" xlink:type="simple">XXX</x>\r\n</doc>';
    const output = '\n\tXXX\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #70', () => {
    const input = '<card xmlns="http://www.wapforum.org/2001/wml"><onevent type="ontimer"><go href="javascript:alert(1)"/></onevent><timer value="1"/></card>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #71', () => {
    const input = '<div style=width:1px;filter:glow onfilterchange=alert(1)>x</div>';
    const output = '<div style="width:1px;filter:glow">x</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #72', () => {
    const input = '<// style=x:expression\\28write(1)\\29>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #73', () => {
    const input = '<form><button formaction="javascript:alert(1)">X</button>';
    const output = '<form><button formaction="x-javascript:alert(1)">X</button></form>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #74', () => {
    const input = '<event-source src="event.php" onload="alert(1)">';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #75', () => {
    const input = '<a href="javascript:alert(1)"><event-source src="data:application/x-dom-event-stream,Event:click%0Adata:XXX%0A%0A" /></a>';
    const output = '<a href="x-javascript:alert(1)"></a>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #76', () => {
    const input = '<script<{alert(1)}/></script </>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #77', () => {
    const input = '<?xml-stylesheet type="text/css"?><!DOCTYPE x SYSTEM "it.dtd"><x>&x;</x>';
    const output = '&x;';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #78', () => {
    const input = '<?xml-stylesheet type="text/css"?><root style="x:expression(write(1))"/>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #79', () => {
    const input = '<?xml-stylesheet type="text/xsl" href="#"?><img xmlns="x-schema:it.xdr"/>';
    const output = '<img xmlns="x-x-schema:it.xdr" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #80', () => {
    const input = '<object allowscriptaccess="always" data="it.swf"></object>';
    const output = '<object data="it.swf"></object>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #81', () => {
    const input = '<style>*{x:ï½…ï½˜ï½ï½’ï½…ï½“ï½“ï½‰ï½ï½Ž(write(1))}</style>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #82', () => {
    const input = '<x xmlns:xlink="http://www.w3.org/1999/xlink" xlink:actuate="onLoad" xlink:href="javascript:alert(1)" xlink:type="simple"/>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #83', () => {
    const input = '<?xml-stylesheet type="text/css" href="data:,*%7bx:expression(write(2));%7d"?>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #84', () => {
    const input = '<x:template xmlns:x="http://www.wapforum.org/2001/wml" x:ontimer="$(x:unesc)j$(y:escape)a$(z:noecs)v$(x)a$(y)s$(z)cript$x:alert(1)"><x:timer value="1"/></x:template>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #85', () => {
    const input = '<x xmlns:ev="http://www.w3.org/2001/xml-events" ev:event="load" ev:handler="javascript:alert(1)//#x"/>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #86', () => {
    const input = '<x xmlns:ev="http://www.w3.org/2001/xml-events" ev:event="load" ev:handler="it.evt#x"/>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #87', () => {
    const input = '<body oninput=alert(1)><input autofocus>';
    const output = '<body><input autofocus /></body>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #88', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg">\n<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="javascript:alert(1)"><rect width="1000" height="1000" fill="white"/></a>\n</svg>';
    const output = '\n<a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="x-javascript:alert(1)"></a>\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #89', () => {
    const input = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n\n<animation xlink:href=\"javascript:alert(1)\"/>\n<animation xlink:href=\"data:text/xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' onload=\'alert(1)\'%3E%3C/svg%3E\"/>\n\n<image xlink:href=\"data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' onload=\'alert(1)\'%3E%3C/svg%3E\"/>\n\n<foreignObject xlink:href=\"javascript:alert(1)\"/>\n<foreignObject xlink:href=\"data:text/xml,%3Cscript xmlns=\'http://www.w3.org/1999/xhtml\'%3Ealert(1)%3C/script%3E\"/>\n\n</svg>";
    const output = '\n\n\n\n\n\n\n\n\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #90', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg">\n<set attributeName="onmouseover" to="alert(1)"/>\n<animate attributeName="onunload" to="alert(1)"/>\n</svg>';
    const output = '\n\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #91', () => {
    const input = '<!-- Up to Opera 10.63 -->\r\n<div style=content:url(it2.svg)></div>\r\n\r\n<!-- Up to Opera 11.64 - see link below -->\r\n\r\n<!-- Up to Opera 12.x -->\r\n<div style="background:url(it5.svg)">PRESS ENTER</div>';
    const output = '\n<div style="content:url(it2.svg)"></div>\n\n\n\n\n<div style="background:url(it5.svg)">PRESS ENTER</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #92', () => {
    const input = "[A]\n<? foo=\"><script>alert(1)</script>\">\n<! foo=\"><script>alert(1)</script>\">\n</ foo=\"><script>alert(1)</script>\">\n[B]\n<? foo=\"><x foo=\'?><script>alert(1)</script>\'>\">\n[C]\n<! foo=\"[[[x]]\"><x foo=\"]foo><script>alert(1)</script>\">\n[D]\n<% foo><x foo=\"%><script>alert(1)</script>\">";
    const output = '[A]\n">\n">\n">\n[B]\n">\n[C]\n\n[D]\n&lt;% foo>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #93', () => {
    const input = '<div style="background:url(http://foo.f/f oo/;color:red/*/foo.jpg);">X</div>';
    const output = '<div>X</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #94', () => {
    const input = '<div style="list-style:url(http://foo.f)\\20url(javascript:alert(1));">X</div>';
    const output = '<div>X</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #95', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg">\n<handler xmlns:ev="http://www.w3.org/2001/xml-events" ev:event="load">alert(1)</handler>\n</svg>';
    const output = '\nalert(1)\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #96', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n<feImage>\n<set attributeName="xlink:href" to="data:image/svg+xml;charset=utf-8;base64,\nPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ%2BYWxlcnQoMSk8L3NjcmlwdD48L3N2Zz4NCg%3D%3D"/>\n</feImage>\n</svg>';
    const output = '\n\n\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #97', () => {
    const input = '<iframe src=mhtml:http://html5sec.org/it.html!xss.html></iframe>\n<iframe src=mhtml:http://html5sec.org/it.gif!xss.html></iframe>';
    const output = '\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #98', () => {
    const input = "<!-- IE 5-9 -->\r\n<div id=d><x xmlns=\"><iframe onload=alert(1)\"></div>\n<script>d.innerHTML+=\'\';</script>\r\n\r\n<!-- IE 10 in IE5-9 Standards mode -->\r\n<div id=d><x xmlns=\'\"><iframe onload=alert(2)//\'></div>\n<script>d.innerHTML+=\'\';</script>";
    const output = '\n<div id="d"></div>\n\n\n\n<div id="d"></div>\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #99', () => {
    const input = "<div id=d><div style=\"font-family:\'sans\\27\\2F\\2A\\22\\2A\\2F\\3B color\\3Ared\\3B\'\">X</div></div>\n<script>with(document.getElementById(\"d\"))innerHTML=innerHTML</script>";
    const output = "<div id=\"d\"><div style=\"font-family:\'sans\\27\\2F\\2A\\22\\2A\\2F\\3B color\\3Ared\\3B\'\">X</div></div>\n";
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #100', () => {
    const input = 'XXX<style>\r\n\r\n*{color:gre/**/en !/**/important} /* IE 6-9 Standards mode */\r\n\r\n<!--\r\n--><!--*{color:red} /* all UA */\r\n\r\n*{background:url(xx:x //**/\\red/*)} /* IE 6-7 Standards mode */\r\n\r\n</style>';
    const output = 'XXX';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #101', () => {
    const input = '<img[a][b]src=x[d]onerror[c]=[e]"alert(1)">';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #102', () => {
    const input = '<a href="[a]java[b]script[c]:alert(1)">XXX</a>';
    const output = '<a href="%5Ba%5Djava%5Bb%5Dscript%5Bc%5D:alert(1)">XXX</a>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #103', () => {
    const input = '<img src="x` `<script>alert(1)</script>"` `>';
    const output = '<img src="x%60%20%60%3Cscript%3Ealert(1)%3C/script%3E" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #104', () => {
    const input = "<script>history.pushState(0,0,\'/i/am/somewhere_else\');</script>";
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #105', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg" id="foo">\r\n<x xmlns="http://www.w3.org/2001/xml-events" event="load" observer="foo" handler="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Chandler%20xml%3Aid%3D%22bar%22%20type%3D%22application%2Fecmascript%22%3E alert(1) %3C%2Fhandler%3E%0A%3C%2Fsvg%3E%0A#bar"/>\r\n</svg>';
    const output = '\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #106', () => {
    const input = '<iframe src="data:image/svg-xml,%1F%8B%08%00%00%00%00%00%02%03%B3)N.%CA%2C(Q%A8%C8%CD%C9%2B%B6U%CA())%B0%D2%D7%2F%2F%2F%D7%2B7%D6%CB%2FJ%D77%B4%B4%B4%D4%AF%C8(%C9%CDQ%B2K%CCI-*%D10%D4%B4%D1%87%E8%B2%03"></iframe>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #107', () => {
    const input = "<img src onerror /\" \'\"= alt=alert(1)//\">";
    const output = '<img src />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #108', () => {
    const input = '<title onpropertychange=alert(1)></title><title title=></title>';
    const output = '';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #109', () => {
    const input = '<!-- IE 5-8 standards mode -->\r\n<a href=http://foo.bar/#x=`y></a><img alt="`><img src=xx:x onerror=alert(1)></a>">\r\n\r\n<!-- IE 5-9 standards mode -->\r\n<!a foo=x=`y><img alt="`><img src=xx:x onerror=alert(2)//">\r\n<?a foo=x=`y><img alt="`><img src=xx:x onerror=alert(3)//">';
    const output = '\n<a href="http://foo.bar/#x&#61;&#96;y"></a><img alt="`><img src=xx:x onerror=alert(1)></a>" />\n\n\n<img alt="`><img src=xx:x onerror=alert(2)//" />\n<img alt="`><img src=xx:x onerror=alert(3)//" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #110', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg">\n<a id="x"><rect fill="white" width="1000" height="1000"/></a>\n<rect fill="white" style="clip-path:url(it3.svg#a);fill:url(#b);filter:url(#c);marker:url(#d);mask:url(#e);stroke:url(#f);"/>\n</svg>';
    const output = '\n<a id="x"></a>\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #111', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg">\r\n<path d="M0,0" style="marker-start:url(it4.svg#a)"/>\r\n</svg>';
    const output = '\n\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #112', () => {
    const input = '<div style="background:url(/f#[a]oo/;color:red/*/foo.jpg);">X</div>';
    const output = '<div style="background:url(/f#[a]oo/;color:red/*/foo.jpg);">X</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #113', () => {
    const input = '<div style="font-family:foo{bar;background:url(http://foo.f/oo};color:red/*/foo.jpg);">X</div>';
    const output = '<div>X</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #114', () => {
    const input = '<div id="x">XXX</div>\n<style>\n\n#x{font-family:foo[bar;color:green;}\n\n#y];color:red;{}\n\n</style>';
    const output = '<div id="x">XXX</div>\n';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('html5sec #115', () => {
    const input = "<x style=\"background:url(\'x[a];color:red;/*\')\">XXX</x>";
    const output = 'XXX';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #1', () => {
    const input = '<script> do_evil1() </script>evil script 1';
    const output = 'evil script 1';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #2', () => {
    const input = '<script > do_evil2() < /script></script>evil script 2';
    const output = 'evil script 2';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #3', () => {
    const input = "<script>var x = 'fred\'s house'; var y=3;</script>script with escaped tick";
    const output = 'script with escaped tick';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #4', () => {
    const input = '<barf />no such tag with space';
    const output = 'no such tag with space';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #5', () => {
    const input = 'abc   <b>def</b> ghi<bogus>jkl</bogus>x< 4 > whitespace it';
    const output = 'abc   <b>def</b> ghijklx&lt; 4 > whitespace it';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #6', () => {
    const input = '<>empty tag<>';
    const output = '&lt;>empty tag&lt;>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #7', () => {
    const input = "<hr noshade=''/>boolean tag with empty quoted value";
    const output = '<hr />boolean tag with empty quoted value';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #8', () => {
    const input = '<hr noshade="noshad"/>boolean tag with bogus value';
    const output = '<hr />boolean tag with bogus value';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #9', () => {
    const input = '<hr noshade=noshader />boolean tag with bogus unquoted value';
    const output = '<hr />boolean tag with bogus unquoted value';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #10', () => {
    const input = '<table><tr bz/></table>normal tag made standalone with bogus trunc attr';
    const output = '<table><tr /></table>normal tag made standalone with bogus trunc attr';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #11', () => {
    const input = '<table><tr color/></table>normal tag made standalone with trunc attr bad val';
    const output = '<table><tr /></table>normal tag made standalone with trunc attr bad val';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #12', () => {
    const input = '< br/>standalone tag with space before';
    const output = '&lt; br/>standalone tag with space before';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #13', () => {
    const input = '<br/ >standalone tag with space after';
    const output = '<br />standalone tag with space after';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #14', () => {
    const input = '<table><tr size="4"/></table>normal tag made standalone with value';
    const output = '<table><tr size="4" /></table>normal tag made standalone with value';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #15', () => {
    const input = '<div style=3>number not string in style</div>';
    const output = '<div>number not string in style</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #16', () => {
    const input = '<div style="bogus: red; boguscolor :  green">prohibited style</div>';
    const output = '<div style="bogus: red; boguscolor :  green">prohibited style</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #17', () => {
    const input = '<div style=" color: blue">rodent 1 is ok</div>';
    const output = '<div style=" color: blue">rodent 1 is ok</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #18', () => {
    const input = "<div style=' color: blue;'>rodent 2 is ok</div>";
    const output = '<div style=" color: blue;">rodent 2 is ok</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #19', () => {
    const input = "<div style=' color: blue\";'>rodent 3 is malformed</div>";
    const output = '<div>rodent 3 is malformed</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #20', () => {
    const input = "<div style=' color: blue '>rodent 4 is ok</div>";
    const output = '<div style=" color: blue ">rodent 4 is ok</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #21', () => {
    const input = '<div style=" <script>do_evil();</script> ">script tags stripped</div>';
    const output = '<div>script tags stripped</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #22', () => {
    const input = '<div style="">null style attr</div>';
    const output = '<div style="">null style attr</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #23', () => {
    const input = '<div style=":">colon style attr</div>';
    const output = '<div>colon style attr</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #24', () => {
    const input = '<div style=>no style value at all</div>';
    const output = '<div style="">no style value at all</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #25', () => {
    const input = '<div style="color blue">colon not present</div>';
    const output = '<div>colon not present</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #26', () => {
    const input = '<div style="color = blue">punct not colon</div>';
    const output = '<div>punct not colon</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #27', () => {
    const input = '<div style="color">colon and attr missing</div>';
    const output = '<div>colon and attr missing</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #28', () => {
    const input = '<div style="color:">attr mising</div>';
    const output = '<div>attr mising</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #29', () => {
    const input = '<div style="color\\": blue">escaped quote in attr isnt really escaped</div>';
    const output = '<div>escaped quote in attr isnt really escaped</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #30', () => {
    const input = '<div style="color : blue\\"">escaped quote in val isnt really escaped</div>';
    const output = '<div>escaped quote in val isnt really escaped</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #31', () => {
    const input = '<div style=color:blue>unquoted style attribute</div>';
    const output = '<div style="color:blue">unquoted style attribute</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #32', () => {
    const input = '<div style="color:green blue">multiple values</div>';
    const output = '<div style="color:green blue">multiple values</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #33', () => {
    const input = '<div style="color:green bad( blue )">parenthesis it 1</div>';
    const output = '<div style="color:green bad( blue )">parenthesis it 1</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #34', () => {
    const input = '<div style="color:bad( blue ) green">parenthesis it 2</div>';
    const output = '<div style="color:bad( blue ) green">parenthesis it 2</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #35', () => {
    const input = '<div style="color:bad( blue green">parenthesis it 3</div>';
    const output = '<div>parenthesis it 3</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #36', () => {
    const input = '<div style="color:bad(( blue ) green ) green">parenthesis it 4</div>';
    const output = '<div>parenthesis it 4</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #37', () => {
    const input = '<div style="color:))))) green">parenthesis it 5</div>';
    const output = '<div>parenthesis it 5</div>';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #38', () => {
    const input = '<img />';
    const output = '<img />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #39', () => {
    const input = '<img id="foo" />';
    const output = '<img id="foo" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #40', () => {
    const input = '<option selected />';
    const output = '<option selected />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #41', () => {
    const input = '<img id="foo" / src="bar.com">';
    const output = '<img id="foo" src="bar.com" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #42', () => {
    const input = '<img/>';
    const output = '<img />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #43', () => {
    const input = '<img id="foo"/>';
    const output = '<img id="foo" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #44', () => {
    const input = '<option selected/>';
    const output = '<option selected />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #45', () => {
    const input = "<img id=\'foo\'/>";
    const output = '<img id="foo" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #46', () => {
    const input = "<img id=\'foo\' />";
    const output = '<img id="foo" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #47', () => {
    const input = '<img id="" />';
    const output = '<img id="" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #48', () => {
    const input = "<img id=\'\' />";
    const output = '<img id="" />';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #49', () => {
    const input = ' 123 --> abc';
    const output = ' 123 --> abc';
    const purify = app.purify(input);
    assert(purify === output);
  });

  it('general #50', () => {
    const input = 'abc <!-- 123';
    const output = 'abc ';
    const purify = app.purify(input);
    assert(purify === output);
  });
});
