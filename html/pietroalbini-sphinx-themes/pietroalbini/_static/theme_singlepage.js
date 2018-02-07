var ThemeSinglePage = {

    enabled: false,
    _callbacks: [],

    // Callbacks setup

    onload: function(callback) {
        this._callbacks.push(callback);
    },

    _onload: function() {
        for (var i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i]();
        }
    },

    _onclick: function(e) {
        e.preventDefault();
        var link = this.href;

        ThemeSinglePage.load(link);
    },

    // Initialization

    init: function() {
        // Use an absolute URL for URL_ROOT
        var link = document.createElement("a");
        link.href = DOCUMENTATION_OPTIONS.URL_ROOT;
        DOCUMENTATION_OPTIONS.URL_ROOT = link.href;

        // Single-page magic requires the pushState API
        if (!(window.history && history.pushState)) {
            this._onload();
            return false;
        }

        window.addEventListener("popstate", this._pop_page);

        this.enabled = true;
        this._init();
    },

    _init: function() {
        this._onload();
        this.hook_links();
    },

    hook_links: function() {
        var links = document.querySelectorAll("a.internal");
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", this._onclick);
        }
    },

    // Load pages

    load_abs: function(page) {
        this.load(DOCUMENTATION_OPTIONS.URL_ROOT+page);
    },

    load: function(link, push) {
        if (push === undefined) push = true;

        window.scroll(0, 0);

        this._show_loader();

        var request = new XMLHttpRequest();
        request.open("GET", link, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                ThemeSinglePage._replace_content(request.responseText, link, push);
            } else {
                location.href = link;
            }
        };
        request.onerror = function() {
            location.href = link;
        };

        request.send();
    },

    _pop_page: function(event) {
        ThemeSinglePage.load(location.href, false);
    },

    // Loading spinner

    _show_loader: function() {
        document.querySelector("h1.loading").classList.remove("hidden");
        document.querySelector("h1.title").classList.add("hidden");
    },

    _hide_loader: function() {
        document.querySelector("h1.loading").classList.add("hidden");
        document.querySelector("h1.title").classList.remove("hidden");
    },

    // Actually swap pages

    _replace_content: function(content, link, push) {
        // Cheaty way to parse the html element
        var newbody = document.implementation.createHTMLDocument("Blame Edge");
        newbody.documentElement.innerHTML = content;

        function copy_element(selector) {
            var newel = newbody.querySelector(selector).innerHTML;
            document.body.querySelector(selector).innerHTML = newel;
        }

        copy_element("h1.title");
        copy_element("div.body");
        copy_element("div.sphinxsidebarwrapper");
        copy_element("div.nav-container.mobile-only");

        // Update the page title
        var newtitle = document.querySelector("h1.title").innerHTML;
        var suffix = DOCUMENTATION_OPTIONS.TITLE_SUFFIX;

        document.querySelector("title").innerHTML = newtitle+suffix;

        if (push) {
            history.pushState(null, document.title, link);
        }

        // Move the focus to the wanted section
        if (link.indexOf("#") !== -1) {
            location.hash = link.split("#")[1];
        }

        this._init();

        this._hide_loader();
    },

    // Get the current page

    current: function() {
        var url = location.href.replace(DOCUMENTATION_OPTIONS.URL_ROOT, "")
                          .split("#")[0].split("?")[0];

        // Remove trailing slash
        if (url.slice(-1) == "/") {
            url = url.slice(0, -1);
        }

        return url
    },
};
