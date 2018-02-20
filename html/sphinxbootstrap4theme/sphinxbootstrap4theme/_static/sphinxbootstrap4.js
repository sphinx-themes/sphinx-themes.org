function stickySidebar() {
    
    var topPadding = $('.navbar').outerHeight(true);
    
    var $sidebarwrapper = $('.sphinxsidebarwrapper');
    var $document = $('.document');
    var sidebarTop = $sidebarwrapper.offset().top - parseInt($sidebarwrapper.css('margin-top'),10);
    var $window = $(window);
    var documentBottom = $document.outerHeight(true) + topPadding;
    var sidebarHeight = $sidebarwrapper.height();

    if ($document.outerHeight(true) + topPadding < $sidebarwrapper.height()) {
        return;
    }

    $window.scroll(function() {
        var documentBottom = $document.outerHeight(true) + topPadding;
        var sidebarHeight = $sidebarwrapper.height();
        var scrollTop = $window.scrollTop() + topPadding - sidebarTop;

        if (documentBottom < sidebarHeight + scrollTop) {
          $sidebarwrapper.css({'margin-top': documentBottom - sidebarHeight });
        } else if (scrollTop > 0) {
          $sidebarwrapper.css({'margin-top': scrollTop});
        } else {
          $sidebarwrapper.css({'margin-top': 0});
        }
    });
}

function sidebarTreeView() {
    var $toctree = $('.sidebartoctree > ul');

    $toctree.find('li').each(function(index, element) {
        $li = $(element).has('ul')

        $li.children('a').append('<a class="pull-xs-right arrow collapsed" data-toggle="collapse" href="#collapse' + index + '" aria-expanded="true"></a>').end()
            .children('ul').addClass('collapse').attr({'id': 'collapse' + index}).end();
        if ($li.hasClass('current')) {
            $li.children('ul').addClass('in').end()
                .children('a').children('a').removeClass('collapsed');
        }
    });

}

$(function() {
    $('body').fadeIn(0).scrollspy({ target: 'li.current' });

    // Grid layout Style
    $(".sphinxsidebarwrapper > .sidebartoctree > ul").addClass('nav nav-pills nav-stacked')
        .find('li').addClass('nav-item').end()
        .find('a.reference').addClass('nav-link').end()

    
    $(".sphinxsidebar").addClass("col-md-3");
    $(".document").addClass("col-md-9");
    sidebarTreeView();
    
    $(".related").addClass("col-md-12");
    $(".footer").addClass("col-md-12");

    
    // Navbar Globaltoc Style
    $("#navbar-pages li.toctree-l1").unwrap();
    $('#navbar-pages > ul').children('li')
        .find('a').addClass('dropdown-item').end()
        .has('ul').addClass('dropdown')
            .find('ul').addClass('dropdown-menu');
    $("#navbar-pages > ul").find("li").has("ul").children("a").addClass("arrow");// Tables
    $("table.docutils").addClass("table table-sm table-bordered table-striped")
        .find("thead")
        
        .addClass("thead-inverse")
        

    // Admonition
    $(".admonition").addClass("alert")
        .filter(".hint").addClass("alert-info").children('p.admonition-title').prepend('<div class="icon"><div class="question-mark"></div></div>').end().end()
        .filter(".note, .warning").addClass("alert-warning").children('p.admonition-title').prepend('<div class="icon"><div class="information-mark"></div></div>').end().end()
        .filter(".tip, .important").addClass("alert-success").children('p.admonition-title').prepend('<div class="icon"><div class="check-mark"></div></div>').end().end()
        .filter(".caution, .danger, .error").addClass("alert-danger").children('p.admonition-title').prepend('<div class="icon"><div class="exclamation-mark"></div></div>').end().end();

    // images
    $("img").addClass("img-fluid");

    // download
    $("a.download").prepend('<div class="icon"><div class="download"></div></div>');

});



$(window).on('load', function(){
  stickySidebar()
});
