var fixmeTop = $('#toc').offset().top - 100; 

$(window).scroll(function() {                  // assign scroll event listener
            var currentScroll = $(window).scrollTop(); // get current position
            if (currentScroll >= fixmeTop) {           // apply position: fixed if you
                $('#toc').css({      // scroll to that element or below it
                    top: '100px',
                    position: 'fixed'
                });
            } else {                                   // apply position: static
                $('#toc').css({      // if you scroll above it
                    position: 'inherit'
                });
            }
        });