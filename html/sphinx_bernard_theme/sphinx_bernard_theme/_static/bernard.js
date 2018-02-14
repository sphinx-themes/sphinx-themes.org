$(document).ready(function () {
    $('.navbar-toggle').click(function (e) {
        $('.toc > ul').toggle();

        e.preventDefault();
    });
});
