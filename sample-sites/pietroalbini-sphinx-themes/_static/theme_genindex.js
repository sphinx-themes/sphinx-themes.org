function ThemeGenindex() {
    // Unfortunately genindex is impossible to customize how I want from the
    // template files, so I'll do that with JavaScript
    $(".genindex-section > ul > li").each(function() {

        var current = $(this).children("a").text();
        var result = (/(\(\) )?\((.*)\)$/).exec(current);

        if (result === null) {
            return;
        }

        current = current.replace("("+result[2]+")", "");
        $(this).children("a").text(current);

        if ($(this).has("ul").length !== 0) {
            var ul = $(this).children("ul");

            ul.prepend($("<li></li>").append($("<a></a>")
                .attr("href", $(this).children("a").attr("href"))
                .text(result[2]).addClass("internal")));

            ul.children("li").children("a").each(function() {
                var ul_result = (/^\((.*)\)$/).exec($(this).text());
                if (ul_result !== null) {
                    $(this).text(ul_result[1]);
                }
            });

            $(this).children("a").after($("<span></span>")
                                        .text("can be either a:"));
            $(this).children("a").replaceWith($(this).children("a").text());

        } else {
            $(this).append($("<span></span>").text("a "+result[2]));
        }
    });

    if (ThemeSinglePage.enabled) {
        ThemeSinglePage.hook_links();
    }
}

$(function() {
    if (ThemeSinglePage.enabled) {
        ThemeSinglePage.onload(function() {
            if (ThemeSinglePage.current() == "genindex") {
                ThemeGenindex();
            }
        });
    }
});
