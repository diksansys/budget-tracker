$(document).ready(() => {
    $(".profileFootLink").click(() => {
        $(".nav-link").removeClass('active');
        $(".profileFootLink").addClass("active");
        $(".main-section").hide();
        $(".user-section").show();
    })

    $(".homeFootLink").click(() => {
        $(".nav-link").removeClass('active');
        $(".homeFootLink").addClass("active");
        $(".user-section").hide();
        $(".main-section").show();
    })
})