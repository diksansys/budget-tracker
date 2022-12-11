import {loadList} from '../detail.js';
import {categoryRelation, categoryDictionary} from './../Dict/dictionary.js';

Element.prototype.hasClass = function(className) {
    return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};

Element.prototype.removeClass = function(className) {
    this.classList.remove(className);
}

Element.prototype.addClass = function(className) {
    this.classList.add(className);
}

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

function hideSearchWrap() {
    $('.tb-action').removeClass('active');
    $(".search-wrap").hide();
    $(".tb-action span").text('filter_list');
}

function openSearchWrap() {
    $('.tb-action').addClass('active');
    $(".search-wrap").show();
    $(".tb-action span").text('close');
}

function refresh() {
    $(".form--search").find('input, select').val(null);
    options = {};
    loadList(options);
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

//Click event on repeating badge
$(document).on('click', ".variable-badge", (e) => {
    let target = e.currentTarget;
    if (target.hasClass('active')) {
        target.removeClass('active');
        options.notes = undefined;
    } else {
        target.addClass('active');
        options.notes = target.getAttribute('data-title'); 
    } 
    loadList(options);
})

// Reset Event
$(document).on('click', "#lsReset, .tb-reset", (e) => {
    refresh();
})

$(document).on('click', "#lsCancel", (e) => {
    hideSearchWrap();
})

$(document).on('click', ".tb-action", (e) => {
    let target = e.currentTarget;
    if (target.hasClass('active')) {
        hideSearchWrap();
    } else { 
        openSearchWrap();
    } 
})

$(document).on('change', '#swssSort', () => { 
    let sortValue = $("#swssSort").val();  
    options.sortValue = sortValue; 
    loadList(options);
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


