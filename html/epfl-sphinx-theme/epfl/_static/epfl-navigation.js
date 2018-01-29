var current_search_base = null;
function change_search_base(radio){
    jQuery('#search-options').remove();
    jQuery("#searchform input[type=radio]").removeAttr("checked");    
    var rid = radio.attr('id');
    var label =  jQuery('label[for=' + rid + ']'); 
    switch (rid){
        case "search-engine-local":
            jQuery('#searchform').attr("action", "search.html");
            break;
        default:
            jQuery('#searchform').attr("action", "http://search.epfl.ch/process_web2010");
            break;
    }
    if (jQuery('#searchfield').val() === jQuery('#searchform label.current').attr('title')) { jQuery('#searchfield').val(''); }
    if (jQuery('#searchfield').val() === '') { jQuery('#searchfield').val(label.attr('title')); }
    current_search_base.toggleClass('current');
    current_search_base = label;
    current_search_base.toggleClass('current');
    radio.attr('checked','checked');
    radio.blur();
    if (document.referrer.indexOf('#') != -1) {
        radio.focus();
    }
}




jQuery(document).ready(function(){
    current_search_base = jQuery('#searchform label.current');
    change_search_base(jQuery("#search-engine-person"));

    if (jQuery.browser.msie) {
        jQuery('#search-box input[type=radio]').click(function(){ change_search_base(jQuery(this)); this.blur(); this.focus(); });
    }
    
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
       jQuery('#search-box label').click(function () { var el = jQuery(this).attr('for'); change_search_base(jQuery('#' + el));});
    }
    jQuery('#search-box input[type=radio]').change(function(){ change_search_base(jQuery(this)); });
    jQuery('#searchlink').click(function(){ jQuery('#searchfield').focus();});
    jQuery('#searchfield').focus(function(){ if (jQuery(this).val() === current_search_base.attr('title')){ jQuery(this).val('').addClass('focused');} });
    jQuery('#searchfield').blur(function() { if (jQuery(this).val() === '') { jQuery(this).val(jQuery('#searchform label.current').attr('title')).removeClass('focused');} });
    jQuery('#searchfield').keypress(function(e){ if (e.which === 13) { jQuery(this).parent('form').submit();} });
    
    /* navigation: Dropdown menus */

    jQuery('#main-navigation .toctree-l1').hoverIntent(
        function(){ jQuery(this).children('ul').addClass('visible');}, 
        function(){ jQuery(this).children('ul').removeClass('visible');}
    );
    
    jQuery(".tree li.current").addClass('open');
    jQuery(".tree > ul").treeview({ 'collapsed': true, 'unique': false });
/*    jQuery(".tree > ul").children().addClass('local-color');
    jQuery(".tree > ul li a").hover(
        function(e) { e.stopPropagation(); 
                      jQuery('.tree > ul li').removeClass("hover");
                      jQuery(this).parent().addClass('hover');
                      },
        function(e) { e.stopPropagation(); jQuery(this).parent().removeClass("hover");}
    );
*/
    /*
    
    
    jQuery('.toggler').click(function(){ jQuery(this).toggleClass("toggled-active").next().slideToggle("slow"); return false;});  
    
    jQuery(".box.two-cols div.box-col:even",this).addClass("box-left-col");
    jQuery(".box.two-cols div.box-col:odd", this).addClass("box-right-col");
    jQuery("#content:not(.fullpage-content) .box:odd",this).addClass("last-col");
    
    jQuery("img[rel]").overlay();
    
    jQuery.jGoogleAnalytics('UA-4833294-1', {topLevelDomain: '.epfl.ch'} );
*/    
});
