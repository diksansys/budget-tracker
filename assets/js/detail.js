import {db, query, collection, getDocs} from './app.js';
import {categoryRelation, categoryDictionary,colors,monthNames,iconDictionary} from './Dict/dictionary.js';
import {expenseConverter} from './Entity/expense.js';

// ------------------------------------INIT---------------------------------------------------------------
function formatDate(
    timestamp,
    yesterday_text = 'Yesterday',
    today_text = 'Today',
    tomorrow_text = 'Tomorrow',
    language = "en"
  ) {
    var in_the_last_7days_date_options = { weekday: 'long'};
    var in_the_next_7days_date_options = { month: 'short', day: 'numeric' };
    var same_year_date_options = { month: 'short', day: 'numeric' };
    var far_date_options = { year: 'numeric', month: 'short', day: 'numeric' };
  
    var dt = new Date(timestamp);
    var date = dt.getDate();
    var time_diff = timestamp - Date.now();
    var diff_days = new Date().getDate() - date;
    var diff_months = new Date().getMonth() - dt.getMonth();
    var diff_years = new Date().getFullYear() - dt.getFullYear();
  
    var is_today = diff_years === 0 && diff_months === 0 && diff_days === 0;
    var is_yesterday = diff_years === 0 && diff_months === 0 && diff_days === 1;
    var is_tomorrow = diff_years === 0 && diff_months === 0 && diff_days === -1;
    var is_in_the_last_7days = diff_years === 0 && diff_months === 0 && (diff_days > 1 && diff_days < 7);
    var is_in_the_next_7days = diff_years === 0 && diff_months === 0 && (diff_days < -1 && diff_days > -7);
    var is_same_year = diff_years === 0;
  
    if(is_today){
      return today_text;
    }else if(is_yesterday) {
      return yesterday_text;
    }else if(is_tomorrow) {
      return tomorrow_text;
    }else if(is_in_the_last_7days) {
      return dt.toLocaleString(language, in_the_last_7days_date_options);
    }else if(is_in_the_next_7days) {
      return dt.toLocaleString(language, in_the_next_7days_date_options);
    }else if(is_same_year){
      return dt.toLocaleString(language, same_year_date_options);
    }else{
      return dt.toLocaleString(language, far_date_options);
    }
}

var prettyDate = ((date) => {
    let today = new Date(date);
    let day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    let month = monthNames[today.getMonth()];
    let year = '\'' + today.getFullYear() % 100; 
    return day + ' ' + month + ' ' + year;
});

// Load all the lists 
async function loadList(options = null) {

    var today = new Date(); 
    if (options.toDate === undefined || options.toDate === null) { // If no date provided, use last date of last month 
        options.toDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate(); 
    } 
    if (options.fromDate === undefined || options.fromDate === null) { // If no date provided, use current date
        let lastDayOfLastMonth = today;
        lastDayOfLastMonth.setDate(1); 
        lastDayOfLastMonth.setHours(-1);
        options.fromDate = lastDayOfLastMonth.getFullYear() + '-' + (lastDayOfLastMonth.getMonth()+1) + '-' + lastDayOfLastMonth.getDate(); 
    } 
    
    if (options.toDate) {
        $(".swtToDate").text(prettyDate(options.toDate)); 
    }
    if (options.fromDate) {
        $(".swtFromDate").text(prettyDate(options.fromDate)); 
    } 
    
    // Init the database query
    const q = query(collection(db, "expenseDetail").withConverter(expenseConverter));
    const querySnapshot = await getDocs(q);

    // Filtration + Segregation
    let total = 0;
    let modList = []; 
    querySnapshot.forEach((doc) => { 
        let data = doc.data(); 
        total += Number(data.amount); 
        
        let tD = Infinity, fD = 0;
        let givenDate = data.datetime;

        if (options.toDate && options.fromDate) { 
            tD = Date.parse(options.toDate);
            fD = Date.parse(options.fromDate); 
        } 

        tD += 86400000;

        let gD = Date.parse(givenDate); 

        if ( gD >= fD && gD <= tD) {  // Filter out the entries on the basis of date range
            if (!modList.hasOwnProperty(gD)) {
                modList[gD] = [] 
            } 
            modList[gD].push(data);
        }  
    });
    
    // Sorting process (DESC)
    let sortedList = [];
    Object.keys(modList).sort((a,b) => {
        return b - a;
    }).forEach((key) => {
        sortedList[key] = modList[key];
    }); 

    // Calculation
    let totalBalance = 0;
    let totalExpense = 0;
    let totalInvestment = 0;
    let totalIncome = 0;
    let totalCatTotal = {'VEX' : 0,'FEX' : 0,'INV' : 0,'INC' : 0};
    let totalSubCatTotal = {"GRO" : 0,"MED" : 0,"REC" : 0,"SHO" : 0,"OTT" : 0,"EXP" : 0,"TBJ" : 0,"TOD" : 0,"CRY" : 0,"PPF" : 0,"EIN" : 0,"SAL" : 0,"ESL" :0 };
    for (let parsedD in sortedList) {
        // Expenses by datetime group
        let expenseGroup = sortedList[parsedD]; 

        // Total of all transactions
        let dailyBalance = 0;
        let dailyExpense = 0;
        let dailyInvestment = 0;
        let dailyIncome = 0;

        // Total of all transaction by category 
        let dailyCatTotal = {'VEX' : 0,'FEX' : 0,'INV' : 0,'INC' : 0};
        let dailySubCatTotal = {"GRO" : 0,"MED" : 0,"REC" : 0,"SHO" : 0,"OTT" : 0,"EXP" : 0,"TBJ" : 0,"TOD" : 0,"CRY" : 0,"PPF" : 0,"EIN" : 0,"SAL" : 0,"ESL" :0 };
                
        expenseGroup.forEach((expense) => {
            let amount = Number(expense.amount);
            
            // Daily statistics
            dailyBalance += expense.category === 'INC' ? amount : -1 * amount;
            dailyExpense += expense.category === 'INC' ? 0 : amount;
            dailyInvestment += expense.category === 'INV' ? amount : 0;
            dailyIncome += expense.category === 'INC' ? amount : 0;
            dailyCatTotal[expense.category] += amount;
            dailySubCatTotal[expense.subcategory] += amount;

            // Total statistics based on category
            totalCatTotal[expense.category] += amount;
            totalSubCatTotal[expense.subcategory] += amount;
        });

        // Updating data in sidebar
        totalBalance += dailyBalance;
        totalExpense += dailyExpense;
        totalInvestment += dailyInvestment;
        totalIncome += dailyIncome; 
    }

    // Structure 
    let allEntries = '';
    for (let parsedD in sortedList) { 
        // Expenses by datetime group
        let expenseGroup = sortedList[parsedD]; 
        let multipleItemsForTheDay = '';

        expenseGroup.forEach((expense) => { 
            multipleItemsForTheDay += `
                <li class="row align-items-center">
                    <div class="media-image col-2">
                        <span class="material-icons">${iconDictionary[expense.subcategory]}</span>
                    </div>
                    <div class="media-body col-10"> 
                        <div class="media-content-wrap row">
                            <div class="mb-title-wrap col-6">
                                <div class="mb-title">
                                    <span>${categoryDictionary[expense.category]}</span>
                                </div>
                                <div class="mb-sub-title">
                                    <span>${categoryDictionary[expense.subcategory]}</span>
                                </div>
                            </div>
                            <div class="mb-content-wrap col-6 text-right">
                                <div class="mbc-main">
                                    <span class="${expense.category !== 'INC' ? 'text-danger' : 'text-success'}" >${expense.category !== 'INC' ? '-' : ''} ₹${expense.amount}</span>
                                </div>
                                <div class="mbc-sub-conent">
                                    <span>${expense.notes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        })
        allEntries += `
            <!-- List Unit -->
                <li> 
                    <div class="list-header">
                            <div class="lh-wrap">
                                <span>${formatDate(Number(parsedD))}</span>
                            </div>
                    </div>
                    <ul class="list-unstyled subcat-row">
                        ${multipleItemsForTheDay}
                    </ul>
                </li>  
            <!-- List Unit -->
        `;
    }

    $(".cat-row").html(allEntries);
    $(".swt-title-body span").text('₹' + totalBalance);
    $(".totalExpense").text('₹' + totalExpense);
    $(".totalInvestment").text('₹' + totalInvestment);
    $(".totalIncome").text('₹' + totalIncome);

    let subcatExpenseList = '';
    let subcatInvestList = '';
    let subcatIncomeList = '';
    $.each(totalSubCatTotal, (subcat, count) => {
        if (categoryRelation['VEX'].includes(subcat) || categoryRelation['FEX'].includes(subcat)) {
            subcatExpenseList += `
                <div class="info-group">
                    <span class="info-icon cwsbExpenseItems" data-identity="${subcat}">
                        <i class="material-icons">${iconDictionary[subcat]}</i>
                    </span>
                    <span class="cwsb-unit--unit info-badge">₹${count}</span>
                </div>
            `;
        } else if (categoryRelation['INV'].includes(subcat)) {
            subcatInvestList += `
                <div class="info-group">
                    <span class="info-icon cwsbInvestItems" data-identity="${subcat}">
                        <i class="material-icons">${iconDictionary[subcat]}</i>
                    </span>
                    <span class="cwsb-unit--unit info-badge">₹${count}</span>
                </div>
            `;
        } else if (categoryRelation['INC'].includes(subcat)){
            subcatIncomeList += `
                <div class="info-group">
                    <span class="info-icon cwsbIncomeItems" data-identity="${subcat}">
                        <i class="material-icons">${iconDictionary[subcat]}</i>
                    </span>
                    <span class="cwsb-unit--unit info-badge">₹${count}</span>
                </div>
            `;
        } 
    })
    $(".cwsbExpense").html(subcatExpenseList);
    $(".cwsbInvestment").html(subcatInvestList);
    $(".cwsbIncome").html(subcatIncomeList);

}

export {loadList};