// forked from gimite's "HTML slide Androidフリック対応版" http://jsdo.it/gimite/slide
// forked from os0x's "HTML slide" http://jsdo.it/os0x/slide

document.getElementById('startslide').onclick = function(){
	this.style.display = 'none';
	document.getElementById('slide-base').disabled = false;
// まずはページ幅取得
var width = document.documentElement.clientWidth;
document.body.className = 'slidemode';
// フォントサイズ調整
if(window.ActiveXObject){
	document.body.style.fontSize = width / 6 + '%';
} else {
	document.body.style.fontSize = width / 5 + '%';
}
var slides = [];
var SV = 'view';
var SR = 'right';
var SL = 'left';
// docutils が出力した.sectionの階層構造を調整
var divs = $('div.section div.section');
$('div.section').after(divs.clone());
$('div.section div.section').remove();
// スライドの各ページを取得
// divタグのクラス名で判定
divs = $('div.section');
for (var i = 0,l = divs.length;i<l;i++){
	var div = divs[i];
	if(/^section/.test(div.className)){
		var name = div.className;
		div.className += ' ' + SR;
		slides.push({node:div,name:name + ' ' + SV});
		if(/\strap\d/.test(div.className)){
			var count = parseInt(div.className.match(/\strap(\d+)/)[1], 10);
			for (var j = 0;j < count;j++){
				slides.push({node:div,name:name + ' ' + SV + ' t'+(j+1)});
			}
		}
  }
}
if (!window.XMLHttpRequest){// IE6
	for (var i = 0, l = slides.length;i < l;i++){
		var e = slides[i];
		e.node.style.height = document.documentElement.clientHeight*0.9 + 'px';
	}
}
//現在のページ
var current = 0;
var count = slides.length;

document.body.onclick = function(e){
  var ev = e||window.event;
  var x = ev.clientX;
  if (width*0.95 < x && slides[current+1]){
    //右余白がクリックされたとき
    next(true);
  } else if (width*0.05 > x && slides[current-1]) {
    //左余白がクリックされたとき
    prev(true);
  }
};
var Down = -1, Up = 1;
/*
if (document.body.onmousewheel !== void 0 || window.opera){
  // onmousewheelが使えるか判定(Firefox以外はこちら)
  document.body.onmousewheel = mousewheel;
} else {
  // 実質Firefox用の処理。onmousewheelをサポートしたら上の処理だけで済むようになるはず
  document.body.addEventListener('DOMMouseScroll',mousewheel,false);
}
*/
function mousewheel(e){
  var ev = e||window.event;
  var dir = ev.wheelDelta || -ev.detail;
  dir = dir < 0 ? Down : Up;
  if (dir === Down && slides[current+1]){
    next();
  } else if (dir === Up && slides[current-1]) {
    prev();
  }
}
(function(){
	var scrolls;
	if(document.getElementsByClassName){
		scrolls = document.getElementsByClassName('scroller');
	} else {
		scrolls = [];
		var all = document.getElementsByTagName('*');
		for (var i = 0, l = all.length;i < l;i++){
			var e = all[i];
			if(/(^|\s)scroller($|\s)/.test(e.className)){
				scrolls.push(e);
			}
		}
	}
	for (var i = 0, l = scrolls.length;i < l;i++){
		scrolls[i].onmousewheel = function(e){
			e || (e = window.event);
			if(e.stopPropagation){
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		};
	}
})();
var touch_x = null;
document.body.ontouchstart = function(e) {
  e.preventDefault();
  if (e.pageX) {
    touch_x = e.pageX;
  } else {
    touch_x = e.touches[0].pageX;
  }
};
document.body.ontouchmove = function(e) {
  e.preventDefault();
  if (touch_x === null) return;
  if (e.pageX) {
    if (e.pageX >= touch_x + 10 && slides[current-1]) {
      prev();
      touch_x = null;
    } else if (e.pageX <= touch_x - 10 && slides[current+1]) {
      next();
      touch_x = null;
    }
  } else {
    if (e.touches[0].pageX >= touch_x + 10 && slides[current-1]) {
      prev();
      touch_x = null;
    } else if (e.touches[0].pageX <= touch_x - 10 && slides[current+1]) {
      next();
      touch_x = null;
    }
  }
};
document.onkeydown = key_slide;
var J = 74, K = 75, Left = 37, Right = 39, PageDown = 34, PageUp = 33;
function key_slide(evt){
  if (!evt) {
    evt = window.event;
  }
  if ((evt.keyCode === K || evt.keyCode === Left) && slides[current-1]){// k
    prev();
    return false;
  } else if ((evt.keyCode === J || evt.keyCode === Right) && slides[current+1]) {// j
    next();
    return false;
  }
}
var REG_POSITION = /(^|\s)(right|left|view(?: trapped)?)($|\s)/g;
function next(flag){
	var lef = slides[current++];
	var cur = slides[current];
	lef.node.className = lef.node.className.replace(REG_POSITION, '$1'+SL+'$3');
	cur.node.className = cur.name + ' R';
	setHash(flag);
}
function prev(flag){
	var rig = slides[current--];
	var cur = slides[current];
	rig.node.className = rig.node.className.replace(REG_POSITION, '$1'+SR+'$3');
	cur.node.className = cur.name + ' L';
	setHash(flag);
}
function setHash(nohash){
	if (!nohash) {
		location.hash = 'Page'+(current+1);
	}
	if(current-1 >= 0){
		left.href = '#Page' + (current);
	} else {
		left.removeAttribute('href');
	}
	if (slides.length > current+1) {
		right.href = '#Page' + (current+2);
	} else {
		right.removeAttribute('href');
	}
  update_inf();
}

setTimeout(function(){
  var m;
  if (m=location.hash.match(/^#Page(\d+)$/)){
    current = m[1]-1;
    for (var i = 0;i < current && slides[i];i++){
      slides[i].node.className = slides[i].node.className.replace(REG_POSITION, '$1'+SL+'$3');
    }
    slides[current].node.className = slides[current].name;
  } else {
    slides[0].node.className = slides[0].name;
  }
  setHash(true);
  update_inf();
}, 500);
if(top == self){
  document.body.className += ' top';
}

var inf = document.createElement('span');
inf.className = 'aside';
document.body.appendChild(inf);
function update_inf(){
  inf.innerHTML = (current+1) + '/' + count;
}

var nav = document.createElement('span');
nav.id = 'nav-arrow';
var left  = document.createElement('a');
var right = document.createElement('a');
left.id = 'left-button';
right.id = 'right-button';
left.appendChild(document.createTextNode('←'));
right.appendChild(document.createTextNode('→'));
nav.appendChild(left);
nav.appendChild(right);
document.body.appendChild(nav);

var sheet;
if(document.createStyleSheet){
  sheet = document.createStyleSheet();
} else {
  var style = document.createElement('style');
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
  sheet = style.sheet;
}
if (sheet.insertRule){
	sheet.insertRule('#nav-arrow a{font-size:'+(width*0.03|0)+'px;}', sheet.cssRules.length);
} else {
	sheet.addRule('#nav-arrow a', 'font-size:'+(width*0.03|0)+'px;');
}
};

document.getElementById('startslide').onclick();

if (window.prettyPrint){
	prettyPrint();
} else {
	setTimeout(function(){window.prettyPrint && window.prettyPrint()},1000);
}
