var ThemeSearch = {

    init: function() {
        if (ThemeSinglePage.enabled) {

            $("form#search").submit(function(e) {
                e.preventDefault();
                var newquery = $("#search-input").val();

                ThemeSinglePage.load_abs("search/?q="+newquery);
            });

            ThemeSinglePage.onload(function() {
                if( ThemeSinglePage.current() == "search" ) {
                    this.page_loaded();
                } else {
                    // Reset the input value on non-search pages
                    $("#search-input").val("");
                }
            }.bind(this));

            Search.loadIndex(DOCUMENTATION_OPTIONS.URL_ROOT+"searchindex.js");
        }
    },

    page_loaded: function() {
        $(".search-searching").show();
        $(".search-nothing").hide();
        $(".search-results").hide();

        if ($.getQueryParameters().q) {
            var query = $.getQueryParameters().q[0];
            $("#search-input").val(query);

            this.execute(query);
        }

        if (!ThemeSinglePage.enabled) {
            Search.loadIndex(DOCUMENTATION_OPTIONS.URL_ROOT+"searchindex.js");
        }
    },

    execute: function(term) {
        // If the index wasn't loaded yet wait for it
        if (! Search.hasIndex()) {
            Search.theme_addIndexReadyCallback(function() {
                ThemeSearch.execute(term);
            });
            return;
        }

        var apiobjs = this.api_objects();
        var index = Search._index;

        var results = Search.query(term);
        if (results.length === 0) {
            $(".search-nothing").show();
            $(".search-searching").hide();
            $(".search-results").hide();
        } else {
            $(".search-results").hide();
            $(".search-searching").show();
            $(".search-nothing").hide();

            $(".search-results-container").empty();

            for (var i = 0; i < results.length; i++) {
                var item = results[results.length-i-1];

                var type = "page";
                if (apiobjs.indexOf(item[2].replace("#", "")) !== -1) {
                    type = "code";
                } else if (this.url_for(item[0], "") ===
                           DOCUMENTATION_OPTIONS.TOC_URL) {
                    type = "toc";
                }

                var result = $("<div></div>").addClass("search-result");
                result.addClass(type);
                var link = $("<a></a>")
                    .attr("href", this.url_for(item[0], item[2],
                                    type !== "code" ? term : undefined))
                    .addClass("internal");

                if (type === "code") {
                    var content_box = $("<code></code");
                    var content = $("<span></span>").addClass("pre")
                                                    .text(item[1]);
                    content_box.append(content);
                    link.addClass("reference", "internal").append(content_box);
                } else if (type === "toc") {
                    link.text("Table of contents");
                } else {
                    link.text(item[1]);
                }

                result.append(link);
                if (type === "code") {
                    var splitted = item[1].split(".");
                    var objname = splitted.pop();
                    var prefix = splitted.join(".");

                    var indexobj = index.objects[prefix][objname];
                    var objtype = index.objnames[indexobj[1]][2];
                    var page_title = index.titles[indexobj[0]];
                    var page_url = index.filenames[indexobj[0]];

                    var sub = $("<p></p>").text(objtype+", in ");
                    sub.append($("<a></a>")
                               .attr("href", this.url_for(page_url, ""))
                               .text(page_title)
                               .addClass("internal")
                    );
                    result.append(sub);
                }
                $(".search-results-container."+type)
                    .append(result);
            }

            var parts = ["code", "page"];
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if ($(".search-results-container."+part+" .search-result")
                        .length === 0) {
                    $(".search-results-container."+part).hide();
                } else {
                    $(".search-results-container."+part).show();
                }
            }

            $("#search-count").text(results.length);
            if (results.length == 1) {
                $("#search-count-plural").hide();
            } else {
                $("#search-count-plural").show();
            }

            $(".search-results").show();
            $(".search-searching").hide();
            $(".search-nothing").hide();

            // Add listeners to links
            if (ThemeSinglePage.enabled) ThemeSinglePage.hook_links();
        }
    },

    url_for: function(page, hash, highlight) {
        if (highlight === undefined) {
            var highlight = "";
        } else {
            var highlight = "?highlight="+$.urlencode(highlight);
        }

        var pageurl;
        // dirhtml builder
        if (DOCUMENTATION_OPTIONS.FILE_SUFFIX === '') {
            pageurl = page+"/";
            if (pageurl.match(/\/index\/$/)) {
                pageurl = pageurl.substring(0, pageurl.length-6);
            } else if (pageurl == "index/") {
                pageurl = "";
            }
        } else {
            pageurl = page;
        }

        return DOCUMENTATION_OPTIONS.URL_ROOT+pageurl+highlight+hash;
    },

    api_objects: function() {
        var index = Search._index.objects;

        var result = [];
        for (var objname in index) {
            for (var item in index[objname]) {
                result.push(objname+"."+item);
            }
        }
        return result;
    },

    fastsearch: {

        _key: (function() {
            var key = "theme_fastsearch_";

            var baseurl = document.createElement("a");
            baseurl.href = DOCUMENTATION_OPTIONS.URL_ROOT;

            return key+baseurl.href;
        })(),

        available: function() {
            return localStorage.getItem(this._key) !== null;
        },

        get_cache: function() {
            return JSON.parse(localStorage.getItem(this._key));
        },

        enable: function(callback) {
            if (! Search.hasIndex()) {
                Search.theme_addIndexReadyCallback(function() {
                    ThemeSearch.fastsearch.enable(callback);
                });

                Search.loadIndex(DOCUMENTATION_OPTIONS.URL_ROOT+"searchindex.js");
                return;
            }

            localStorage.setItem(this._key, JSON.stringify(Search._index));
            if (callback !== undefined) {
                callback();
            }
        },

        disable: function() {
            localStorage.removeItem(this._key);
        },

        update: function() {
            this.disable();
            Search._index = null;
            this.enable();
        },
    },
};
