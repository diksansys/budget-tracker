import {loadList} from '../detail.js';
        
// ----------------------------------EVENTS-------------------------------------------------
var options = {}

$(document).ready(function(){
    loadList(options);
});

$(document).on('click', "#lsSubmit", (e) => {
    e.preventDefault();
    let lsToDate = $("#lsToDate").val();
    let lsFromDate = $("#lsFromDate").val();
    if ( lsToDate && lsFromDate ) {
        options.toDate = lsToDate; 
        options.fromDate = lsFromDate;

        loadList(options);
    } else {
        $(".form--search .alert").hide();

        $('.form--search .alert-danger').text('Please enter valid date ranges!');
        $(".form--search .alert-danger").show();
        setTimeout(() => { $(".form--search .alert-danger").hide(); }, 3000)
    }
})
$(document).on('click', "#lsCancel", (e) => {
    e.preventDefault();
    $(".search-wrap").hide();
    $(".tb-action").show();
})

$(document).on('click', ".tb-action", (e) => {
    e.preventDefault();
    if ($('.search-wrap').hasClass('active')) {
        $(".search-wrap").hide();
        $(".tb-action").show();
    } else {
        $(".search-wrap").show();
        $(".tb-action").hide();
    } 
})

$(document).on('click', "#lsReset", (e) => {
    e.preventDefault();
    $(".form--search").find('input').val(null);
    loadList({});
})

$(document).on('click', '.cwTotalExpense', (e) => {
    e.preventDefault();

    if ($('.cwTotalExpense').hasClass('active')) {
        $('.cwTotalExpense, .cwTotalInvestment, .cwTotalIncome').removeClass('active');
        $(".cwsb-unit").hide();
    } else {
        $('.cwTotalExpense, .cwTotalInvestment, .cwTotalIncome').removeClass('active');
        $('.cwTotalExpense').addClass('active');
        $(".cwsb-unit").hide();
        $(".cwsbExpense").show();
    }
});

$(document).on('click', '.cwTotalInvestment', (e) => {
    e.preventDefault();

    if ($('.cwTotalInvestment').hasClass('active')) {
        $('.cwTotalExpense, .cwTotalInvestment, .cwTotalIncome').removeClass('active');
        $(".cwsb-unit").hide();
    } else {
        $('.cwTotalExpense, .cwTotalInvestment, .cwTotalIncome').removeClass('active');
        $('.cwTotalInvestment').addClass('active');
        $(".cwsb-unit").hide();
        $(".cwsbInvestment").show();
    }
});

$(document).on('click', '.cwTotalIncome', (e) => {
    e.preventDefault();

    if ($('.cwTotalIncome').hasClass('active')) {
        $('.cwTotalExpense, .cwTotalInvestment, .cwTotalIncome').removeClass('active');
        $(".cwsb-unit").hide();
    } else {
        $('.cwTotalExpense, .cwTotalInvestment, .cwTotalIncome').removeClass('active');
        $('.cwTotalIncome').addClass('active');
        $(".cwsb-unit").hide();
        $(".cwsbIncome").show();
    }
});

