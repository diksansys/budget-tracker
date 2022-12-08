import {loadList} from '../detail.js';
import {categoryRelation, categoryDictionary} from './../Dict/dictionary.js';

// Load subcategories for dropdown
function loadSubcategories(cat) {

    let subcats = categoryRelation[cat]; 
    
    let list = '';
    $.each(subcats, (i, val) => {
      list += `<option value="${val}">${categoryDictionary[val]}</option>`;
    })

    $("#lsSubCategory").html(
      `<option value="" disabled selected>Search By Sub Category</option>${list}`
    );
}
        
// ----------------------------------EVENTS-------------------------------------------------
var options = {}

$(document).ready(function(){
    loadList(options);
});

// Search Event
$(document).on('click', "#lsSubmit", (e) => {
    e.preventDefault();

    let lsToDate = $("#lsToDate").val();
    let lsFromDate = $("#lsFromDate").val();
    let lsCategory = $("#lsCategory").val();
    let lsSubCategory = $("#lsSubCategory").val();

    if ( lsToDate && lsFromDate ) {
        options.toDate = lsToDate; 
        options.fromDate = lsFromDate;
        options.category = lsCategory;
        options.subCategory = lsSubCategory;

        loadList(options);
    } else {
        $(".form--search .alert").hide();

        $('.form--search .alert-danger').text('Please enter valid date ranges!');
        $(".form--search .alert-danger").show();
        setTimeout(() => { $(".form--search .alert-danger").hide(); }, 3000)
    }
})

// Reset Event
$(document).on('click', "#lsReset", (e) => {
    e.preventDefault();
    $(".form--search").find('input, select').val(null);
    options = {};
    loadList(options);
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

// Change events of category select dropdown
$(document).on('change', '#lsCategory', () => { 
    let cat = $("#lsCategory").val();  
    loadSubcategories(cat);
})

