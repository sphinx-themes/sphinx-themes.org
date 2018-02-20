$(function() {
    $('body').fadeIn(0);
    $('.page-content > blockquote:first-child').remove();
    styleMdlHeading();
    styleMdlDrower();
    styleMdlTable();
    styleMdlDownloadLink();
    styleMdlAdmonition();
    styleMdlFooter();
    styleMdlCodeBlock();
    styleMdlContents();

    $('input[type="submit"]').addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent');
    $('.mdl-layout__content').focus();
});

function styleMdlHeading() {
    $('h1, h2, h3, h4, h5, h6').addClass('mdl-color-text--primary');
}
/**
 * contentsディレクティブにスタイルを追加します。
 */
function styleMdlContents() {
    $('.contents, .toctree-wrapper').addClass('mdl-color-text--primary')
    $('.contents a, .toctree-wrapper a').addClass('mdl-color-text--primary');
}

/**
 * tableタグにmdlクラスを追加します。
 */
function styleMdlTable() {
    $('table').not('.footnote, .indextable')
        .addClass('mdl-data-table mdl-js-data-table mdl-shadow--2dp')
        .removeAttr('border')
        .find('th, td').addClass('mdl-data-table__cell--non-numeric');
}

function styleMdlDownloadLink() {
   $('a.download').prepend('<i class="material-icons">file_download</i>');
}

function styleMdlAdmonition() {
    $('div.admonition.hint > p.admonition-title')
        .prepend('<i class="material-icons">help_outline</i>');
    $('div.admonition.note > p.admonition-title')
        .prepend('<i class="material-icons">info_outline</i>');
    $('div.admonition.tip > p.admonition-title')
        .prepend('<i class="material-icons">lightbulb_outline</i>');
    $('div.admonition.important > p.admonition-title')
        .prepend('<i class="material-icons">check_circle</i>');
    $('div.admonition.error > p.admonition-title,div.admonition.caution > p.admonition-title,div.admonition.danger > p.admonition-title')
        .prepend('<i class="material-icons">error_outline</i>');
    $('div.admonition.warning > p.admonition-title').prepend('<i class="material-icons">warning</i>');
}

function styleMdlCodeBlock() {
    $('pre').hover(function() {
        $(this).attr('click-to-copy', 'click to copy...');
    });
    $('pre').click(function(){
        var result = copyClipboard(this);
        if (result) {
            $(this).attr('click-to-copy', 'copied!');
        }
    });
}

function styleMdlDrower() {
    $('header.mdl-layout__drawer > nav.mdl-navigation')
        .find('a').addClass('mdl-navigation__link').end()
        .find('a.current').addClass('mdl-color-text--primary');

    $('header.mdl-layout__drawer > nav.mdl-navigation')
        .find('li:has(ul)').children('a').append('<i class="material-icons">keyboard_arrow_down</i>');

    $('header.mdl-layout__drawer > nav.mdl-navigation')
        .find('li:not(.current)').children('ul').hide();
}

function styleMdlFooter() {
    $('footer.mdl-mini-footer > div.mdl-mini-footer__left-section > ul')
        .addClass('mdl-mini-footer__link-list');
}

function copyClipboard(selector) {
    var body = document.body;
	if(!body) return false;

    var $target = $(selector);
    if ($target.length === 0) { return false; }

    var text = $target.text();
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    var result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
}