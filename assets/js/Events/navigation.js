$(document).ready(() => {
    $(".homeFootLink").click(() => {
        $(".nav-link").removeClass('active');
        $(".homeFootLink").addClass("active");
        $(".main-page").hide();
        $(".main-section").show();
    })

    $(".payrollFootLink").click(() => {
        $(".nav-link").removeClass('active');
        $(".payrollFootLink").addClass("active");
        $(".main-page").hide();
        $(".payroll-section").show();
    })

    $(".profileFootLink").click(() => {
        $(".nav-link").removeClass('active');
        $(".profileFootLink").addClass("active");
        $(".main-page").hide();
        $(".user-section").show();
    })
})