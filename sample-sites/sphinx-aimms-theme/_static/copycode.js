function addCopyButtonToCode() {
    // get all code elements
    var allCodeBlocksElements = $("div.highlight pre");

    // For each element, do the following steps
    allCodeBlocksElements.each(function (ii) {
        // define a unique id for this element and add it
        var currentId = "codeblock" + (ii + 1);
        $(this).attr('id', currentId);

        // create a button that's configured for clipboard.js
        // point it to the text that's in this code block
        // add the button just after the text in the code block w/ jquery
        var clipButton = '<button class="btn copybtn" data-clipboard-target="#' + currentId + '"><img src="https://clipboardjs.com/assets/images/clippy.svg" width="13" alt="Copy to clipboard"></button>';
        $(this).after(clipButton);
    });

    // tell clipboard.js to look for clicks that match this query
    new Clipboard('.btn');
}

$(document).ready(function () {
    // Once the DOM is loaded for the page, attach clipboard buttons
    addCopyButtonToCode();


    // resize containers if toc is visible
    if ($(".localtoc").is(":visible")) {
        $('.document').addClass('document-toc');
    } else {
        $('.document').removeClass('document-toc');
    }


    var target = $('.localtoc')
    target.after('<div class="affix" id="affix"></div>')

    var affix = $('.affix')
    affix.append(target.clone(true))

    // Show affix on scroll.
    var element = document.getElementById('affix')
    if (element !== null) {
        var position = target.position()
        window.addEventListener('scroll', function () {
            var height = $(window).scrollTop()
            if (height > position.top - 30) {
                target.css('visibility', 'hidden')
                affix.css('display', 'block')
            } else {
                affix.css('display', 'none')
                target.css('visibility', 'visible')
            }
        })
    }


    // cache the navigation links
    var $navigationLinks = $('.localtoc > ul > li > ul > li > a');
    // add class to the proper sections
    $navigationLinks.each(function() {
        var id = $(this).attr('href');
        $(id).addClass('js-section');
    })

    // cache (in reversed order) the sections
    var $sections = $($(".js-section").get().reverse());

    // map each section id to their corresponding navigation link
    var sectionIdTonavigationLink = {};
    $sections.each(function () {
        var id = $(this).attr('id');
        sectionIdTonavigationLink[id] = $('.localtoc > ul > li > ul > li > a[href=\\#' + id + ']');
    });


    // throttle function, enforces a minimum time interval
    function throttle(fn, interval) {
        var lastCall, timeoutId;
        return function () {
            var now = new Date().getTime();
            if (lastCall && now < (lastCall + interval)) {
                // if we are inside the interval we wait
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    lastCall = now;
                    fn.call();
                }, interval - (now - lastCall));
            } else {
                // otherwise, we directly call the function
                lastCall = now;
                fn.call();
            }
        };
    }

    function highlightNavigation() {
        // get the current vertical position of the scroll bar
        var scrollPosition = $(window).scrollTop();

        // iterate the sections
        $sections.each(function () {
            var currentSection = $(this);
            // get the position of the section
            var sectionTop = currentSection.offset().top;

            // if the user has scrolled over the top of the section
            if (scrollPosition >= sectionTop - 300) {
                // get the section id
                var id = currentSection.attr('id');
                // get the corresponding navigation link
                var $navigationLink = sectionIdTonavigationLink[id];
                // if the link is not active
                if (!$navigationLink.hasClass('active')) {
                    // remove .active class from all the links
                    $navigationLinks.removeClass('active');
                    // add .active class to the current link
                    $navigationLink.addClass('active');
                }
                // we have found our section, so we return false to exit the each loop
                return false;
            }
        });
    }

    $(window).scroll( throttle(highlightNavigation,100) );

    // if you don't want to throttle the function use this instead:
    // $(window).scroll( highlightNavigation );
});
