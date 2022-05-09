(() => { function dom_loaded() {
    'use strict';
    const sidebar = document.querySelector('.sphinxsidebar');
    const sidebar_tabbable = sidebar.querySelectorAll('input, textarea, select, button, a[href], area[href], iframe');
    const sidebar_button = document.getElementById('sidebar-button');
    const sidebar_checkbox = document.getElementById('sidebar-checkbox');
    const topbar = document.getElementById('topbar');
    const overlay = document.getElementById('overlay');
    const root = document.documentElement;

    sidebar.setAttribute('id', 'sphinxsidebar');  // for aria-controls

    Element.prototype.css = function (name, ...value) {
        if (value.length) {
            this.style.setProperty(name, ...value);
        } else {
            return window.getComputedStyle(this).getPropertyValue(name);
        }
    }

    function updateSidebarAttributesVisible() {
        sidebar_button.setAttribute('title', "Collapse sidebar");
        sidebar_button.setAttribute('aria-label', "Collapse sidebar");
        sidebar_button.setAttribute('aria-expanded', true);
        sidebar.setAttribute('aria-hidden', false);
        sidebar_tabbable.forEach(el => el.setAttribute('tabindex', 0));
    }

    function updateSidebarAttributesHidden() {
        sidebar_button.setAttribute('title', "Expand sidebar");
        sidebar_button.setAttribute('aria-label', "Expand sidebar");
        sidebar_button.setAttribute('aria-expanded', false);
        sidebar.setAttribute('aria-hidden', true);
        sidebar_tabbable.forEach(el => el.setAttribute('tabindex', -1));
    }

    sidebar.setAttribute('tabindex', -1);

    function store(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
        }
    }

    sidebar_checkbox.addEventListener('change', event => {
        if (event.target.checked) {
            updateSidebarAttributesVisible();
            store('sphinx-sidebar', 'visible');
            document.body.classList.remove('topbar-folded');
            sidebar.focus({preventScroll: true});
            sidebar.blur();
        } else {
            updateSidebarAttributesHidden();
            store('sphinx-sidebar', 'hidden');
            if (document.scrollingElement.scrollTop < topbar.offsetHeight) {
                document.body.classList.remove('topbar-folded');
            } else {
                document.body.classList.add('topbar-folded');
            }
            document.scrollingElement.focus({preventScroll: true});
            document.scrollingElement.blur();
        }
    });

    if (sidebar_checkbox.checked) {
        updateSidebarAttributesVisible();
    } else {
        updateSidebarAttributesHidden();
    }

    function show() {
        sidebar_checkbox.checked = true;
        sidebar_checkbox.dispatchEvent(new Event('change'));
    }

    function hide() {
        sidebar_checkbox.checked = false;
        sidebar_checkbox.dispatchEvent(new Event('change'));
    }

    sidebar_button.addEventListener('keydown', event => {
        if (event.code === 'Enter' || event.code === 'Space') {
            sidebar_button.click();
            event.preventDefault();
        }
    });

    var touchstart;

    document.addEventListener('touchstart', event => {
        if (event.touches.length > 1) { return; }
        var touch = event.touches[0];
        if (touch.clientX <= sidebar.offsetWidth) {
            touchstart = {
                x: touch.clientX,
                y: touch.clientY,
                t: Date.now(),
            };
        }
    });

    document.addEventListener('touchend', event => {
        if (!touchstart) { return; }
        if (event.touches.length > 0 || event.changedTouches.length > 1) {
            touchstart = null;
            return;
        }
        var touch = event.changedTouches[0];
        var x = touch.clientX;
        var y = touch.clientY;
        var x_diff = x - touchstart.x;
        var y_diff = y - touchstart.y;
        var t_diff = Date.now() - touchstart.t;
        if (t_diff < 400 && Math.abs(x_diff) > Math.max(100, Math.abs(y_diff))) {
            if (x_diff > 0) {
                if (!sidebar_checkbox.checked) {
                    show();
                }
            } else {
                if (sidebar_checkbox.checked) {
                    hide();
                }
            }
        }
        touchstart = null;
    });

    $('.sidebar-resize-handle').on('mousedown', event => {
        $(window).on('mousemove', resize_mouse);
        $(window).on('mouseup', stop_resize_mouse);
        document.body.classList.add('sidebar-resizing');
        return false;  // Prevent unwanted text selection while resizing
    });

    $('.sidebar-resize-handle').on('touchstart', event => {
        event = event.originalEvent;
        if (event.touches.length > 1) { return; }
        $(window).on('touchmove', resize_touch);
        $(window).on('touchend', stop_resize_touch);
        document.body.classList.add('sidebar-resizing');
        return false;  // Prevent unwanted text selection while resizing
    });

    var ignore_resize = false;

    function resize_base(event) {
        if (ignore_resize) { return; }
        var window_width = window.innerWidth;
        var width = event.clientX;
        if (width > window_width) {
            root.css('--sidebar-width', window_width + 'px');
        } else if (width > 10) {
            root.css('--sidebar-width', width + 'px');
        } else {
            ignore_resize = true;
            hide();
        }
    }

    function resize_mouse(event) {
        resize_base(event.originalEvent);
    }

    function resize_touch(event) {
        event = event.originalEvent;
        if (event.touches.length > 1) { return; }
        resize_base(event.touches[0]);
    }

    function stop_resize_base() {
        if (ignore_resize) {
            root.css('--sidebar-width', '19rem');
            ignore_resize = false;
        }
        store('sphinx-sidebar-width', root.css('--sidebar-width'));
        document.body.classList.remove('sidebar-resizing');
    }

    function stop_resize_mouse(event) {
        $(window).off('mousemove', resize_mouse);
        $(window).off('mouseup', stop_resize_mouse);
        stop_resize_base();
    }

    function stop_resize_touch(event) {
        event = event.originalEvent;
        if (event.touches.length > 0 || event.changedTouches.length > 1) {
            return;
        }
        $(window).off('touchmove', resize_touch);
        $(window).off('touchend', stop_resize_touch);
        stop_resize_base();
    }

    $(window).on('resize', () => {
        const window_width = window.innerWidth;
        if (window_width < sidebar.offsetWidth) {
            root.css('--sidebar-width', window_width + 'px');
        }
    });

    // This is part of the sidebar code because it only affects the sidebar
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                let height;
                if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
                    height = entry.borderBoxSize[0].blockSize;
                } else {
                    height = entry.contentRect.height;
                }
                root.css('--topbar-height', height + 'px');
            }
        });
        resizeObserver.observe(topbar);
    }

    var $current = $('.sphinxsidebar *:has(> a[href^="#"])');


    $current.addClass('current-page');
    if ($current.length) {
        var top = $current.offset().top;
        var height = $current.height();
        const topbar_height = topbar.offsetHeight;
        if (top < topbar_height || top + height > sidebar.offsetHeight) {
            $current[0].scrollIntoView(true);
        }
    }
    const small_screen = window.matchMedia('(max-width: 39rem)');

    $current.on('click', '> a', () => {
        if (small_screen.matches) {
            hide();
        }
    })

    if ($current.length === 1 && $current[0].childElementCount === 1 && small_screen.matches) {
        hide();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dom_loaded);
} else {
    dom_loaded();
}})();

