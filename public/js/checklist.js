$(function() {

    var $sidebar   = $(".checklist"), 
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 30;

    $window.scroll(function() {
        if ($window.scrollTop() > offset.top) {
            $sidebar.stop().animate({
                marginTop: $window.scrollTop() - offset.top + topPadding
            });
        } else {
            $sidebar.stop().animate({
                marginTop: 0
            });
        }
    });
    
});