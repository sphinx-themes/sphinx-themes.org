function calcMetrics(options) {
    var html = document.documentElement;
    var options = s6.opts(options, {
        width: html.offsetWidth,
        height: html.offsetHeight,
        ratio: 0.75,
        fontSize: 0.1
    });
    var left = 0;
    var top = 0;
    var width = options.width;
    var height = options.height;

    if (height / width < options.ratio) {
        var originalWidth = width;
        width = height / options.ratio;
        left = (originalWidth - width) / 2;
    }
    else {
        var originalHeight = height;
        height = width * options.ratio;
        top = (originalHeight - height) / 2;
    }

    return {
        left: left,
        top: top,
        width: width,
        height: height,
        fontSize: height * options.fontSize
    }
}

var pr;

s6.attach(s6, 'ready', function ready() {
    var fontSize = 0.08;
    var html = document.documentElement;
    var metrics = calcMetrics({fontSize: fontSize});
    var startIndex = 0;

    var result;
    if (location.hash) {
        startIndex = $('.section').index($(location.hash));
        if(startIndex < 0) {
            startIndex = 0;
        }
    }

    var container = $('.section')[0];
    pr = new s6.Presentation({
            thema: 'sphinx',
            element: container,
            width: metrics.width,
            height: metrics.height,
            startIndex: startIndex,
            fontSize: fontSize
        });
    pr.style.left = metrics.left + 'px';
    pr.style.top = metrics.top + 'px';
    pr.start();

    $('.footer')[0].style.fontSize = calcMetrics({fontSize: fontSize * 0.4}).fontSize + 'px';

    var indexNoOutline = false;

    pr.funcPages.index.attachPage('click', function(i, element, wrapper) {
        indexNoOutline = true;
        setTimeout(function() {
            indexNoOutline =false
        }, 1000);
        wrapper.style.background = '';
        pr.go(i);
    });

    pr.funcPages.index.attachPage('mouseover', function(i, element, wrapper) {
        if (indexNoOutline) return;
        wrapper.className += ' selected';
    });
    
    pr.funcPages.index.attachPage('mouseout', function(i, element, wrapper) {
        wrapper.className = 'wrapper';
    });

    try {
        var isIframe = !(window.parent == window);
    } catch(e) {
        isIframe = true;
    }

    // add navigation overlay
    function createNaviArea(id, options){
        var opts = s6.opts(options, {
            widthRatio: 1.0,
            heightRatio: 1.0,
            dockTo: 'top',
            label: ''
        });
        function calcNaviMetrics(){
            var html = document.documentElement;
            var metrics = calcMetrics({fontSize: fontSize});
            var naviAreaWidth = ((html.offsetWidth - metrics.width) / 2 + (metrics.width * opts.widthRatio));
            var naviAreaHeight = ((html.offsetHeight - metrics.height) / 2 + (metrics.height * opts.heightRatio));
            var width = (opts.widthRatio >= 1.0)? html.offsetWidth: naviAreaWidth;
            var height = (opts.heightRatio >= 1.0)? html.offsetHeight: naviAreaHeight;
            var left = 0;
            var top = 0;
            if(opts.dockTo == 'right') {
                left = html.offsetWidth - width;
            }
            else if(opts.dockTo == 'bottom') {
                top = html.offsetHeight - height;
            }
            return {
                width: width,
                height: height,
                left: left,
                top: top
            };
        }
        function setMetrics(elem, metrics) {
            elem.css('position', 'absolute')
                .css('left',  metrics.left + 'px')
                .css('top',  metrics.top + 'px')
                .css('width',  metrics.width + 'px')
                .css('height',  metrics.height + 'px');
            return elem;
        }
        var naviMetrics = calcNaviMetrics();
        var elem = $('<div>', {id: id, class: 'navigation-area-'+opts.dockTo});
        setMetrics(elem, naviMetrics);
        var label = $('<span>')
            .css('line-height', naviMetrics.height + 'px')
            .text(opts.label);
        elem.append(label);
        $(window).resize(function(){
            var naviMetrics = calcNaviMetrics();
            setMetrics(elem, naviMetrics);
            label.css('line-height', naviMetrics.height + 'px')
        });
        return elem;
    }
    var naviIdx  = createNaviArea('idxpage', {heightRatio: 0.05, dockTo: 'top', label: 'index'});
    var naviBack = createNaviArea('backpage', {heightRatio: 0.05, dockTo: 'bottom', label: 'back'});
    var naviNext = createNaviArea('nextpage', {widthRatio: 0.05, dockTo: 'right', label: '≫'});
    var naviPrev = createNaviArea('prevpage', {widthRatio: 0.05, dockTo: 'left', label: '≪'});
    s6.attach(naviIdx[0],  'click', function() { pr.go('index') });
    s6.attach(naviBack[0], 'click', 'back', 0, pr);
    s6.attach(naviNext[0], 'click', 'step', 0, pr);
    s6.attach(naviPrev[0], 'click', 'prev', 0, pr);
    $('div.document')
        .append(naviIdx)
        .append(naviBack)
        .append(naviNext)
        .append(naviPrev);

    // setup mouse events
    s6.attach(document, 'click', 'step', 0, pr);
    s6.attach(document, 'keypress Right', 'step', 0, pr);
    s6.attach(document, 'keypress Left',  'prev', 0, pr);
    s6.attach(document, 'keypress Up',    function() { pr.go('index') });
    s6.attach(document, 'keypress Down',  'back', 0, pr);

    // inject 'target=_blank' to link-targets.
    // prevent paging if click link-target.
    var clickGuard = function(evt){
        pr.busy = true;
        setTimeout(function(){pr.busy = false;}, 1000);
        return true;
    }
    $('a[href]')
        .attr('target', '_blank')
        .click(clickGuard)
        .mousedown(clickGuard)
        .mouseup(clickGuard)
        .bind('contextmenu', clickGuard);

    // setup swipe events
    if($(document).touchwipe) {
        var wipeSetting = {
            wipeLeft: function(){ pr.step(); },
            wipeRight: function(){ pr.prev(); },
            wipeUp: function(){ pr.go('index'); },
            wipeDown: function(){ pr.back(); },
            preventDefaultEvent: true
        }
        $(document).touchwipe(wipeSetting);
        $(pr.element).touchwipe(wipeSetting);
    }

    // resize window
    $(window).resize(function(){
        var html = document.documentElement;
        var metrics = calcMetrics({fontSize: fontSize});
        pr.style.left = metrics.left + 'px';
        pr.style.top = metrics.top + 'px';
        pr.style.width = metrics.width + 'px';
        pr.style.height = metrics.height + 'px';
        pr.style.fontSize = metrics.fontSize + 'px';

        $('.footer')[0].style.fontSize = calcMetrics({fontSize: fontSize * 0.4}).fontSize + 'px';
    });

    // handle page number and set to href
    pr._go  = pr.go;
    pr.go = function(toIndex) {
        pr._go(toIndex);
        if(pr.getPage(toIndex)) {
            location.href = '#' + $(".section")[toIndex].id; //want to set at paging.
        }
    }
});

