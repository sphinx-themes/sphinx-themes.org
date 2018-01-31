/*global window,document*/
/*eslint-env: browser*/
window.addEventListener('load', function() {
    'use strict';
    if(document.querySelector && document.addEventListener && document.body.setAttribute) {
        document.querySelector('.hbpdoc-page').className += ' hbpdoc-floating-sidebar';

        var btns = document.querySelectorAll('.hbpdoc-toc-toggle');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', listener);
        }
    } else {
        console.log('Unsupported Browser');
    }

    var menuState = '';
    function listener(event) {
        event.preventDefault();
        menuState = (menuState === 'open' ? '' : 'open');
        document.querySelector('.hbpdoc-sidebar').setAttribute('data-open', menuState);
    }
}, false);
