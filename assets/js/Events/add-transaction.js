import { loadList } from '../detail.js';
import {where, query, db, deleteDoc, getDocs, getDoc, doc, setDoc, addDoc, collection} from './../app.js';
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

function validateInputValues(expense) {
    if (expense.datetime && expense.category && expense.subcategory && expense.amount && expense.notes) {
        return true;
    }
    return false;
}

// Convert to standard date
function standardDate(date) {
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(); 
}

// Get date range according to expense frequency
function getDateRange(expense) {
    let originalDate = expense.datetime;
    let range = [];
    if (expense.hasRecurrence) { 
        switch(expense.recurrenceFrequency) { 
            case 'LM': // Last day of each month
                for (let i=0; i<12; i++) { // pushing data for 12 months only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addMonths(i);
                    currentDay.setDate(currentDay.getDaysInMonth());  
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'FM': // First day of each month
                for (let i=0; i<12; i++) { // pushing data for 12 months only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addMonths(i);
                    currentDay.setDate(1);  
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'MO': // Monthly
                for (let i=0; i<12; i++) { // pushing data for 12 months only now 
                    let currentDay = new Date(originalDate);  
                    currentDay.addMonths(i); 
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'YY': // Yearly
                for (let i=0; i<4; i++) { // pushing data for 4 years only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.addYears(i); 
                    range.push(standardDate(currentDay));
                } 
                break;
            case 'CD': // Custom day frequency
                for (let i=0; i<12; i++) { // pushing data for 12 times only now 
                    let currentDay = new Date(originalDate); 
                    currentDay.setDate(today.getDate() + (expense.recurrenceValue * i) ); 
                    range.push(standardDate(currentDay));
                } 
                break; 
            case 'QU': // Quarterly
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

// Load subcategories for dropdown
function loadSubcategories(cat) {

    let subcats = categoryRelation[cat]; 
    
    let list = '';
    $.each(subcats, (i, val) => {
      list += `<option value="${val}">${categoryDictionary[val]}</option>`;
    })

    $("#subcat").html(
      `<option value="" disabled selected>Choose reason of transaction</option>${list}`
    );
}

// Save the expense
async function saveExpense(expense, id = null) {
    
    var response = null;

    if (id) { // Updating data
        
        // Subscription data cannot be updated
        // So, data to be modified before save
        let modifiedExpense = {}
        modifiedExpense.datetime = expense.datetime; 
        modifiedExpense.category = expense.category; 
        modifiedExpense.subcategory = expense.subcategory; 
        modifiedExpense.amount = expense.amount;
        modifiedExpense.notes = expense.notes;

        if (expense.recurrenceFrequency === 'OT') { // If one time transaction, recurrence can be updated
            modifiedExpense.recurrenceFrequency = expense.recurrenceFrequency;
            modifiedExpense.hasRecurrence = false;
            modifiedExpense.recurrenceValue = null;
        }

        // Query for adding document  
        const docRef = doc(db, "expenseDetail", id);
        const data = expenseConverter.toFirestore(modifiedExpense)

        response = setDoc(docRef, data);

    } else {  // Add data
       
        // Generate data for date ranges according to frequency
        let dateRange = getDateRange(expense); 
        dateRange.forEach((datetime) => {
            // Query for adding document
            response = addDoc(collection(db, "expenseDetail"), expenseConverter.toFirestore(expense)); 
        }); 
    }

    // Response after events
    if (response) {
        response.then((r) => {
            $(".addExpenseForm form").find("input, select").val(null);
            showSuccess('Data saved successfully!');
        })
    } else {
        showError('Something went wrong');
    }
}

async function fetchDocument(id) {
    let ref = doc(db, "expenseDetail", id).withConverter(expenseConverter);
    let docSnapshot = await getDoc(ref);
    return docSnapshot.data();
}

async function removeDocument(id) {
    let ref = doc(db, "expenseDetail", id);
    return deleteDoc(ref);
}

// Toggle form for saving expense
function toggleEditForm(data = null) {
    
    $("#deleteExpense").hide();

    if ($('.ffs-btn').hasClass('open')) {
        $(".addExpenseForm").find('input, select').val(null);
        $(".addExpenseForm").hide();
        $(".ffs-btn").removeClass('open');
        $(".ffs-btn").find('.material-icons').text('add');
        
        loadList({});
    } else { 
        if (data) {
            $("#expenseId").val(data.id);
            $("#date").val(data.datetime);
            $("#amount").val(data.amount);
            $("#notes").val(data.notes);
            $("#cat").val(data.category);

            let cat = data.category;  
            let subcats = categoryRelation[cat]; 
            let list = '';
            $.each(subcats, (i, val) => {
                list += `<option value="${val}">${categoryDictionary[val]}</option>`;
            })
            $("#subcat").html(
                `<option value="" disabled selected>Choose reason of transaction</option>${list}`
            );

            $("#subcat").val(data.subcategory);
            $("#recurrenceDaysSelection").val(data.recurrenceFrequency);
            
            $("#recurrenceDaysWrap").hide();
            if (data.hasRecurrence) { 
                if (data.recurrenceFrequency === 'CD') {
                    $("#recurrenceDaysWrap").show();
                    $("#recurrenceDays").val(data.recurrenceValue);
                }  
            } else { 
                $("#recurrenceDays").val(null);
            }

            $("#deleteExpense").show();
        }

        $(".addExpenseForm").show();
        $(".ffs-btn").addClass('open');
        $(".ffs-btn").find('.material-icons').text('close'); 
    } 
}

// Get basic prepared expense
function getPreparedExpense () {
    return new Expenses(
        $("#date").val(), 
        $("#cat").val(),
        $("#subcat").val(),
        $("#amount").val(),
        $("#notes").val() 
    )
}

function showSuccess(msg) {
    $(".addExpenseForm .alert").hide();
            
    $('.addExpenseForm .alert-success').text(msg);
    $(".addExpenseForm .alert-success").show();
    setTimeout(() => { $(".addExpenseForm .alert-success").hide(); }, 5000)
}

function showError(msg) {
    $(".addExpenseForm .alert").hide();

    $('.addExpenseForm .alert-danger').text(msg);
    $(".addExpenseForm .alert-danger").show();
    setTimeout(() => { $(".addExpenseForm .alert-danger").hide(); }, 5000)
}

// Change event of recurrence selection dropdown
$(document).on('change', '#recurrenceDaysSelection', () => { 
    let selection = $("#recurrenceDaysSelection").val();  
    if (selection == 7) {
        $("#recurrenceDaysWrap").show();
    } else {
        $("#recurrenceDaysWrap").hide();
    }
})

// Change events of category select dropdown
$(document).on('change', '#cat', () => { 
    let cat = $("#cat").val();  

    loadSubcategories(cat);
})

// Save Expense event
$(document).on('click', "#submit", (e) => {

    e.preventDefault();

    // Prepare expense data
    let expense = getPreparedExpense();
    let expenseId = $("#expenseId").val();

    // Adding extra parameters
    let recurrenceFrequency = $("#recurrenceDaysSelection").val();
    if (recurrenceFrequency !== 'OT') {
        expense.hasRecurrence = true;
    } else {
        expense.hasRecurrence = false;
    }

    expense.recurrenceFrequency = $("#recurrenceDaysSelection").val(), // recurrence frequency
    expense.recurrenceValue = $("#recurrenceDays").val() // recurrence value

    // Save expense data
    if ( validateInputValues(expense) ) { 
        saveExpense(expense, expenseId);
    } else {
        $(".addExpenseForm .alert").hide();

        $('.addExpenseForm .alert-danger').text('Please check required fields!');
        $(".addExpenseForm .alert-danger").show();
        setTimeout(() => { $(".addExpenseForm .alert-danger").hide(); }, 5000)
    }
    
})

// Open edit form
$(document).on('click', ".subcat-row-item", function() {
    let id = $(this).attr('data-id'); 

    fetchDocument(id).then((doc) => { 
        doc.id = id;
        toggleEditForm(doc);
    })
})

// Click event on + button / open edit form
$(document).on('click', ".ffs-btn", (e) => {
    e.preventDefault();
    
    toggleEditForm();
})

// Delete expense event
$(document).on('click', "#deleteExpense", function() {
    let id = $('#expenseId').val(); 

    fetchDocument(id).then((doc) => { 
        if (doc) {
            if (confirm("Are you sure to delete this expense?")) {
                removeDocument(id).then((resp) => {
                    showSuccess('Expense has been removed');
                }).catch((error) => { 
                    showError("Expense cannot be deleted");
                });
            }
        } else {
            showError('No expense found.');
        }
    }).catch((error) => {
        showError("Something went wrong");
    })
})
