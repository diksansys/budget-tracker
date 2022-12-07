import {db, addDoc, collection} from './../app.js';
import {categoryRelation, categoryDictionary} from './../Dict/dictionary.js';
import {expenseConverter,Expenses} from './../Entity/expense.js';

Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

Date.prototype.addYears = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setFullYear(this.getFullYear() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

var options = {};

function validateInputValues(expense) {
    if (expense.datetime && expense.category && expense.subcategory && expense.amount && expense.notes) {
        return true;
    }
    return false;
}

function standardDate(date) {
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(); 
}

function getDateRange(options, expense) {
    let originalDate = expense.datetime;
    let range = [];
    if (options.hasRecurrence) { 
        switch(options.recurrenceValue) { 
            case 'LDM': // Last day of each month
                for (let i=0; i<12; i++) { // pushing data for 12 months only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addMonths(i);
                    currentDay.setDate(currentDay.getDaysInMonth());  
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'FDM': // First day of each month
                for (let i=0; i<12; i++) { // pushing data for 12 months only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addMonths(i);
                    currentDay.setDate(1);  
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'M': // Monthly
                for (let i=0; i<12; i++) { // pushing data for 12 months only now 
                    let currentDay = new Date(originalDate);  
                    currentDay.addMonths(i); 
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'Y': // Yearly
                for (let i=0; i<4; i++) { // pushing data for 4 years only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addYears(i); 
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'C': // Custom day frequency
                for (let i=0; i<12; i++) { // pushing data for 12 times only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.setDate(today.getDate() + recurrenceFrequency*i); 
                    range.push(standardDate(currentDay));
                } 
                break; 
            case 'Q': // Quarterly
                for (let i=0; i<4; i++) { // pushing data for 1 years only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addMonths(i*3); 
                    range.push(standardDate(currentDay));
                } 
                break; 
        }
    } else {
        range = [originalDate];
    }
    
    return range;
}

$(document).on('change', '#recurrenceDaysSelection', () => { 
    let selection = $("#recurrenceDaysSelection").val();  
    
    if (selection == 7) {
        $("#recurrenceDaysWrap").show();
    } else {
        $("#recurrenceDaysWrap").hide();
    }

    switch(selection) {
        case '1':
            options.hasRecurrence = false;
            break;
        case '2':
            options.hasRecurrence = true;
            options.recurrenceValue = 'W';
            break;
        case '3':
            options.hasRecurrence = true;
            options.recurrenceValue = 'LDM';
            break;
        case '4':
            options.hasRecurrence = true;
            options.recurrenceValue = 'FDM';
            break;
        case '5':
            options.hasRecurrence = true;
            options.recurrenceValue = 'M';
            break;
        case '6':
            options.hasRecurrence = true;
            options.recurrenceValue = 'Y';
            break;
        case '7':
            options.hasRecurrence = true;
            options.recurrenceValue = 'C';
            break;
        case '8':
            options.hasRecurrence = true;
            options.recurrenceValue = 'Q';
            break;
    }
})

$(document).on('change', '#cat', () => { 
    let cat = $("#cat").val();  
    let subcats = categoryRelation[cat]; 
    
    let list = '';
    $.each(subcats, (i, val) => {
      list += `<option value="${val}">${categoryDictionary[val]}</option>`;
    })

    $("#subcat").html(
      `<option value="" disabled selected>Choose reason of transaction</option>${list}`
    );
})

$(document).on('click', "#submit", (e) => {
    e.preventDefault();

    let expense = new Expenses(
        $("#date").val(), 
        $("#cat").val(),
        $("#subcat").val(),
        $("#amount").val(),
        $("#notes").val()
    )

    if ( validateInputValues(expense) ) {
        // Add recurrence logic 
        if (options.hasRecurrence) {
            options.recurrenceFrequency = $("#recurrenceDays").val();
        }
        
        let dateRange = getDateRange(options, expense); 

        let response = null;
        dateRange.forEach((datetime) => {
            // Initiate addition
            expense.datetime = datetime;
            response = addDoc(collection(db, "expenseDetail"), expenseConverter.toFirestore(expense)); 
        }); 
        if (response) {
            response.then((r) => {
                $(".addExpenseForm form").find("input, select").val(null);
    
                $(".addExpenseForm .alert").hide();
                
                $('.addExpenseForm .alert-success').text('Data saved successfully!');
                $(".addExpenseForm .alert-success").show();
                setTimeout(() => { $(".addExpenseForm .alert-success").hide(); }, 5000)
            })
        } else {
            $(".addExpenseForm .alert").hide();

            $('.addExpenseForm .alert-danger').text('Something went wrong!');
            $(".addExpenseForm .alert-danger").show();
            setTimeout(() => { $(".addExpenseForm .alert-danger").hide(); }, 5000)
        }
    } else {
        $(".addExpenseForm .alert").hide();

        $('.addExpenseForm .alert-danger').text('Please check required fields!');
        $(".addExpenseForm .alert-danger").show();
        setTimeout(() => { $(".addExpenseForm .alert-danger").hide(); }, 5000)
    }
    
})
