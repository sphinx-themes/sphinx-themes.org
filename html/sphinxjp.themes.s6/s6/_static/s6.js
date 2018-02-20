/*  S6
 *  (c) 2007 Cybozu Labs, Inc.
 *
 *  S6 is freely distributable under the terms of an MIT-style license.
 *
/*--------------------------------------------------------------------------*/

// S6
// SSSSSS created by amachang

if (typeof window.s6 != 'undefined') {
    delete window.s6;
}
var s6 = {};


// オブジェクト名: uai オブジェクト
// 以下の uai オブジェクトは以下のサイトの UAIdentifier を基に作っています。
// 問題があれば教えてください。
// http://homepage2.nifty.com/magicant/sjavascript/uai-spec.html
s6.uai = new function() {

    var ua = navigator.userAgent;

    if (typeof(RegExp) == "undefined") {
        if (ua.indexOf("Opera") >= 0) {
            this.opera = true;
        } else if (ua.indexOf("Netscape") >= 0) {
            this.netscape = true;
        } else if (ua.indexOf("Mozilla/") == 0) {
            this.mozilla = true;
        } else {
            this.unknown = slide
        }
        
        if (ua.indexOf("Gecko/") >= 0) {
            this.gecko = true;
        }
        
        if (ua.indexOf("Win") >= 0) {
            this.windows = true;
        } else if (ua.indexOf("Mac") >= 0) {
            this.mac = true;
        } else if (ua.indexOf("Linux") >= 0) {
            this.linux = true;
        } else if (ua.indexOf("BSD") >= 0) {
            this.bsd = true;
        } else if (ua.indexOf("SunOS") >= 0) {
            this.sunos = true;
        }
    }
    else {
    
        /* for Trident/Tasman */
        /*@cc_on
        @if (@_jscript)
            function jscriptVersion() {
                switch (@_jscript_version) {
                    case 3.0:  return "4.0";
                    case 5.0:  return "5.0";
                    case 5.1:  return "5.01";
                    case 5.5:  return "5.5";
                    case 5.6:
                        if ("XMLHttpRequest" in window) return "7.0";
                        return "6.0";
                    case 5.7:
                        return "7.0";
                    default:   return true;
                }
            }
            if (@_win16 || @_win32 || @_win64) {
                this.windows = true;
                this.trident = jscriptVersion();
            } else if (@_mac || navigator.platform.indexOf("Mac") >= 0) {
                // '@_mac' may be 'NaN' even if the platform is Mac,
                // so we check 'navigator.platform', too.
                this.mac = true;
                this.tasman = jscriptVersion();
            }
            if (match = ua.match("MSIE ?(\\d+\\.\\d+)b?;")) {
                this.ie = match[1];
            }
        @else @*/
        
        /* for AppleWebKit */
        if (match = ua.match("AppleWebKit/(\\d+(\\.\\d+)*)")) {
            this.applewebkit = match[1];
        }
        
        /* for Gecko */
        else if (typeof(Components) == "object") {
            if (match = ua.match("Gecko/(\\d{8})")) {
                this.gecko = match[1];
            } else if (navigator.product == "Gecko"
                    && (match = navigator.productSub.match("^(\\d{8})$"))) {
                this.gecko = match[1];
            }
        }
        
        /*@end @*/
        
        if (typeof(opera) == "object" && typeof(opera.version) == "function") {
            this.opera = opera.version();
        } else if (typeof(opera) == "object"
                && (match = ua.match("Opera[/ ](\\d+\\.\\d+)"))) {
            this.opera = match[1];
        } else if (this.ie) {
        } else if (match = ua.match("Safari/(\\d+(\\.\\d+)*)")) {
            this.safari = match[1];
        } else if (match = ua.match("Konqueror/(\\d+(\\.\\d+)*)")) {
            this.konqueror = match[1];
        } else if (ua.indexOf("(compatible;") < 0
                && (match = ua.match("^Mozilla/(\\d+\\.\\d+)"))) {
            this.mozilla = match[1];
            if (match = ua.match("\\([^(]*rv:(\\d+(\\.\\d+)*).*?\\)"))
                this.mozillarv = match[1];
            if (match = ua.match("Firefox/(\\d+(\\.\\d+)*)")) {
                this.firefox = match[1];
            } else if (match = ua.match("Netscape\\d?/(\\d+(\\.\\d+)*)")) {
                this.netscape = match[1];
            }
        } else {
            this.unknown = true;
        }
        
        if (ua.indexOf("Win 9x 4.90") >= 0) {
            this.windows = "ME";
        } else if (match = ua.match("Win(dows)? ?(NT ?(\\d+\\.\\d+)?|\\d+|XP|ME|Vista)")) {
            this.windows = match[2];
            if (match[3]) {
                this.winnt = match[3];
            } else switch (match[2]) {
                case "2000":   this.winnt = "5.0";  break;
                case "XP":     this.winnt = "5.1";  break;
                case "Vista":  this.winnt = "6.0";  break;
            }
        } else if (ua.indexOf("Mac") >= 0) {
            this.mac = true;
        } else if (ua.indexOf("Linux") >= 0) {
            this.linux = true;
        } else if (match = ua.match("\\w*BSD")) {
            this.bsd = match[0];
        } else if (ua.indexOf("SunOS") >= 0) {
            this.sunos = true;
        }
    }

};


// オブジェクト名: emptyHash 関数
// ハッシュ(オブジェクト)が空であるか(for in して何も検出されないか)を調べる
s6.emptyHash = function(hash) {
    var check;
    for (var n in hash) {
        return false;
    }
    return true;
};

// オブジェクト名: overArgs 関数
// 指定した個数以降の引数を配列として返す。
s6.overArgs = function(number, args) {
    var results = [];
    for (var i = number, l = args.length; i < l; i ++) {
        results.push(args[i]);
    }
    return results;
};

// オブジェクト名: overArgs 関数
// 指定した個数以降の引数を配列として返す。
s6.toArray = function(enm) {
    var results = [];
    results.push.apply(results, enm);
    return results;
};

// オブジェクト名: opts 関数
// 最終引数に options を使うような場合に引数をうまくマージしてくれる。
s6.opts = function(options, defaults) {
    if (!options) {
        return defaults;
    }
    for (var n in defaults) {
        if (!(n in options)) {
            options[n] = defaults[n];
        }
    }
    return options;
};

// オブジェクト名: delClass 関数
// 要素からクラスを削除する
// 無ければ何もしない
s6.delClass = function(element, className) {
    if (s6.hasClass(element, className)) {
        var cache = element.__s6ClassNames__;
        for (var i = 0, l = cache.length; i < l; i ++) {
            if (cache[i] == className) {
                cache.splice(i, 1);
                element.__s6ClassName__ = element.className = cache.join(' ');
                break;
            }
        }
    }
};

// オブジェクト名: hasClass 関数
// 要素にクラスを追加する
// 無ければ追加あれば追加しない
s6.addClass = function(element, className) {
    if (!s6.hasClass(element, className)) {
        var cache = element.__s6ClassNames__;
        cache.push(className);
        element.__s6ClassName__ = element.className = cache.join(' ');
    }
}

// オブジェクト名: hasClass 関数
// 要素にクラス名があるかどうかを調べる
s6.hasClass = function(element, className) {
    var elmClassName = element.className;
    if (element.__s6ClassName__ != elmClassName || !element.__s6ClassNames__) {
        element.__s6ClassName__ = elmClassName;
        element.__s6ClassNames__ = elmClassName.split(/\s+/);
    }
    var classNames = element.__s6ClassNames__;
    for (var i = 0, l = classNames.length; i < l; i ++) {
        if (classNames[i] == className) {
            return true;
        }
    }
    return false;
};

// オブジェクト名: IncrementalObject コンストラクタ
// 値を評価するたびに値が増えていくオブジェクト
// 上限値は 1 
s6.IncrementalObject = function(gain) {
    this.value = 0;
    if (typeof gain == 'undefined') {
        gain = 1 / 7;
    }
    else if (gain > 1) {
        gain = 1;
    }
    this.gain = gain;
};
s6.IncrementalObject.prototype = {
    valueOf: function() {
        var value = this.value;
        this.value += this.gain;
        return value;
    }
};


if (!s6.uai.ie || s6.uai.ie >= 7) {
    s6.defaultStyles = {
    
        '.s6': {
            position: 'absolute',
            margin: 0,
            padding: 0,
            border: 0,
            overflow: 'hidden'
        },
    
        '.s6.mac': {
            fontFamily: "'ヒラギノ角ゴ Pro W3','Hiragino Kaku Gothic Pro',sans-serif"
        },
    
        '.s6.win': {
            fontFamily: "'メイリオ',Meiryo,'ＭＳ Ｐゴシック',sans-serif"
        },
    
        '.s6 .page': {
            position: 'absolute',
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
            border: 0,
            overflow: 'hidden',
            lineHeight: 1
        },

        '.s6 .page.default > *': {
            lineHeight: '1.5',
            position: 'relative',
            zIndex: '100'
        },
    
        '.s6 .page.default > h1': {
            margin: '20% 5% 5% 5%',
            fontSize: '110%'
        },
    
        '.s6 .page.default > h2': {
            margin: '5%'
        },
    
        '.s6 .page.default > h3': {
            margin: '2% 5% 2% 5%'
        },
    
        '.s6 .page.default > h4': {
            margin: '2% 5% 2% 5%'
        },

        '.s6 .page.default > ul': {
            margin: '5%',
            fontSize: '80%'
        },

        '.s6 .page.default > ol': {
            margin: '5%',
            fontSize: '80%'
        },
    
        '.s6 .page.default > p': {
            margin: '5%',
            fontSize: '80%'
        },
    
        '.s6 .page.default > address': {
            margin: '10% 5% 5% 5%',
            fontSize: '60%',
            textAlign: 'right'
        },
    
        '.s6 .page.default > pre': {
            fontSize: '50%',
            padding: '1%',
            borderTop: '0.6em solid',
            borderBottom: '0.6em solid'
        },
    
        '.s6 .page.takahashi > * > a:focus': {
            outline: 'none'
        },
    
        '.s6 .page.takahashi > *': {
            position: 'absolute',
            zIndex: '100',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
            top: '45%'
        },
    
        '.s6 .page.custom > *': {
            position: 'absolute',
            zIndex: '100',
            whiteSpace: 'nowrap'
        },
    
        '.s6 .index.page > .inner.s6': {
            height: '100%',
            width: '100%',
            margin: '1.875% 2.5%',
            overflow: 'visible'
        },
    
        '.s6 .index.page > .inner.s6 > .page > .wrapper': {
            fontSize: '19%',
            height: '19%',
            width: '19%',
            float: 'left',
            position: 'relative'
        },
    
        '.s6 .index.page > .inner.s6 > .page > .wrapper > .page': {
            top: '4%',
            left: '4%',
            width: '92%',
            height: '92%'
        },
    
        '.s6 .page *': {
            fontSize: '100%',
            fontWeight: 'normal',
            fontStyle: 'normal',
            margin: 0,
            border: 0
        },
    
    
        // color thema
        '.s6.dark ': {
            backgroundColor: 'black',
            color: 'white'
        },
    
        '.s6.dark a': {
            color: 'yellow'
        },
    
        '.s6.dark .page': {
            background: '#4C5469 url(background.png) repeat-x'
        },
    
        '.s6.dark .page.default > pre': {
            borderTopColor: '#666',
            borderBottomColor: '#666',
            backgroundColor: 'black'
        },
    
        '.s6.dark .page.default > pre > strong': {
            color: 'yellow'
        },

        '.s6.dark .index.page > .inner.s6': {
            background: 'transparent'
        },

        '.s6.dark .index.page > .inner.s6 > .page': {
            background: 'transparent'
        },

        '.s6.dark .index.page > .inner.s6 > .page > .wrapper.selected': {
            background: 'gray'
        }
    };
}
else {
    s6.defaultStyles = {
    
        '.s6': {
            position: 'absolute',
            margin: 0,
            padding: 0,
            border: 0,
            overflow: 'hidden'
        },
    
        '.s6.mac': {
            fontFamily: "'ヒラギノ角ゴ Pro W3','Hiragino Kaku Gothic Pro',sans-serif"
        },
    
        '.s6.win': {
            fontFamily: "'メイリオ',Meiryo,'ＭＳ Ｐゴシック',sans-serif"
        },
    
        '.s6 .page': {
            position: 'absolute',
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
            border: 0,
            overflow: 'hidden',
            lineHeight: '1.2'
        },
    
        '.s6 .page.default *.element': {
            lineHeight: '1.5',
            position: 'relative',
            zIndex: '100'
        },
    
        '.s6 .page.default h1.element': {
            margin: '20% 5% 5% 5%',
            fontSize: '110%'
        },
    
        '.s6 .page.default h2.element': {
            margin: '5%'
        },
    
        '.s6 .page.default h3.element': {
            margin: '2% 5% 2% 5%'
        },
    
        '.s6 .page.default h4.element': {
            margin: '2% 5% 2% 5%'
        },

        '.s6 .page.default ul.element': {
            margin: '5% 5% 5% 10%',
            fontSize: '80%'
        },
    
        '.s6 .page.default p.element': {
            margin: '5%',
            fontSize: '80%'
        },
    
        '.s6 .page.default address.element': {
            margin: '10% 5% 5% 5%',
            fontSize: '60%',
            textAlign: 'right'
        },
    
        '.s6 .page.default pre.element': {
            fontSize: '50%',
            padding: '1%',
            borderTop: '0.6em solid',
            borderBottom: '0.6em solid'
        },
    
        '.s6 .page.takahashi *.elmement a:focus': {
            outline: 'none'
        },
    
        '.s6 .page.takahashi *.element': {
            position: 'absolute',
            zIndex: '100',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
            top: '45%'
        },
    
        '.s6 .page.custom *.element': {
            position: 'absolute',
            zIndex: '100',
            whiteSpace: 'nowrap'
        },
    
        '.s6 .index.page .inner.s6': {
            height: '100%',
            width: '100%',
            margin: '1.875% 2.5%',
            overflow: 'visible'
        },
    
        '.s6 .index.page .inner.s6 .page .wrapper': {
            fontSize: '19%',
            height: '19%',
            width: '19%',
            float: 'left',
            position: 'relative'
        },

        '.s6 .index.page .inner.s6 .page .wrapper .page': {
            top: '4%',
            left: '4%',
            width: '92%',
            height: '92%'
        },
    
        '.s6 .page *': {
            fontSize: '100%',
            fontWeight: 'normal',
            fontStyle: 'normal',
            margin: 0,
            border: 0
        },
    
    
        // color thema
        '.s6.dark ': {
            backgroundColor: 'black',
            color: 'white'
        },
    
        '.s6.dark a': {
            color: 'yellow'
        },
    
        '.s6.dark .page': {
            background: '#4C5469 url(background.png) repeat-x'
        },
    
        '.s6.dark .page.default pre': {
            borderTopColor: '#666',
            borderBottomColor: '#666',
            backgroundColor: 'black'
        },
    
        '.s6.dark .page.default pre strong': {
            color: 'yellow'
        },
    
        '.s6.dark .page.takahashi * a': {
            color: 'yellow'
        },
        
        '.s6.dark .index.page .inner.s6 ': {
            background: 'transparent'
        },

        '.s6.dark .index.page .inner.s6 .page': {
            background: 'transparent'
        },

        '.s6.dark .index.page .inner.s6 .page .wrapper.selected': {
            background: 'gray'
        },

        '.s6.dark .index.page .inner.s6 .page .wrapper .page': {
            background: '#4C5469 url(background.png) repeat-x'
        }
    
    };
}


s6.transitions = {

    sinoidal: {
        // y = 0.5 - cos(πx)/2
        asc: function(x) {
            return 0.5 - Math.cos(x * Math.PI) / 2;
        },
        // y = 0.5 + cos(πx)/2
        desc: function(x) {
            return 0.5 + Math.cos(x * Math.PI) / 2;
        }
    },

    lenear: {
        // y = x
        asc: function(x) {
            return x;
        },

        // y = 1 - x
        desc: function(x) {
            return 1 - x;
        }
    }
};


s6.PageEffectSlideConstructor = function(from) {
    this.from = from;
    switch(from) {
        case 'right' : this.to = 'left';   break;
        case 'left'  : this.to = 'right';  break;
        case 'top'   : this.to = 'bottom'; break;
        case 'bottom': this.to = 'top';    break;
    }
};
s6.PageEffectSlideConstructor.prototype = {
    setup: function ___slideSetup(
        pageEffect, x, data,
        toPage, toElement, toStyle,
        fromPage, fromElement, fromStyle
    ) {
    },
    update: function ___slideUpdate(
        pageEffect, x, data,
        toPage, toElement, toStyle,
        fromPage, fromElement, fromStyle
    ) {
        toStyle[pageEffect.to] = (1 - x) * 100 + '%';
        fromStyle[pageEffect.from] = x * 100 + '%';
    },
    teardown: function ___slideTeardown(
        pageEffect, x, data,
        toPage, toElement, toStyle,
        fromPage, fromElement, fromStyle
    ) {
        toStyle[pageEffect.to] = '';
        fromStyle[pageEffect.from] = '';
    }
};

// this はプレゼンテーションオブジェクトとなる
s6.pageEffects = {
    slide: new s6.PageEffectSlideConstructor('right'),
    fade: {
        setup: function ___fadeSetup(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            toStyle.zIndex = '100';
            fromStyle.zIndex = '200';
        },
        update: function ___fadeUpdate(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            if (s6.uai.ie) {
                fromStyle.filter = 'alpha(opacity=' + (1 - x) * 100 + ')';
            }
            else {
                fromStyle.opacity = 1 - x;
            }
        },
        teardown: function ___fadeTeardown(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            toStyle.zIndex = '';
            fromStyle.zIndex = '';
            if (s6.uai.ie) {
                fromStyle.filter = '';
            }
            else {
                fromStyle.opacity = '';
            }
        }
    },
    fadeScaleFromUp: {
        setup: function ___fadeScaleFromUpSetup(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            toStyle.zIndex = '200';
            fromStyle.zIndex = '100';
            if (!s6.uai.ie && !s6.uai.opera) {
                toStyle.height = this.height / this.fontSize + 'em';
                toStyle.width = this.width / this.fontSize + 'em';
            }
        },
        update: function ___fadeScaleFromUpUpdate(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            
            if (s6.uai.ie || s6.uai.opera) {
                toStyle.width = (1 + (1 - x)) * 100 + '%';
                toStyle.height = (1 + (1 - x)) * 100 + '%';
            }
            toStyle.fontSize = (1 + (1 - x)) * 100 + '%';
            toStyle.top = - 50 + 50 * x + '%';
            toStyle.left = - 50 + 50 * x + '%';
            if (s6.uai.ie) {
                toStyle.filter = 'alpha(opacity=' + x * 100 + ')';
            }
            else {
                toStyle.opacity = x;
            }
        },
        teardown: function ___fadeScaleFromUpTeardown(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            toStyle.zIndex = '';
            fromStyle.zIndex = '';
            toStyle.height = '';
            toStyle.width = '';
            toStyle.fontSize = '';
            toStyle.top = '';
            toStyle.left = '';
            if (s6.uai.ie) {
                toStyle.filter = '';
            }
            else {
                toStyle.opacity = '';
            }
        }
    },
    fadeScale: {
        setup: function ___fadeScaleSetup(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            toStyle.zIndex = '100';
            fromStyle.zIndex = '200';
            fromStyle.height = this.height / this.fontSize + 'em';
            fromStyle.width = this.width / this.fontSize  + 'em';
        },
        update: function ___fadeScaleUpdate(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            var dx = 1 - x;
            var dw = (1 - dx) / 2;
            var px = dx * 100;
            var sx = px + '%';
            var sw = dw * 100 + '%';
            fromStyle.fontSize = sx;
            fromStyle.left = sw;
            fromStyle.top = sw; 
            if (s6.uai.ie) {
                fromStyle.filter = 'alpha(opacity=' + px + ')';
            }
            else {
                fromStyle.opacity = dx;
            }
        },
        teardown: function ___fadeScaleTeardown(
            pageEffect, x, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle
        ) {
            toStyle.zIndex = '';
            fromStyle.zIndex = '';
            fromStyle.height = '';
            fromStyle.width = '';
            fromStyle.left = '';
            fromStyle.top = '';
            fromStyle.fontSize = '';
            if (s6.uai.ie) {
                fromStyle.filter = '';
            }
            else {
                fromStyle.opacity = '';
            }
        }
    }
};

// TODO 2007/9/13 とりあえず、 Shibuya.JS のために追加
// あとで消すかちゃんと作り直す
s6.pageEffects.fadeScaleFromUpTransparent = {
    setup: function(
        pageEffect, x, data,
        toPage, toElement, toStyle,
        fromPage, fromElement, fromStyle
    ) {
        s6.pageEffects.fadeScaleFromUp.setup.apply(this, arguments);
        fromPage.setDisplay(true);
        toStyle.background = 'transparent';
    },
    update: s6.pageEffects.fadeScaleFromUp.update,
    teardown: function(
        pageEffect, x, data,
        toPage, toElement, toStyle,
        fromPage, fromElement, fromStyle
    ) {
        toStyle.background = '';
        s6.pageEffects.fadeScaleFromUp.teardown.apply(this, arguments);
    }
};


// this は Action オブジェクト
s6.actionEffects = {
    fade: {
        changeArgs_in: function(args) {
            args[1] = 0;
            args[2] = 1;
            return args;
        },
        changeArgs_out: function(args) {
            args[1] = 1;
            args[2] = 0;
            return args
        },
        snapshot: function(cache, elements, styles, length) {
            for (var i = 0; i < length; i ++) {
                var c = cache[i] = {};
                var style = styles[i];
                c.display = style.display;
                if (s6.uai.ie) {
                    c.filter = style.filter;
                }
                else {
                    c.opacity = style.opacity;
                }
            }
        },
        update: function(actionEffect, x, data, args, elements, styles, length) {
            var opacity = args[1] + (args[2] - args[1]) * x;

            for (var i = 0; i < length;i++) {
                var style = styles[i];
                if (s6.uai.ie) {
                    if (opacity < 0.01) {
                        data.display = style.display = 'none';
                        style.filter = '';
                    }
                    else if (opacity >= 0.99) {
                        if (!('display' in data) || data.display != '') {
                            data.display = style.display = '';
                        }
                        style.filter = '';
                    }
                    else {
                        data.dispaly = style.display = '';
                        style.filter = 'alpha(opacity=' + opacity * 100 + ')';
                    }
                }
                else {
                    if (opacity < 0.01) {
                        data.display= style.display = 'none';
                        style.opacity = '';
                    }
                    else if (opacity >= 0.99) {
                        if (!('display' in data) || data.display != '') {
                            data.display = style.display = '';
                        }
                        style.opacity = '';
                    }
                    else {
                        data.display = style.display = '';
                        style.opacity = opacity;
                    }
                } 
            }
        },
        reset: function(cache, elements, styles, length) {
            for (var i = 0; i < length; i ++) {
                var c = cache[i];
                var style = styles[i];
                style.display = c.display;
                if (s6.uai.ie) {
                    style.filter = c.filter;
                }
                else {
                    style.opacity = c.opacity;
                }
            }
        }
    },
    move: {
        snapshot: function(cache, elements, styles, length) {
            for (var i = 0; i < length; i ++) {
                var c = cache[i] = {};
                var style = styles[i];
                c.left = style.left;
                c.top = style.top;
            }
        },
        update: function(actionEffect, x, data, args, elements, styles, length) {
            var startX = args[1][0];
            var startY = args[1][1];
            var endX = args[2][0];
            var endY = args[2][1];
            for (var i = 0; i < length; i++) {
                var style = styles[i];
                style.left = startX + (endX - startX) * x + '%';
                style.top = startY + (endY - startY) * x + '%';
            }
        },
        reset: function(cache, elements, styles, length) {
            for (var i = 0; i < length; i ++) {
                var c = cache[i];
                var style = styles[i];
                style.left = c.left;
                style.top = c.top;
            }
        }
    },
    scale: {
        snapshot: function(cache, elements, styles, length) {
            for (var i = 0; i < length; i ++) {
                var c = cache[i] = {};
                var style = styles[i];
                c.width = style.width;
            }
        },
        update: function(actionEffect, x, data, args, elements, styles, length) {
            var start = args[1];
            var end = args[2];
            for (var i = 0; i < length; i++) {
                var style = styles[i];
                style.width = start + (end - start) * x + '%';
            }
        },
        reset: function(cache, elements, styles, length) {
            for (var i = 0; i < length; i ++) {
                var c = cache[i];
                var style = styles[i];
                style.width = c.width;
            }
        }
    }
};


// オブジェクト名: keyIdentifier 関数
// イベントを受け取ってイベントに keyIdentifier が無ければ付加してやる
// see also http://www.w3.org/TR/DOM-Level-3-Events/keyset.html
// まだ全然実装してない。 Left/Right/Up/Down だけ
s6.keyIdentifier = function(event) {
    var type, keyCode, keyIdentifier, shiftKey, ctrlKey, altKey, result;

    shiftKey = event.shiftKey;
    keyIdentifier = event.keyIdentifier;

    if (keyIdentifier) {
        if (result = keyIdentifier.match(/^U\+00([0-9A-Fa-f]{4})$/)) {
            event.keyIdentifier = 'U+' + result[1];
            keyCode = parseInt('0x' + result[1]);
            if (!shiftKey) {
                keyCode += 32;
            }
            event._character = String.fromCharCode(keyCode);
        }
        return event;
    }

    type = event.type;
    ctrlKey = event.ctrlKey || event.metaKey;

    keyCode = event.which || event.keyCode;

    if (keyCode >= 97 && keyCode <= 122) {
        keyCode -= 32;
    }

    if (shiftKey && keyCode >= 65 && keyCode <= 90) {
        event._character = String.fromCharCode(keyCode);
    }
    else {
        event._character = String.fromCharCode(keyCode + 32);
    }

    keyIdentifier = s6._keyIdentifierMap[keyCode];
    if (keyIdentifier) {
        event.keyIdentifier = keyIdentifier;
    }
    else {
        event.keyIdentifier = s6._num2keyId(keyCode);
    }
    return event;
};
s6._num2keyId = function(num) {
    var keyId = num.toString(16).toUpperCase();
    switch (keyId.length) {
        case 1:
            keyId = '0' + keyId;
        case 2:
            keyId = '0' + keyId;
        case 3:
            keyId = '0' + keyId;
        case 4:
            break;
        case 5:
            keyId = '0' + keyId;
        case 6:
            break;
    }
    return 'U+' + keyId;
};
s6._keyIdentifierMap = [
    '', '', '', '', '', '', '', '', '', '',
    '', '', 'Clear', 'Enter', '', '', 'Shift', 'Control', 'Alt', 'Pause',
    'CapsLock', '', '', '', '', '', '', '', '', '',
    '', '', '', 'PageUp', 'PageDown', 'End', 'Home', 'Left', 'Up', 'Right',
    'Down', '', '', '', 'PrintScreen', 'Insert', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8',
    'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18',
    'F19', 'F20', 'F21', 'F22', 'F23', 'F24', '', '', '', '',
    '', '', '', '', '', 'Scroll', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', ''
];

// オブジェクト名: attach 関数
// イベントの割当を行い、イベントハンドラ ID を復帰する。
// イベントハンドラ ID は、イベントの解除で使う
s6.attach = function(element, type, handler, priority, self) {
    // 最後の可変部を args に入れる
    var args = s6.overArgs(5, arguments);

    if (typeof type == 'object') {
        var types = type;
        var ids = [];
        for (var i = 0, l = types.length; i < l; i ++) {
            var args2 = [element, types[i], handler, priority, self].concat(args);
            ids.push(s6.attach.apply(s6, args2));
        }
        return ids;
    }

    if (typeof handler == 'string') {
        args.unshift(handler);
        handler = s6._methodHandler;
    }

    var result = type.match(/^keypress\s+(.+)$/);
    if (result) {
        var type = 'keypress';
        var keys = result[1].split(/\|/);
        args.unshift(handler, keys);
        handler = s6._keypressHandler;
    }

    //if (s6.uai.ie && type == 'keypress') {
    if ((s6.uai.ie || s6.uai.applewebkit) && type == 'keypress') {
        type = 'keydown';
    }

    if (!element['on' + type]) {
        element['on' + type] = this._handleEvent;
        // debug 
        // 以下をコメント会うとすると Firebug Console 上でイベントのモニタができるようになります。
        // var s = this;
        // element['on' + type] = function() {
        //     var result = s._handleEvent.apply(this, arguments);
        //     console.log('%s.on%s() = %o', this, arguments[0].type, result);
        //     return result;
        // };
    }
    var events = element.__s6events__;
    if (!events) {
        events = element.__s6events__ = {};
    }
    var priorities = events[type];
    if (!priorities) {
        priorities = events[type] = {};
    }
    priority = priority || 0;
    var handlers = priorities[priority];
    if (!handlers) {
        handlers = priorities[priority] = [];
    }

    var handlerInfo = [handler, self, args];
    handlers.push([handler, self, args]);
    var handlerId = this._eventCount++;
    this._events[handlerId] = {
        element: element,
        type: type,
        priority: priority,
        handler: handlerInfo
    };
    return handlerId;
};
s6._methodHandler = function(event, handler) {
    var args = s6.overArgs(3, arguments);
    args.unshift(event);
    return this[handler].apply(this, args);
};
s6._keypressHandler = function(event, handler, keys) {
    var args = s6.overArgs(3, arguments);
    args.unshift(event);
    var eCtrl = event.ctrlKey;
    var eAlt = event.altKey;
    var eShift = event.shiftKey;
    var eChar = event._character;
    var eKey = event.keyIdentifier;

    for (var i = 0, l = keys.length; i < l; i ++) {
        var key = keys[i], ctrl = false, alt = false, shift = false;

        if (key.match(/Control-/) && !eCtrl || key.match(/Alt-/) && !eAlt) {
            continue;
        }

        if (key.match(/Shift-/)) {
            shift = true;
        }

        var keySplit = key.split(/-/);
        var plainKey = keySplit[keySplit.length-1];

        if (plainKey == eKey && shift == eShift) {
            return handler.apply(this, args);
        }

        if (plainKey == eChar) {
            return handler.apply(this, args);
        }

    }
    return true;
};
s6._eventCount = 0;
s6._events = [];
s6._handleEvent = function(event) {

    var priorityList, events, priorities;

    event = event || window.event;

    if (event.type == 'keypress' || s6.uai.ie && event.type == 'keydown') {
        s6.keyIdentifier(event);
    }

    if (s6.uai.ie && !event.target) {
        event.target = event.srcElement;
    }
    events = this.__s6events__;
    priorities = events[event.type];
    priorityList = [];
    for (var n in priorities) {
        priorityList.push(+n);
    }
    priorityList = priorityList.sort(s6._sortPriority);
    for (var i = 0, l0 = priorityList.length; i < l0; i ++) {
        priority = priorityList[i];
        var handlers = priorities[priority]
        for (var j = 0, l1 = handlers.length; j < l1; j ++) {
            var handlerInfo = handlers[j];
            var handler = handlerInfo[0];
            var self = handlerInfo[1];
            var args = handlerInfo[2];
            args = [event].concat(args);
            var result = handler.apply(self || this, args);
            if (result === false) {
                s6._stopEvent(event);
                return false;
            }
        }
    }
    return true;
};
s6._sortPriority = function(a, b) {
    return b - a;
};
s6._stopEvent = function(event) {
    if (s6.uai.ie) {
        event.returnValue = false;
        event.cancelBubble = true;
    }
    else {
        event.preventDefault();
        event.stopPropagation();
    }
};

// オブジェクト名: detach 関数
// イベントハンドラ ID を使ってイベントの解除を行う
s6.detach = function(handlerId) {
    var eventInfo = this._events[handlerId];
    this._detach(eventInfo.element, eventInfo.type, eventInfo.handler, eventInfo.priority);
    this._events[handlerId] = null;
};
s6._detach = function(element, type, handlerInfo, priority) {
    var events = element.__s6events__;
    var priorities = events[type];

    if (!priorities) {
        return;
    }

    var handlers = priorities[priority];

    if (!handlers) {
        return;
    }

    for (var i = 0, l0 = handlers.length; i < l0; i ++) {
        var handler = handlers[i];

        for (var j = 0, l1 = handlerInfo.length; j < l1; j ++) {
            if (handler[j] != handlerInfo[j]) {
                break;
            }
        }
        if (handlerInfo.length == j) {
            handlers.splice(i, 1);
            break;
        }
    }

    // 削除した priority にこれ以上イベントが登録されていない場合に
    // priority を削除
    if (handlers.length == 0) {
        delete priorities[priority];
    }

    // 削除した type にこれ以上イベントが登録されていない場合に
    // type を削除 onxxx 関数も削除 
    if(s6.emptyHash(priorities)) {
        delete events[type];
        element['on' + type] = null;
    }

    // もうすべての type のイベントが削除された場合は __s6events__ を削除
    if (s6.emptyHash(events)) {
        element.__s6events__ = null;
    }
}

// オブジェクト名: detachAll 関数
// すべてのイベントを解放する
s6.detachAll = function() {
    for (var i = 0; i < this._events.length; i ++) {
        var eventInfo = this._events[i];
        if (eventInfo) {
            this._detach(eventInfo.element, eventInfo.type, eventInfo.handler, eventInfo.priority);
            this._events[i] = null;
        }
    }
};
// 最後に全てのオブジェクトを解放する（メモリリーク対策）
s6.attach(window, 'unload', function(e) {
    s6.detachAll();
    s6.extervalAll();
});

// オブジェクト名: fire 関数
// テストなどに使う、イベントが実行された状態にかなり近い状態を作り出す。
s6._keyModifierTypes = {
    altKey: 'Alt',
    altGraphKey: 'AltGraph',
    ctrlKey: 'Control',
    metaKey: 'Meta',
    shiftKey: 'Shift'
};
s6.fire = function(element, type, options) {

    // イベントの種別によって振り分けて初期化を行う
    switch (type) {

        // Keyboard 系のイベント
        case 'keypress':
        case 'keydown':
        case 'keyup':
            var event = this._keyboardEvent(element, type, options);
            break;

        // Mouse 系のイベント
        case 'click':
        case 'mousemove':
        case 'mouseover':
        case 'mouseout':
        case 'contextmenu':
            var event = this._mouseEvent(element, type, options);
            break;

        // その他のイベント
        default:
            var event = this.opts(options, {
                type: type,
                target: element,
                srcElement: element
            });
    }

    // stopPropagation をハンドリングするために上書き
    event.stopPropagation = function() {
        this.cancelBubbles = true;
    }
    // preventDefault をハンドリングするために上書き
    event.preventDefault = function() {
        this.returnValue = false;
    }
    // 残ったプロパティをマージ
    // 実際にイベントの発火シミュレーションする
    if (!event.bubbles) {
        return element['on' + event.type](event);
    }
    else {
        do {
            if (element['on' + event.type]) {
                element['on' + event.type](event);
            }
        } while (!event.cancelBubbles && (element = element.parentNode));

        if (!event.cancelBubbles && element != view) {
            var view = this._view(element);
            if (view['on' + event.type]) {
                view['on' + event.type](event);
            }
        }
        if (event.cancelBubbles) {
            return false;
        }
    }
};
s6._keyboardEvent = function(element, type, options) {
    options = this.opts(options, {
        target: element,
        type: type,
        bubbles: true,
        cancelable: true,
        view: this._view(element),
        detail: 1,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        keyCode: 0,
        charCode: 0,
        which: undefined,
        // Safari
        altGraphKey: undefined,
        // IE
        srcElement: element,
        ctrlLeft: undefined,
        altLeft: undefined,
        shiftLeft: undefined,
        // DOM 3 Events
        keyIdentifier: undefined,
        keyLocation: undefined
    });

    if (s6.uai.ie && options.type == 'keypress') {
        options.type = 'keydown'
    }

    // modifiersList を配列として生成
    var modifiersList = [];
    var modifierTypes = this._keyModifierTypes;
    for (var n in modifierTypes) {
        if (options[n]) {
            modifiersList.push(modifierTypes[n]);
        }
    }
    // options とマージする
    options = this.opts(options, { modifiersList: modifiersList.join(' ') });

    return options;
};
s6._mouseEvent = function(element, type, options) {
    return this.opts(options, {
        target: element,
        type: type,
        bubbles: true,
        cancelable: true,
        view: this._view(element),
        detail: 1,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        keyCode: 0,
        charCode: 0,
        which: undefined,
        button: 0, // 右クリックの場合は 3
        relatedTarget: element,
        // Safari
        altGraphKey: undefined,
        // IE
        offsetX: 0,
        offsetY: 0,
        x: 0,
        y: 0,
        srcElement: element,
        ctrlLeft: undefined,
        altLeft: undefined,
        shiftLeft: undefined
    });
};
s6._view = function(element) {
    var doc, view;
    if (!element) {
        return window;
    }
    else if (element.window == element) { // defaultView であるか
        return element;
    }
    else if (element.nodeType == 9 && (view = element.defaultView)) { // document であるか
        return view;
    }
    else if ((doc = element.ownerDocument) && (view = doc.defaultView)) { // 要素であれば
        return view;
    }
    else {
        return window;
    }
};


// オブジェクト名: Command コンストラクタ
// コマンドを構築する。
// コマンドとは、機能と操作を結びつける役割をするオブジェクトで、
// handle することで処理を追加できる。
// fire することで処理を実行できる。
// attach することでイベントを登録できる。
// attach の場合は handle する関数にイベントオブジェクトを渡すことはできない。
// これは、コマンドが特定のイベントに依存しないための設計である。
// attach では、第三引数に条件を渡すことでイベントの細かな種類で実行不実行を制御できる。
// たとえば、 command.attach(element, 'click', function(e) { return e.button == 3 }); 
// のようにすれば、右クリックのときに handle する関数を実行することができる。
// interval することで定期実行することができる　
// また、 handle するときも fire, attach, interval するときも引数を渡すことができる。
// その場合の引数は handle するときに渡されたもののあとに、その他が続く形式になる。
// たとえば、
// command.handle(handler, hoge, fuga, muga);
// command.fire(piyo, puyo);
// とした場合、 handler は handler.apply(hoge, [fuga, muga, piyo, puyo]);
// と呼び出されたと同様になる。
s6.Command = function() {
    var self = function() { return self.fire.apply(self, arguments) };
    var prototype = s6.Command.prototype;
    for (var n in prototype) {
        self[n] = prototype[n]
    };
    self.handlers = {};
    self.counter = 1;
    return self;
};

s6.Command.prototype = {
    unhandle: function(id) {
        s6.detach(id);
    },
    handle: function(handler, priority, self) {
        var args = s6.overArgs(3, arguments);
        return s6.attach(this, 'exec', this._handleCommand, priority, self, handler, args);
    },
    _handleCommand: function(e, handler, args) {
        return handler.apply(this, args.concat(e.args));
    },
    fire: function() {
        return s6.fire(this, 'exec', { args: s6.toArray(arguments) });
    },

    // 第三引数は省略可能
    // command.attach(document, 'click', arg1, arg2, arg3);
    // command.attach(document, 'click', function(e) { return e.button == 0 }, arg1, arg2, arg3);
    attach: function(receiver, type, func) {
        var length = 2;
        if (typeof func == 'function') {
            var checker = func;
            var length = 3;
        }
        var args = s6.overArgs(length, arguments);
        return s6.attach(receiver, type, this._attach, 0, this, checker, args);
    },
    _attach: function(e, checker, args) {
        if (!checker || checker(e)) {
            return this.fire.apply(this, args);
        }
        return true
    },
    detach: function(id) {
        s6.detach(id);
    },

    // 第二引数は繰り返しの有無(setTimeout と setInterval の違い)
    // 第一引数は繰り返すミリ秒数
    // command.interval(1000, true);  // 一秒おきに実行
    // command.interval(1000, false); // 一秒後に一度実行
    interval: function(ms, loop) {
        var args = s6.overArgs(2, arguments);
        return s6.timeInterval(this._interval, ms, loop, this, args);
    },
    _interval: function(args) {
        return this.fire.apply(this, args);
    },
    exterval: function(id) {
        s6.exterval(id);
    }
};

// オブジェクト名: commandize 関数
s6.mixinCommands = function(klass) {
    var proto = klass.prototype;
    var commandNames = s6.overArgs(1, arguments);

    // 最初の一回だけ実行
    if (!proto._mixinedCommand) {
        proto.commandNames = [];
        var methodNames = ['handle', 'unhandle', 'attach', 'detach'];
        for (var i = 0, l = methodNames.length; i < l; i ++) {
           var methodName = methodNames[i];
            proto[methodName] = s6['_' + methodName + 'Command'];
        }
        proto.createCommands = s6._createCommands;

        proto._mixinedCommand = true;
    }

    for (var i = 0, l = commandNames.length; i < l; i ++) {
        var commandName = commandNames[i];
        proto['_' + commandName] = proto[commandName];
        var f = proto[commandName] = function() {
            var command = this.commands[arguments.callee.commandName];
            return command.fire.apply(command, arguments);
        };
        f.commandName = commandName;
        proto.commandNames.push(commandName);
    }
};

s6._createCommands = function() {
    var commandNames = this.commandNames;
    for (var i = 0, l = commandNames.length; i < l; i ++) {
        var commandName = commandNames[i];
        this.handle(commandName, this['_' + commandName], 0, this);
    }
};

s6._handleCommand = function(commandType, handler, priority, self) {
    var args = s6.overArgs(1, arguments);

    // priority のデフォルト値は 0
    args[1] = args[1] || 0;

    // コマンド配列がない場合は追加
    if (!this.commands) {
        this.commands = {};
    }
    var command = this.commands[commandType];
    if (!command) {
        var command = this.commands[commandType] = new s6.Command();
    }
    return commandType + '|' + command.handle.apply(command, args);
};

s6._unhandleCommand = function(id) {
    var commandTypeAndId = id.split('|');
    var commandType = commandTypeAndId[0];
    id = + commandTypeAndId[1];

    if (!this.commands) {
        return;
    }
    var command = this.commands[commandType];
    if (!command) {
        return;
    }
    command.unhandle(id);
};

// コマンドに操作を割り当てる
// 引数は以下の 4 パターン
// 残った引数は追加引数として渡される
// obj.attach(
//     'click',
//     'step');
// obj.attach(
//     'click',
//     function(e) { return e.button == 0 }, 
//     'step');
// obj.attach(
//     elm,
//     'click',
//     'step');
// obj.attach(
//     elm,
//     'click',
//     function(e) { return e.button == 0 }, 
//     'step');
s6._attachCommand = function() {
    
    args = s6.toArray(arguments);

    if (typeof args[0] == 'string') {
        if (this.getElement) {
            var element = this.getElement();
        }
        else if (this.element) {
            var element = this.element;
        }
        args.unshift(element);
    }

    if (typeof args[2] == 'function') {
        var commandType = args.splice(3, 1);
    }
    else {
        var commandType = args.splice(2, 1);
    }

    if (!this.commands) {
        this.commands = {};
    }
    var command = this.commands[commandType];
    // コマンドが無い場合は新規にコマンドを追加
    if (!command) {
        var command = this.commands[commandType] = new s6.Command();
    }

    return command.attach.apply(command, args);
};

s6._detachCommand = function(id) {
    return s6.detach(id);
};


// オブジェクト名: load 関数
// DOM が構築されて描画される直前に実行されるはずの関数
// ここの部分は jQuery のソースを参考にしました。
// 何か問題があれば作者まで連絡してください。
// http://code.jquery.com/jquery-latest.js
s6.load = function(e) {
    // 二回目以降無視する or body が構築されていなければ
    // 実行しない
    if (s6._loaded || !document.body) {
        return;
    }
    s6._loaded = true;

    // s6.attach(s6, 'ready', function(){}); 
    // というように登録することで実行できる。
    s6.fire(s6, 'ready');

    // 一回目呼ばれた場合はすべてのイベントを破棄して
    // s6._loaded フラグをたてる
    var self = arguments.callee;
    if (s6.uai.ie) {
        window.detachEvent('onload', self);
    }
    else {
        if (s6.uai.gecko || s6.uai.opera) {
            document.removeEventListener('DOMContentLoaded', self, false);
        }
        else if (s6.uai.webkit && s6._webkitInitTimer) {
            clearInterval(s6._webkitInitTimer);
            s6._webkitInitTimer = null;
        }
        window.removeEventListener('load', self, false);
    }
};
// DOMContentLoaded イベントが使える場合
if (s6.uai.gecko || s6.uai.opera) {
    document.addEventListener('DOMContentLoaded', s6.load, false);
    window.addEventListener('load', s6.load, false);
}
// IE の場合は defer の script が読まれるタイミングで
else if (s6.uai.ie) {
    document.write('<script id="__s6_init" defer="true" src="//:"></script>');
    document.getElementById('__s6_init').onreadystatechange = function() {
        if (this.readyState != 'complete') {
            return;
        }
        this.parentNode.removeChild(this);
        s6.load();
    };
    window.attachEvent('onload', s6.load);
}
// WebKit の場合は setInterval で実行できるようになるまで待つ。
else if (s6.uai.applewebkit) {
    s6._webkitInitTimer = setInterval(function(){
        if (document.readyState == "loaded" || document.readyState == "complete" ) {

            clearInterval(s6._webkitInitTimer);
            s6._webkitInitTimer = null;

            s6.load();
        }
    }, 10); 
    window.addEventListener('load', s6.load, false);
}
else {
    window.addEventListener('load', s6.load, false);
}
s6.load();


// オブジェクト名: cstyle 関数
// ComputedStyle や currentStyle を取得する
// IE の場合 currentStyle は以下のような特性があるので注意
//  - 親要素自体が変わると変わるので注意
//  - DOM ツリーに繋がっていない場合は null となる
s6.cstyle = function(element) {
    var doc = element.ownerDocument;
    var view = doc.defaultView;
    if (view) {
        return view.getComputedStyle(element, '');
    }
    else {
        return element.currentStyle;
    }
};

// オブジェクト名: css 関数
// セレクタに指定したスタイルを適用します。
s6.css = function(selector, props, options) {
    options = this.opts(options, {
        doc: document
    });
    var uai = this.uai;

    if (typeof selector == 'string') {
    
        // 最初の一回だけは styleSheet を取得する
        var sheet = this._cssSheet;
        if (!sheet) {
            var doc = options.doc;
    
            // IE の場合は createStyleSheet 関数で一発
            if (uai.ie) {
                var sheet = doc.createStyleSheet();
                this._cssSheet = sheet;
                this._cssRules = sheet.rules;
            }
            else {
                // 一番最初の styleSheet を使ってみる。
                var sheet = this._cssSheet = document.styleSheets[0];
    
                // 一個も styleSheets が無い場合は style 要素を挿入する
                // 既存の styleSheets から取ってくる場合と比べると 10 倍のコストとなる
                if (!sheet) {
                    var styleElm = doc.createElement('style');
                    if (uai.applewebkit) {
                        styleElm.appendChild(document.createTextNode(''));
                    }
                    var heads = doc.getElementsByTagName('head');
                    if (heads) {
                        var parent = heads[0];
                    }
                    if (!parent) {
                        parent = doc.body;
                    }
                    parent.appendChild(styleElm);
                    sheet = this._cssSheet = styleElm.sheet;
                }
                this._cssRules = sheet.cssRules;
            }
            this._cssLength = this._cssRules.length;
        }
        rules = this._cssRules;
    
        if (selector in this._cssStyles) {
            var style = this._cssStyles[selector];
        }

        // selector が無ければ insertRule or addRule によって空のルールを生成し、
        // そのルールの style オブジェクトを取り出す
        else {
            if (uai.ie) {
                sheet.addRule(selector, 'dummy:0');
                this._cssLength ++;
                var addedRule = rules[this._cssLength - 1];
                var style = addedRule.style;
            }
            else {
                // 常に先頭に挿入
                sheet.insertRule(selector + '{}', this._cssLength);
                this._cssLength ++;
    
                // Safari
                if (uai.applewebkit) {
                    rules = this._cssRules = sheet.cssRules;
                    this._cssLength = rules.length;
                }
               
                // 常に先頭を取得 
                var addedRule = rules[this._cssLength - 1]; 
                var style = addedRule.style;
            }
            this._cssStyles[selector] = style;
        }
    }
    else {
        var style = selector;
    }

    if (s6.uai.ie) {
        if ('opacity' in props) {
            props.filter = 'alpha(opacity=' + props.opacity * 100 + ')';
            delete props.opacity;
        }
        if ('float' in props) {
            props.styleFloat = props.float;
            delete props.float;
        }
    }
    else {
        if ('float' in props) {
            props.cssFloat = props.float;
            delete props.float;
        }
    }

    for (var n in props) {
        style[n] = props[n];
    }
};
s6._cssStyles = {};


s6.intervalTime = 40;

// オブジェクト名: interval 関数
// interval 処理を行う関数を登録する。
// 登録された関数は 40ms ごとに一回呼び出される。
s6.interval = function(callback, self) {
    var callbacks = this._intervalCallbacks;
    var selfs = this._intervalSelfs;
    var args = this._intervalArguments;
    var uai = s6.uai;
    this._intervalCounter ++;

    var arg = s6.overArgs(2, arguments);
    callbacks[this._intervalCounter] = callback;
    selfs[this._intervalCounter] = self;
    args[this._intervalCounter] = arg;

    if (!this._intervalId) {
        for (var i in callbacks) { 
            if (uai.ie) {
                this._intervalId = setInterval(this._handleIntervalIefix, s6.intervalTime);
            }
            else {
                this._intervalId = setInterval(this._handleInterval, s6.intervalTime, callbacks, selfs, args);
            }
            break;
        }
    }
    return this._intervalCounter;
};

// オブジェクト名: exterval 関数
// interval 関数によって登録された関数を削除する
s6.exterval = function(id) {
    delete this._intervalCallbacks[id];
    delete this._intervalSelfs[id];

    if (this._intervalId && this.emptyHash(this._intervalCallbacks)) {
        clearInterval(this._intervalId);
        this._intervalId = null;
    }
};
s6._intervalCounter = 0;
s6._intervalCallbacks = {};
s6._intervalSelfs = {};
s6._intervalArguments = {};
s6._handleIntervalIefix = function() {
    var cbs = s6._intervalCallbacks;
    var selfs = s6._intervalSelfs;
    var args = s6._intervalArguments;
    for (var i in cbs) cbs[i].apply(selfs[i], args[i]);
};
s6._handleInterval = function(cbs, selfs, args) {
    for (var i in cbs) cbs[i].apply(selfs[i], args[i]);
};

// オブジェクト名: extervalAll 関数
// interval によって登録されている関数をすべて破棄します。
s6.extervalAll = function() {
    var callbacks = this._intervalCallbacks;
    for (var i in callbacks) {
        this.exterval(i);
    }
};

// オブジェクト名: timeInterval
// 第二引数で時間を指定して、第三引数で繰り返しの有無を渡します。
// s6.interval のラッパーとして実装されているので解除するときは s6.exterval を使います。
s6.timeInterval = function(callback, time, loop, self) {
    var args = s6.overArgs(4, arguments);
    var obj = {
        callback: callback,
        time: time,
        count: time,
        self: self,
        loop: loop,
        args: args
    };
    return (obj.id = s6.interval.call(s6, s6._handleTimeInterval, null, obj));
};
s6._handleTimeInterval = function(obj) {
    obj.count -= s6.intervalTime;
    if (obj.count <= 0) {
        obj.callback.apply(obj.self, obj.args);
        obj.count = obj.time;
        if (!obj.loop) {
            s6.exterval(obj.id);
        }
    }
};

// オブジェクト名: Page コンストラクタ
// new することによって Page オブジェクトを生成する
s6.Page = function(options) {

    // 継承用のプロトタイプを生成する
    if (options && options.forPrototype) {
        return;
    }

    this.options = options = s6.opts(options, {
        doc: document,
        transition: s6.transitions.sinoidal,
        pageEffect: s6.pageEffects.fade,
        pageEffectDelay: 0.4,
        element: undefined,
        noIndex: false,
        styleBase: 'default'
    });

    this.noIndex = options.noIndex;

    // action 関係のプロパティ
    this.actionIndex = 0;
    this.busy = false;
    this.actionStateCache = {
        interval: [],
        element: []
    };

    var doc = this.document = options.doc;
    var elm = this.element = options.element || doc.createElement('div');
    elm.__s6Page__ = this;
    var style = this.style = elm.style;
    this.transition = options.transition;
    if (elm.__s6Effect__) {
        var effectInfo = elm.__s6Effect__;
        this.pageEffect = s6.pageEffects[effectInfo[0]];
        var delay = effectInfo[1];
    }
    else {
        this.pageEffect = options.pageEffect;
        var delay = options.pageEffectDelay;
    }
    this.gain = 1 / (delay / (s6.intervalTime / 1000));

    style.display = 'none';
    this.display = false;

    s6.addClass(elm, 'page');

    var styleBase = elm.__s6StyleBase__;
    if (styleBase) {
        s6.addClass(elm, styleBase);
    }
    else {
        s6.addClass(elm, options.styleBase);
    }

    this.actions = [];
    if (elm.__s6Actions__) {
        var actions = elm.__s6Actions__;
        for (var i = 0, l = actions.length; i < l; i ++) {
            this.appendAction(actions[i]);
        }
    }

    if (s6.uai.ie && s6.uai.ie < 7) {
        var childs = elm.childNodes;
        for (var i = 0, l = childs.length; i < l; i ++) {
            var child = childs[i];
            if (child.nodeType == 1 && child.nodeName.toLowerCase() != 'script') {
                s6.addClass(child, 'element');
            }
        }
    }

/*
    // s6.mixinCommands をする時に必要
    if (this.createCommands) {
        this.createCommands();
    }
*/
};

// オブジェクト名: Page プロトタイプ
// Page オブジェクトのプロトタイプ。
s6.Page.prototype = {

    // インターバル処理
    interval: function() {
        var id = s6.interval.apply(s6, arguments)
        this.actionStateCache.interval.push(id);
        return id;
    },

    // インターバル解除
    exterval: function(id) {
        var cache = this.actionStateCache.interval;
        for (var i = 0, l = cache.length; i < l; i ++) {
            if (cache[i] == id) {
                cache.splice(i, 1);
                s6.exterval(id);
                return;
            }
        }
    },

    // インターバル全解除
    extervalAll: function() {
        var cache = this.actionStateCache.interval;
        for (var i = 0, l = cache.length; i < l; i ++) {
            var id = cache.push();
            s6.exterval(id);
        }
    },

    // ページのルート要素の style.display を true|false で指定する。
    // これを使うことによって値をキャッシュしてくれる。
    // display を変更する場合は常にこの関数を使うべき
    setDisplay: function(display) {
        if (this.display == display) {
            return;
        }
        if (display) {
            this.style.display = '';
        }
        else {
            this.style.display = 'none';
        }
        this.display = display;
    },

    // プレゼンテーション開始前に
    // 自分のページの表示状態を更新する。
    prepare: function(pagePosition) {
        if (pagePosition == 0) {
            this.setDisplay(true);
        }
        else {
            this.setDisplay(false);
        }
    },

    // このページのルート要素
    cloneElement: function() {
        var element = this.element.cloneNode(true);
        if (!this.display) {
            element.style.display = '';
        }
        return element;
    },

    // プレゼンテーションに割り当てられたときに
    // Presentation オブジェクトから呼び出される。
    setPresentation: function(presentation) {
        this.presentation = presentation;
    },

    // プレゼンテーションと切り離されたときに
    // Presentation オブジェクトから呼び出される。
    deletePresentation: function(presentation) {
        if (this.presentation == presentation) {
            this.presentation = null;
        }
    },

    // ページにアクションを追加する。
    // [[1, 2], 'fade opacity', 
    appendAction: function(action) {
        this.actions.push(action);
        action.setPage(this);
    },

    // ページのアクションを実行する
    action: function() {
        this.busy = true;
        var action = this.actions[this.actionIndex];
        action.action();
        return true;
    },

    // Action が終了すると
    // このメソッドが呼ばれる
    finishAction: function() {
        this.actionIndex ++;
        this.busy = false;
        return true;
    },

    // まだ実行していないアクションが存在すれば
    // true を返す。 !! は bool 化
    hasAction: function() {
        return !!this.actions[this.actionIndex];
    },

    // ページ遷移して見えなくなった場合に呼び出される。
    // それ以外で呼び出されることはない。
    // すべてのアクションを初期化する
    // たとえ、 busy であろうと途中で中断する。
    reset: function() {
        var actions = this.actions;

        for (var i = 0, l = actions.length; i < l; i ++) {
            actions[l - i - 1].reset();
        }

        this.actionIndex = 0;
        this.extervalAll();
        this.busy = false;
        return true;
    }
};

/*
s6.mixinCommands(s6.Page, 
    'reset', 'action', 'finishAction');
*/

// オブジェクト名: IndexPage コンストラクタ
// Page コンストラクタを拡張したもの
// Presentation の全ページのリストを作ることができる。
s6.IndexPage = function(options) {
    options = s6.opts(options, {
        styleBase: 'index',
        thema: 'dark'
    });

    s6.Page.apply(this, arguments);
    this.options = options = s6.opts(this.options, {
        rowCount: 5,
        presentation: undefined
    });

    this.pageElements = [];
    this.wrapperElements = [];

    if (options.presentation) {
        this.setPresentation(options.presentation);
    }

    this.rowCount = options.rowCount;
    this.innerPresentation = new s6.Presentation({
        noIndexPage: true, 
        additionalClassName: 'inner', 
        basePresentation: this.presentation,
        thema: options.thema
    });
    this.element.appendChild(this.innerPresentation.element);

/*
    // s6.mixinCommands をする時に必要
    if (this.createCommands) {
        this.createCommands();
    }
*/
};

// オブジェクト名: IndexPage プロトタイプ
// Page プロトタイプを継承している。
// IndexPage オブジェクトのプロトタイプとなるオブジェクト。
s6.IndexPage.prototype = new s6.Page({ forPrototype: true });
s6.IndexPage.prototype.prepare = function() {
    this.createIndex();
    this.innerPresentation.start();
};
s6.IndexPage.prototype.next = function() {
    return this.innerPresentation.next();
};
s6.IndexPage.prototype.prev = function() {
    return this.innerPresentation.prev();
};
s6.IndexPage.prototype.select = function(index) {
    if ('selectedIndex' in this) {
        s6.delClass(this.wrapperElements[this.selectedIndex], 'selected');
    }
    s6.addClass(this.wrapperElements[index], 'selected');
    this.selectedIndex = index;
    return true;
};
s6.IndexPage.prototype.unselect = function() {
    if ('selectedIndex' in this) {
        s6.delClass(this.wrapperElements[this.selectedIndex], 'selected');
    }
    delete this.selectedIndex;
    return true;
};
s6.IndexPage.prototype.go = function(index) {
    if ('selectedIndex' in this) {
        this.presentation.go(index);
    }
    return true;
};
s6.IndexPage.prototype.attachPage = function(event, callback) {
    s6.attach(this.element, event, this._attachPage, 0, this, this.element, callback);
};
s6.IndexPage.prototype._attachPage = function(e, parent, callback) {
    var element = e.target;
    do {
        if (element == parent) {
            return false;
        }
        else if (typeof element.__s6PageIndex__ == 'number') {
            break;
        }
    } while(element = element.parentNode);
    callback(element.__s6PageIndex__, element, element.parentNode);
    return false;
};
s6.IndexPage.prototype.createIndex = function() {
    var pages = this.presentation.pages;
    var innerPresentation = this.innerPresentation;
    var innerPage, innerElement;
    var pageMaxCount = this.rowCount * this.rowCount;
    var pageElements = this.pageElements;
    var wrapperElements = this.wrapperElements;
    var pageCount = 0;
    for (var i = 0, l = pages.length; i < l; i ++) {
        var page = pages[i];
        if (!page.noIndex) {
            if (pageCount % pageMaxCount == 0) {
                innerPage = new s6.Page({
                    styleBase: 'index',
                    pageEffect: s6.pageEffects.slide
                });
                innerPresentation.append(innerPage)
                innerElement = innerPage.element;
            }
            var pageElement = page.cloneElement()
            var wrapperElement = document.createElement('div');
            s6.addClass(wrapperElement, 'wrapper');
            wrapperElement.appendChild(pageElement);
            innerElement.appendChild(wrapperElement);
            pageElements.push(pageElement);
            wrapperElements.push(wrapperElement);
            pageElement.__s6PageIndex__ = i;
            pageCount ++;
        }
    }
};
s6.IndexPage.prototype.destroyIndex = function() {
    var innerPresentation = this.innerPresentation;
    innerPresentation.removeAll();
};

/*
s6.mixinCommands(s6.IndexPage,
    'go', 'next', 'prev', 'select', 'unselect');
*/


// オブジェクト名: Action コンストラクタ
// new することによってアクションを定義する
s6.Action = function(set, elements, actionEffect, transition, args) {
    this.elements = elements;
    this.actionEffectUpdate = actionEffect.update;
    this.actionEffectSnapshot = actionEffect.snapshot;
    this.actionEffectReset = actionEffect.reset;
    this.transition = transition;
    this.args = args;
    this.gain = 1 / (args[0] / (s6.intervalTime / 1000));
};

// オブジェクト名: Action プロトタイプ
// Action オブジェクトのコンストラクタ。
s6.Action.prototype = {
    setActionSet: function(set) {
        this.set = set;
        this.page = set.page;
    },
    action: function() {
        if (this.busy) {
            return;
        }
        this.busy = true;

        var position = new s6.IncrementalObject(this.gain);

        var page = this.page; 
        var transition = this.transition;
        var actionEffectUpdate = this.actionEffectUpdate;
        var args = this.args;
        var data = {};
        var elements = this.elements;
        var styles = this.styles = [];
        var length = elements.length;
        for (var i = 0; i < length; i ++) {
            styles.push(elements[i].style);
        }

        this.cache = {};
        this.actionEffectSnapshot.call(this, this.cache, elements, styles, length);

        this.effectId = page.interval(this.handleActionEffect, this,
            actionEffectUpdate, transition, position, data, args, elements, styles, length);

        this.handleActionEffect(
            actionEffectUpdate, transition, position, data, args, elements, styles, length);
    },
    handleActionEffect: function(actionEffectUpdate, transition, position, data, args, elements, styles, length) {
        var pos = +position;

        var x = transition(pos);
        actionEffectUpdate.call(this, actionEffectUpdate, x, data, args, elements, styles, length);
        if (pos >= 0.99) {
            this.set.finish(this);
            this.busy = false;
            if (this.effectId) {
                this.page.exterval(this.effectId);
            }
            this.effectId = null;
        }
    },
    reset: function() {
        if (this.cache) {
            this.actionEffectReset.call(this, this.cache, this.elements, this.styles, this.elements.length);
        }
    }
}

// オブジェクト名: ActionSet コンストラクタ
// new することによってページ内のアクションを行うためのオブジェクトを作る。
s6.ActionSet = function(actionInfos) {
    var actions = this.actions = [];
    for (var i = 0, l = actionInfos.length; i < l; i ++) {
        var actionInfo = actionInfos[i];

        var elements = actionInfo.shift();
        var effectInfos = actionInfo.shift().split(/\s+/);
        var actionEffect = s6.actionEffects[effectInfos.shift()];
        var args = actionInfo;
        var transition;

        for (var j = 0, l0 = effectInfos.length; j < l0; j ++) {
            var effectInfo = effectInfos.shift();
            var argsChanger;

            // transition があれば transition を取得
            if (s6.transitions[effectInfo]) {
                transition = s6.transitions[effectInfo];
            }
            // transition じゃない場合で actionEffect に changeArgs_xxxx という関数があれば実行
            // args を補完する目的
            else if (argsChanger = actionEffect['changeArgs_' + effectInfo]) {
                args = argsChanger(args);
            }
        }

        // transition のデフォルト値は今のところ決め打ち
        transition = transition || s6.transitions.sinoidal;

        actions.push(new s6.Action(this, elements, actionEffect, transition.asc, args));
    }
};


// オブジェクト名: ActionSet コンストラクタ
// new することによってページ内のアクションを行うためのオブジェクトを作る。
s6.ActionSet = function(actionInfos) {
    var actions = this.actions = [];
    for (var i = 0, l = actionInfos.length; i < l; i ++) {
        var actionInfo = actionInfos[i];

        var elements = actionInfo.shift();
        var effectInfos = actionInfo.shift().split(/\s+/);
        var actionEffect = s6.actionEffects[effectInfos.shift()];
        var args = actionInfo;
        var transition;

        for (var j = 0, l0 = effectInfos.length; j < l0; j ++) {
            var effectInfo = effectInfos.shift();
            var argsChanger;

            // transition があれば transition を取得
            if (s6.transitions[effectInfo]) {
                transition = s6.transitions[effectInfo];
            }
            // transition じゃない場合で actionEffect に changeArgs_xxxx という関数があれば実行
            // args を補完する目的
            else if (argsChanger = actionEffect['changeArgs_' + effectInfo]) {
                args = argsChanger(args);
            }
        }

        // transition のデフォルト値は今のところ決め打ち
        transition = transition || s6.transitions.sinoidal;

        actions.push(new s6.Action(this, elements, actionEffect, transition.asc, args));
    }
};

// オブジェクト名: ActionSet プロトタイプ
// ActionSet オブジェクトのコンストラクタ。
s6.ActionSet.prototype = {
    setPage: function(page) {
        this.page = page;
        var actions = this.actions;
        for (var i = 0, l = actions.length; i < l; i ++) {
            actions[i].setActionSet(this);
        }
    },
    action: function() {
        if (this.busy) {
            return;
        }
        this.count = 0;
        this.countEnd = this.actions.length;
        this.busy = true;
        var actions = this.actions;
        for (var i = 0, l = actions.length; i < l; i ++) {
            actions[i].action();
        }
    },
    finish: function(action) {
        if (this.busy) {
            this.count ++;
            if (this.count >= this.countEnd) {
                this.page.finishAction();
                this.count = null;
                this.countEnd = null;
                this.busy = false;
            }
        }
    },
    reset: function() {
        var actions = this.actions;
        for (var i = 0, l = actions.length; i < l; i ++) {
            var action = actions[i];
            action.reset();
        }
    }
};


// オブジェクト名: Presentation コンストラクタ
// new することによって Presentation オブジェクトを作る
s6.Presentation = function(options) {
    options = s6.opts(options, {
        doc: document,
        thema: 'dark',
        ratio: 0.75,                    // プレゼンテーションの縦横比
        width: undefined,               // 横幅、省略されなかった場合 height から求められる
        height: undefined,              // 縦幅、指定されても width が指定された場合は無視される。両方指定されなかった場合は width が 400 となる
        fontSize: 0.1,                  // height にこの値を掛けた値がベースのフォントサイズとなる
        startIndex: 0,
        noIndexPage: false,             // このオプションが true の場合、 index ページは作られません
        additionalClassName: undefined, // 追加されるクラス名です。
        basePresentation: undefined,    // ここにプレゼンが設定されている場合は、そのプレゼンから ratio, width, height, fontSize を継承
        element: undefined              // このオプションに要素が設定された場合は要素を生成しません
    });
    if (!options.width && !options.height) {
        options.width = 1000;
    }

    this.index = options.startIndex || 0;
    this.pages = [];
    this.funcPages = {};
    this.backQueue = [];

    // DOM 関連の設定
    var doc = this.document = options.doc;
    var elm = this.element = options.element || doc.createElement('div');

    // options.element で与えられた要素が body だった場合
    // あらたに、要素を生成
    if (options.element && elm.nodeName.toLowerCase() == 'body') {
        var bodyElm = elm;
        this.element = elm = document.createElement('div');
        bodyElm.appendChild(elm);
    }

    elm.__s6Presentation__ = this;
    var style = this.style = elm.style;
    var body = this.body = doc.body;

    s6.addClass(elm, 's6');
    s6.addClass(elm, options.thema);
    if (s6.uai.mac) {
        s6.addClass(elm, 'mac');
    }
    else {
        s6.addClass(elm, 'win');
    }
    if (options.additionalClassName) {
        s6.addClass(elm, options.additionalClassName);
    }

    if (options.basePresentation) {
        var basePresentation = options.basePresentation;
        this.width = basePresentation.width;
        this.height = basePresentation.height;
        this.fontSize = basePresentation.fontSize;
        s6.css(style, {
            WIDTH: '100%',
            height: '100%',
            fontSize: '100%'
        });
    }
    else {
        // page 内の大きさ(%, em)の基準となる値(width, height, fontSize)の設定
        if (options.width) {
            var width = this.width = options.width;
            var height = this.height = width * options.ratio;
        }
        else {
            var height = this.height = options.height;
            var width = this.width = options.height / options.ratio;
        }
        var fontSize = this.fontSize = height * options.fontSize;
        s6.css(style, {
            width: width + 'px',
            height: height + 'px',
            fontSize: fontSize + 'px'
        });
    }

    // オプションで要素が指定された場合
    // 直下の小要素を読んで
    // page に追加する
    if (options.element) {
        var node = options.element.firstChild;

        var pages = [];
        if (node) {
            // すべての子ノードを走査
            do {
                // 要素だったら
                if (node.nodeType == 1 && node.nodeName.toLowerCase() != 'script' && !s6.hasClass(node, 's6')) {
                    pages.push(new s6.Page({ element: node , noIndex: node.__s6Separator__ }));
                }
            } while(node = node.nextSibling);
        }
        for (var i = 0, l = pages.length; i < l; i ++) {
            this.append(pages[i]);
        }
    }
    else {
        body.appendChild(elm);
    }

    // 機能ページ
    if (!options.noIndexPage) {
        var indexPage = this.funcPages.index = new s6.IndexPage({
            pageEffect: s6.pageEffects.fadeScaleFromUp,
            transition: s6.transitions.lenear,
            thema: options.thema,
            presentation: this
        });
        this.element.appendChild(indexPage.element);
    }

/*
    // s6.mixinCommands をする時に必要
    if (this.createCommands) {
        this.createCommands();
    }
*/
};


// オブジェクト名: Presentation プロトタイプ
// Presentation オブジェクトのプロトタイプ
s6.Presentation.prototype = {
    // 現在のページのアクションを消化する
    // もし、現在のページのアクションが無ければページを遷移させる。
    step: function() {
        var page = this.getPage(this.index);

        // Action 中だった場合
        if (page.busy) {
            return true;
        }

        if (page.hasAction()) {
            page.action();
        }
        else {
            return this.next();
        }
        return true;
    },

    // 次のページに移動するトリガーとなる関数
    // 現在が機能ページの場合は機能ページの next を呼び出す
    next: function() {
        if (typeof this.index == 'number') {
            return this.go(this.index + 1);
        }
        else {
            this.getPage(this.index).next();
        }
        return true;
    },

    // 前のページに移動するトリガーとなる関数
    // 現在が機能ページの場合は機能ページの prev を呼び出す
    prev: function() {
        if (typeof this.index == 'number') {
            return this.go(this.index - 1);
        }
        else {
            this.getPage(this.index).prev();
        }
        return true;
    },

    // 一つ前に開いていたページに戻る
    // ブラウザの戻るボタンみたいなもの
    // 機能ページに遷移した後に戻る場合に使う
    back: function() {
        var backQueue = this.backQueue;
        var result = true;
        if (backQueue.length) {
            result = this.go(this.backQueue.pop());
        }
        // push されたページをキャンセル
        this.backQueue.pop();
        return result;
    },

    // 移動先のページの index を指定することで
    // ページを移動する。
    go: function(toIndex) {
        if (this.busy) {
            return true;
        }
        
        var fromIndex = this.index;
        var toPage = this.getPage(toIndex);

        if (!(toPage instanceof s6.Page)) {
            return true
        }

        var fromPage = this.getPage(fromIndex);

        if (fromIndex == toIndex) {
            return true;
        }

        // 戻れるようにいまのページをキャッシュさせておく
        this.backQueue.push(fromIndex);

        this.toIndex = toIndex;
        this.fromIndex = fromIndex;

        // エフェクト中は操作を無効にする
        // あとで仕様変更はあるかも
        this.busy = true;

        // Effect 開始
        // 1 ページ目から 2 ページ目というように
        // 昇順にページ遷移が行われた場合は遷移先のページの
        // エフェクトが使われる
        // (ページ遷移のエフェクトは、終わるページより始まるページのものだから)
        // その逆で 2 ページ目から 1 ページ目のように
        // 降順にページ遷移が行われた場合は遷移元のページの
        // エフェクトの巻き戻しが使われる
        // (感覚として真逆に動いていないと変だから)
        if (this.getDirection(fromIndex, toIndex)) {
            // 正順にページ遷移した場合
            this.startEffect(fromPage, toPage, toPage.pageEffect, toPage.transition.asc, toPage.gain);
        }
        else {
            // 逆順にページ遷移した場合
            this.startEffect(toPage, fromPage, fromPage.pageEffect, fromPage.transition.desc, fromPage.gain);
        }
        return true;
    },

    // Effect を開始するためのインターバルの登録と
    // 最初の一タイムラインを行う。
    startEffect: function(fromPage, toPage, pageEffect, transition, gain) {
        var position = new s6.IncrementalObject(gain);

        // イベント中に起こった現象を保存するためのキャッシュ
        var data = {};

        // 要素とスタイル
        var toElement = toPage.element;
        var toStyle = toPage.style;
        var fromElement = fromPage.element;
        var fromStyle = fromPage.style;

        // インターバルの登録
        this.effectId = s6.interval(
            this.pageEffect, this,
            pageEffect, transition, position, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle);

        // 最初の一タイムラインを実行
        this.pageEffect(
            pageEffect, transition, position, data,
            toPage, toElement, toStyle,
            fromPage, fromElement, fromStyle);
    },

    // ページ番号または機能の id からページを取り出す。
    getPage: function(i) {
        // 数字に変換可能ならば配列に格納
        if (!isNaN(+i)) {
            var page = this.pages[i];
        }
        else {
            var page = this.funcPages[i];
        }
        return page;
    },

    // ページの進む方向を決める
    // エフェクトの方向を順方向か逆方向か決める
    // 順方向だったら true
    // 逆方向だったら false を返す
    getDirection: function(from, to) {
        var fromType = typeof from;
        var toType = typeof to;

        if (fromType == 'number') {
            if (toType == 'number') {
                if (from - to < 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            if (toType == 'number') {
                return false;
            }
            else {
                return true;
            }
        }
    },

    pageEffect: function(
        pageEffect, transition, position, data,
        toPage, toElement, toStyle,
        fromPage, fromElement, fromStyle
    ) {
        var pos = +position;
        var x = transition(pos);

        if (x <= 0.01) {
            toPage.setDisplay(false);
            fromPage.setDisplay(true);
        }
        else if (x >= 0.99) {
            toPage.setDisplay(true);
            fromPage.setDisplay(false);
        }
        else {
            toPage.setDisplay(true);
            fromPage.setDisplay(true);
            pageEffect.update.call(
                this, pageEffect, x, data,
                toPage, toElement, toStyle,
                fromPage, fromElement, fromStyle
            );
        }

        if (pos <= 0.01) {
            pageEffect.setup.call(
                this, pageEffect, x, data,
                toPage, toElement, toStyle,
                fromPage, fromElement, fromStyle
            );
        }
        else if (pos >= 0.99) {
            pageEffect.teardown.call(
                this, pageEffect, x, data,
                toPage, toElement, toStyle,
                fromPage, fromElement, fromStyle
            );
            this.pageEffectEnd();
        }
    },

    // ページエフェクトが終わると呼び出される
    pageEffectEnd: function() {
        if (this.effectId) {
            s6.exterval(this.effectId);
            this.effectId = null;
        }
        this.busy = false;
        this.index = this.toIndex;
        this.toIndex = null;
        this.getPage(this.fromIndex).reset();
        this.fromIndex = null;
    },

    // プレゼンテーションの開始
    start: function() {
        var index = this.index, pages = this.pages;
        for (var i = 0, l = pages.length; i < l; i ++) {
            pages[i].prepare(i - index);
        }
        for (var n in this.funcPages) {
            this.funcPages[n].prepare();
        }
    },

    // ページの追加
    append: function(page) {
        page.setPresentation(this);
        this.pages.push(page);
        var pageElement = page.element;

        // もう既にページの要素が
        // プレゼンの要素の直下にある場合
        if (!(pageElement.parentNode == this.element)) {
            this.element.appendChild(page.element);
        }
    },

    // ページの挿入
    insert: function(page, i) {
        if (typeof i == 'undefined' || i >= this.pages.length) {
            this.append(page);
        }
        else {
            page.setPresentation(this);
            var beforePage = this.pages[i];
            this.pages.splice(i, 0, page);
            this.element.insertBefore(page.element, beforePage.element);
        }
    },

    // ページの削除
    remove: function(page) {
        var pages = this.pages;
        for (var i = 0, l = pages.length; i < l; i ++) {
            if (pages[i] == page) {
                this._remove(page);
                pages.splice(i, 1);
                return;
            }
        }
    },

    // ページを削除の内部関数
    _remove: function(page) {
        page.deletePresentation(this);
        this.element.removeChild(page.element);
    },

    // すべてのページの削除
    removeAll: function() {
        var pages = this.pages;
        for(var i = 0, l = pages.length; i < l; i ++) {
            this._remove(pages.shift());
        }
    },

    // プレゼンテーションを終了する
    // すべてのイベントを解除する
    // プレゼンテーション要素を body から削除する
    end: function() {
        // TODO イベントを手動で削除
        if (this.effectId) {
            s6.exterval(this.effectId);
            this.effectId = null;
        }
        this.removeAll();
        this.body.removeChild(this.element);
    }
};

/*
s6.mixinCommands(s6.Presentation,
    'go', 'step', 'next', 'prev', 'back');
*/


// オブジェクト名: page.elementQuery
// FIXME スーパー適当な実装をなんとかする。
// div[1-3,6]/span[1]
s6.elementQuery = function(element, text) {
    return arguments.callee.step([element], text.split('/'));
};

// div[1-3,6]
s6.elementQuery.step = function(elements, texts) {
    var text = texts.shift();
    if (text) {
        var callee = arguments.callee;
        var results = [];
        var splited = text.split(/[\[\]]/);
        var tagName = splited[0];
        var condition = callee.condition(splited[1]);
        for (var i = 0, l0 = elements.length; i < l0; i ++) {
            var element = elements[i];
            var childs = element.childNodes;
            var count = 0;
            for (var j = 0, l1 = childs.length; j < l1; j ++) {
                var child = childs[j];
                if (child.nodeType == 1 && (tagName == '*' || tagName.toLowerCase() == child.tagName.toLowerCase())) {
                    if (!condition || condition[count]) {
                        results.push(child);
                    }
                    count ++;
                }
            }
        }
        return callee(results, texts);
    }
    return elements;
};
// [1-3,6]
s6.elementQuery.step.condition = function(text) {
    if (!text) return null;
    var results = {};
    var conditions = text.split(',');
    for (var i = 0, l = conditions.length; i < l; i ++) {
        var conditionss = conditions[i].split('-');
        if (conditionss.length == 1) {
            results[+conditionss[0]] = true;
        }
        else {
            for (var j = +conditionss[0], l0 = +conditionss[1]; j <= l0; j ++) {
                results[j] = true;
            }
        }
    }
    return results;
};


// オブジェクト名: presentation 関数
s6.presentation = function(json) {
};

// オブジェクト名: page 関数
// HTML ソース上にプレゼン用のデータを埋め込む
s6.page = function(json) {
    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length - 1];

    var wrap = json.wrap;
    if (wrap) {
        var pElm = currentScript;
        var childs = [];
        while (pElm = pElm.previousSibling) {
            if (pElm.nodeType == 1 && pElm.nodeName.toLowerCase != 'script') {
                wrap --;
                childs.unshift(pElm);
                if (wrap == 0) {
                    break;
                }
            }
        }
        var elm = document.createElement('div');
        for (var i = 0, l = childs.length; i < l; i ++) {
            elm.appendChild(childs[i]);
        }
        currentScript.parentNode.insertBefore(elm, currentScript);
    }
    else {
        var elm = currentScript.parentNode;
    }

    var backgroundImage = json.backgroundImage;
    if (backgroundImage) {
        var imgElm = document.createElement('img');
        imgElm.src = backgroundImage;
        var imgStyle = imgElm.style;
        imgStyle.position = 'absolute';
        imgStyle.width = '100%';
        imgStyle.height = '100%';
        imgStyle.top = '0';
        imgStyle.left = '0';
        imgStyle.zIndex = '1';

        elm.appendChild(imgElm);
    }

    var backgroundWrapper = json.backgroundWrapper;
    if (typeof backgroundWrapper != 'undefined') {
        var wrpElm = document.createElement('div');
        var wrpStyle = wrpElm.style;
        wrpStyle.position = 'absolute';
        wrpStyle.background = 'black';
        wrpStyle.width = '100%';
        wrpStyle.height = '100%';
        wrpStyle.top = '0';
        wrpStyle.left = '0';
        wrpStyle.zIndex = '2';
        if (s6.uai.ie) {
            wrpStyle.filter = 'alpha(opacity=' + backgroundWrapper * 100 + ')';
        }
        else {
            wrpStyle.opacity = backgroundWrapper;
        }

        elm.appendChild(wrpElm);
    }

    var effect = json.effect;
    if (effect) {
        if (typeof effect == 'string') {
            effect = [effect, 0.4];
        }
        elm.__s6Effect__ = effect;
    }

    var separator = json.separator;
    if (separator) {
        var parent = elm.parentNode;
        var sepElm = document.createElement('div');
        sepElm.__s6Separator__ = true;
        parent.insertBefore(sepElm, elm);
        if (typeof separator == 'string') {
            separator = [separator, 0.4];
        }
        sepElm.__s6Effect__ = separator;
    }

    var styleBase = json.styleBase;
    if (styleBase) {
        elm.__s6StyleBase__ = styleBase;
    }

    var callee = arguments.callee;

    var styles = json.styles;
    if (styles) {
        for (var n in styles) {
            var elements = s6.elementQuery(elm, n);
            for (var i = 0, l = elements.length; i < l; i ++) {
                s6.css(elements[i].style, styles[n]);
            }
        }
    }

    var actions = json.actions;
    if (actions) {
        actions = arguments.callee.parseActions(elm, actions);
        elm.__s6Actions__ = actions;
    }
};

// オブジェクト名: page.parseActions 関数
s6.page.parseActions = function(element, actions) {
    var result = [];
    var callee = arguments.callee;
    for (var i = 0, l = actions.length; i < l; i ++) {
        var actionSet = actions[i];
        var asResult = [];
        if (actionSet.length < 2 || (actionSet[0] instanceof Array && actionSet[1] instanceof Array)) {
            for (var j = 0, l0 = actionSet.length; j < l0; j ++) {
                asResult.push(callee.action(element, actionSet[j]));
            }
        }
        else {
            asResult.push(callee.action(element, actionSet))
        }
        result.push(new s6.ActionSet(asResult));
    }
    return result;
};
s6.page.parseActions.action = function(element, action) {
    if (typeof action[0] == 'string') {
        action[0] = [action[0]];
    }
    var queries = action[0];
    var elements = [];
    for (var i = 0, l0 = queries.length; i < l0; i ++) {
        var queryResults = s6.elementQuery(element, queries[i]);
        for (var j = 0, l1 = queryResults.length; j < l1; j ++) {
            elements.push(queryResults[j]);
        }
    }
    action[0] = elements;
    return action;
};


(function(s6) {
    for (var selector in s6.defaultStyles) {
        s6.css(selector, s6.defaultStyles[selector]);
    }
})(s6)

