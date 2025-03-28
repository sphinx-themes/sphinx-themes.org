let cs = {
    main_nav_link_sel: 'li.toctree-l1 > a',
    main_nav_toggle_sel: 'li.toctree-l1 > span.toggle',
    curr_nav_link_sel: 'li.toctree-l1.current a',

    init: function() {
        this.navigation = $('.cs-nav-toc');
        this.searchbox = $('#searchbox');
        this.init_navigation();
        this.bind_navigation();
        this.handle_searchbox();
        this.handle_mobile();
        this.handle_images();
        this.handle_header();
        $(window).on('resize', cs.handle_searchbox_resize.bind(this));
    },

    init_navigation: function() {
        let anchor = window.location.hash;
        let sel = `${this.curr_nav_link_sel}[href='${anchor}']`;
        $(sel, this.navigation).addClass('active');
    },

    bind_navigation: function() {
        let curr_nav_links = $(this.curr_nav_link_sel, this.navigation);
        curr_nav_links.on('click', function(e) {
            $(curr_nav_links).removeClass('active');
            $(this).addClass('active');
        });
        let main_nav_links = $(this.main_nav_link_sel, this.navigation);
        main_nav_links.before('<span class="toggle" />');
        let toggle_nav_links = $(this.main_nav_toggle_sel, this.navigation);
        toggle_nav_links.on('click', function(e) {
            let elem = $(e.currentTarget).next();
            let expanded = elem.hasClass('expanded') || (
                elem.hasClass('current') && !elem.hasClass('collapsed')
            );
            let ul = $('> ul', elem.parent())
            if (expanded) {
                elem.addClass('collapsed').removeClass('expanded');
                ul.slideUp(300);
            } else {
                elem.removeClass('collapsed').addClass('expanded');
                ul.slideDown(300);
            }
        }.bind(this));
    },

    handle_header: function() {
        let ext_link_width = $('#cs-ext-links').outerWidth();
        let button_width = $('#navbar-toggle').outerWidth(true);
        let maxwidth = ext_link_width + button_width + 'px';
        $('#logo').css('max-width', `calc(100% - ${maxwidth} - 3rem)`);
    },

    handle_searchbox: function() {
        if (window.matchMedia('(min-width:768px)').matches) {
            this.searchbox.detach().appendTo('#nav-search');
        } else {
            this.searchbox.detach().prependTo('#cs-mobile-menu');
        }
    },

    handle_searchbox_resize: function() {
        let nav_exists = $('#nav-search').children().length > 0;
        if (window.matchMedia('(max-width:768px)').matches && nav_exists) {
            this.searchbox.detach().prependTo('#cs-mobile-menu');
        } else if (window.matchMedia('(min-width:768px)').matches && !nav_exists) {
            this.searchbox.detach().appendTo('#nav-search');
        }
    },

    handle_mobile: function() {
        const is_mobile_device = (
            'ontouchstart' in document.documentElement
            && navigator.userAgent.match(/Mobi/)
        );
        if (is_mobile_device) {
            let btn = $(`
              <button id="scrolltop" class="btn">
                <i class="bi bi-arrow-up">
              </button>
            `);
            $('#cs-layout').append(btn);
            btn.hide();
            btn.on('click', () => {
                $(window).scrollTop(0);
            });
            $(window).on('scroll', () => {
                if (btn.css('display') === 'none') {
                    btn.fadeIn('fast');
                } else if ($(window).scrollTop() === 0) {
                    btn.fadeOut('fast');
                }
            })
        } else {
            cs.handle_codeblocks();
        }
    },

    handle_codeblocks: function() {
        let elem = $(`
          <button class="copy-literal-block btn btn-outline-primary"
                  data-text="Copy">
            Copy
          </button>
        `);
        $('.highlight').prepend(elem);
        $('.copy-literal-block').on('click', function() {
            let el = $(this);
            navigator.clipboard.writeText(el.next().text());
            $('.copy-literal-block').attr('data-text', 'Copy');
            el.attr('data-text', 'Copied!');
        });
    },

    handle_images: function() {
        $('img').each(function() {
            let im = $(this);
            im.attr('title', im.attr('alt'));
        });
    },

    highlight_search_words: function() {
        var params = $.getQueryParameters();
        var terms = (params.highlight) ? params.highlight[0].split(/\s+/) : [];
        if (terms.length) {
            var body = $('div.body');
            if (!body.length) {
                body = $('body');
            }
            window.setTimeout(function() {
                $.each(terms, function() {
                    body.highlightText(this.toLowerCase(), 'highlighted');
                });
            }, 10);
            let btn = `
              <button class="highlight-link bi bi-eye-slash input-group-text"
                      onclick="Documentation.hideSearchWords()"
                      btn-title="remove highlighted words">
              </button>
            `
            $(btn).insertBefore($('#searchbox input'));
        }
    },

    hide_search_words: function() {
        $('#searchbox .highlight-link').fadeOut(300).remove();
        $('span.highlighted').removeClass('highlighted');
    }
}

// Patch search highlighting related functions
Documentation.highlightSearchWords = cs.highlight_search_words;
Documentation.hideSearchWords = cs.hide_search_words;

$(function() {
    cs.init();
});
