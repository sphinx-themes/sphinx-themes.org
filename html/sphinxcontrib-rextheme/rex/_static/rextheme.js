
$(document).ready(function () {

$('.sidebar').find('a[href=#]')
    .attr('href', '#'+$('.body .section').attr('id'))

var $sidebar = $('.sidebar-wrapper');
var offset = $sidebar.offset();
$sidebar.css({position: "fixed", top: offset.top, left: offset.left})

$(window).resize(function () {
    var $sidebar = $('.sidebar-wrapper');
    $sidebar.css({position: "absolute", top: 0, left: 0});
    var offset = $sidebar.offset();
    $sidebar.css({position: "fixed", top: offset.top, left: offset.left})
});

$(window).scroll(function () {
    var $sidebar = $('.sidebar'),
        sidebar_top = $sidebar.offset().top,
        $selected_li = null,
        selected_top = null;

    $sidebar.find('li').each(function () {
        var $li = $(this);
        $li.children('a').each(function () {
            var $a = $(this);
            var ref = $a.attr('href');
            var offset = $(ref).offset();
            if (offset) {
                var top = offset.top;
                if (selected_top === null || (top > selected_top && top <= sidebar_top+100)) {
                    $selected_li = $li;
                    selected_top = top;
                }
            }
        });
    });
    $sidebar.find('li')
        .removeClass('active');
    if ($selected_li) {
        $selected_li.addClass('active');
    }
});

$(window).scroll();

});

