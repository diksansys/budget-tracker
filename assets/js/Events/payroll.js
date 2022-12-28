import {where, query, db, deleteDoc, getDocs, getDoc, doc, setDoc, addDoc, collection} from '../app.js';
import {payrollConverter} from '../Entity/payroll.js'; 
import {categoryRelation, categoryDictionary, monthNames} from '../Dict/dictionary.js';

async function loadDataToForm(date) {
    
    var payrollList = [];
    let q = query(collection(db, "payrollInformation").withConverter(payrollConverter));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => { 
        let data = doc.data(); 
        data.id = doc.id;
        payrollList.push(data);
    });

    let requiredPayroll = null;
    payrollList.forEach((payroll) => {
        let startDateTime = payroll.payrollStartDate ?  Date.parse(payroll.payrollStartDate) : 0;
        let endDateTime = payroll.payrollEndDate ?  Date.parse(payroll.payrollEndDate) : Infinity;

        endDateTime += (86400000 - 1);

        let givenDateTime = Date.parse(date); 

        if ( givenDateTime >= startDateTime && (givenDateTime <= endDateTime || endDateTime === Infinity )) {  // Filter out the entries on the basis of date range
            requiredPayroll = payroll;
        } 
    })

    if (requiredPayroll) {
        $("#payrollId").val(requiredPayroll.id);
        $("#pscwPayStartdate").val(requiredPayroll.payrollStartDate);
        $("#pscwPayEndDate").val(requiredPayroll.payrollEndDate);
        $("#pscwPayBasic").val(requiredPayroll.basicPay);
        $("#pscwPayHRA").val(requiredPayroll.hrAllowance);
        $("#pscwPayEA").val(requiredPayroll.executiveAllowance);
        $("#pscwPayPF1").val(requiredPayroll.providentFundComp);
        $("#pscwPayPF2").val(requiredPayroll.providentFundSelf);
        $("#pscwPayLWF1").val(requiredPayroll.lwfComp);
        $("#pscwPayLWF2").val(requiredPayroll.lwfSelf);
        $("#pscwPayGratuity").val(requiredPayroll.gratuityComp);
        $("#pscwPayGIPremium").val(requiredPayroll.groupInsuranceAmount);
        $("#pscwPayGIPremiumFrequency").val(requiredPayroll.groupInsuranceFreq);
        $("#pscwPayGIPremiumDate").val(requiredPayroll.groupInsuranceDate);
        $("#pscwPayBonusAmount").val(requiredPayroll.bonusAmount);
        $("#pscwPayBonusFrequency").val(requiredPayroll.bonusFreq);
        $("#pscwPayBonusDate").val(requiredPayroll.bonusDate);
        $("#pscwPayBonusDelay").val(requiredPayroll.bonusDelay);
        $("#pscwTaxRegime").val(requiredPayroll.taxRegime); 
    } else {
        $("#payrollId").val(null);
        $("#pscwPayStartdate").val(null);
        $("#pscwPayEndDate").val(null);
        $("#pscwPayBasic").val(null);
        $("#pscwPayHRA").val(null);
        $("#pscwPayEA").val(null);
        $("#pscwPayPF1").val(null);
        $("#pscwPayPF2").val(null);
        $("#pscwPayLWF1").val(null);
        $("#pscwPayLWF2").val(null);
        $("#pscwPayGratuity").val(null);
        $("#pscwPayGIPremium").val(null);
        $("#pscwPayGIPremiumFrequency").val(null);
        $("#pscwPayGIPremiumDate").val(null);
        $("#pscwPayBonusAmount").val(null);
        $("#pscwPayBonusFrequency").val(null);
        $("#pscwPayBonusDate").val(null);
        $("#pscwPayBonusDelay").val(null);
        $("#pscwTaxRegime").val(null);
    }
}

async function setDataFromForm() {

    const id = $("#payrollId").val(); 

    let modifiedPayroll = {};
    modifiedPayroll.payrollStartDate = $("#pscwPayStartdate").val();
    modifiedPayroll.payrollEndDate = $("#pscwPayEndDate").val();
    modifiedPayroll.basicPay = $("#pscwPayBasic").val();
    modifiedPayroll.bonusAmount = $("#pscwPayBonusAmount").val();
    modifiedPayroll.bonusDate = $("#pscwPayBonusDate").val();
    modifiedPayroll.bonusFreq = $("#pscwPayBonusFrequency").val();
    modifiedPayroll.bonusDelay = $("#pscwPayBonusDelay").val();
    modifiedPayroll.executiveAllowance = $("#pscwPayEA").val();
    modifiedPayroll.gratuityComp = $("#pscwPayGratuity").val();
    modifiedPayroll.groupInsuranceAmount = $("#pscwPayGIPremium").val();
    modifiedPayroll.groupInsuranceFreq = $("#pscwPayGIPremiumFrequency").val();
    modifiedPayroll.groupInsuranceDate = $("#pscwPayGIPremiumDate").val();
    modifiedPayroll.hrAllowance =  $("#pscwPayHRA").val();
    modifiedPayroll.lwfComp = $("#pscwPayLWF1").val();
    modifiedPayroll.lwfSelf = $("#pscwPayLWF2").val();
    modifiedPayroll.providentFundComp = $("#pscwPayPF1").val();
    modifiedPayroll.providentFundSelf = $("#pscwPayPF2").val();
    modifiedPayroll.taxRegime = $("#pscwTaxRegime").val();

    if (id) { 
        const docRef = doc(db, "payrollInformation", id);
        let data = payrollConverter.toFirestore(modifiedPayroll)
        await setDoc(docRef, data); 
    } else {
        await addDoc(collection(db, "payrollInformation"), payrollConverter.toFirestore(modifiedPayroll)); 
    }

    showSuccess("Data has been saved successfully");
}

function showSuccess(msg) {
    $(".ctcDetailForm .alert").hide();
            
    $('.ctcDetailForm .alert-success').text(msg);
    $(".ctcDetailForm .alert-success").show();
    setTimeout(() => { $(".ctcDetailForm .alert-success").hide(); }, 5000)
}

function showError(msg) {
    $(".ctcDetailForm .alert").hide();

    $('.ctcDetailForm .alert-danger').text(msg);
    $(".ctcDetailForm .alert-danger").show();
    setTimeout(() => { $(".ctcDetailForm .alert-danger").hide(); }, 5000)
}

function fillYear(element) {
    let list = '';
    for (let i = 2021; i<2030; i++) {
        list += `<option value=${i}>${i}</option>`;
    }
    $(element).html(list);
}

function fillMonth(element) {
    let list = ''; 
    for (let i=0; i<12; i++) {
        list += `<option value="${i+1}">${monthNames[i]}</option>`;
    }
    $(element).html(list);
}

function calculateCess(totalTax) {
    return totalTax * 0.04;
}

function getBasicTax(totalBasicIncome) { 
    if (totalBasicIncome > 0 && totalBasicIncome <= 250000) {
        return 0;
    } else if (totalBasicIncome > 250000 && totalBasicIncome <= 500000) {
        return totalBasicIncome * 0.05 * 1 - 250000 * 0.05;
    } else if (totalBasicIncome > 500000 && totalBasicIncome <= 750000) {
        return totalBasicIncome * 0.05 * 2 - (250000 + 500000) * 0.05;
    } else if (totalBasicIncome > 750000 && totalBasicIncome <= 1000000) {
        return totalBasicIncome * 0.05 * 3 - (250000 + 500000 + 750000) * 0.05;
    } else if (totalBasicIncome > 1000000 && totalBasicIncome <= 1250000) {
        return totalBasicIncome * 0.05 * 4 - (250000 + 500000 + 750000 + 1000000) * 0.05;
    } else if (totalBasicIncome > 1250000 && totalBasicIncome <= 1500000) {
        return totalBasicIncome * 0.05 * 5 - (250000 + 500000 + 750000 + 1000000 + 1250000) * 0.05;
    } else { // greater than 15 lakh
        return totalBasicIncome * 0.05 * 6 - (250000 + 500000 + 750000 + 1000000 + 1250000 + 1500000) * 0.05;
    }
}

function calculateBonus(payroll, month) {
    
    // let disbursalMonths = [5,8,11];
    // let checkMonth = month + 1;

    // if (disbursalMonths.includes(checkMonth)) {
    //     return Number(payroll.bonusAmount);
    // } 
    // //return 0;
    let bonusMap = [0,0,0,0, 2307.33, 0,0, payroll.bonusAmount, 0,0, payroll.bonusAmount, 0];
    return Number(bonusMap[month]);
}

function calculateTax(payroll, date) {
    const basicIncome = Number(payroll.basicPay) + Number(payroll.hrAllowance) + Number(payroll.executiveAllowance);

    // Bonus Calculation
    let accumulatedBonus = 0; 
    for (let i=0; i<12; i++) {
        let bonus = calculateBonus(payroll, i); 
        accumulatedBonus += Number(bonus); 
        
        let fixedIncome = basicIncome * 12; 
        let flexibleIncome = fixedIncome + accumulatedBonus; 

        if ( Number(date.getMonth()) === i ) { 
            return getBasicTax(Math.round(flexibleIncome)) / 12; 
        } 
    } 
    return 0;
}

async function predictSalary(month, year) {

    // Retrieving required payroll
    let date = year + '-' + month + '-' + '01'; 
    let tempDate = new Date(date);

    let q = query(collection(db, "payrollInformation").withConverter(payrollConverter));
    const querySnapshot = await getDocs(q);

    let requiredPayroll = {};
    querySnapshot.forEach((doc) => { 
        let data = doc.data(); 
        data.id = doc.id;
        let startDateTime = data.payrollStartDate ?  Date.parse(data.payrollStartDate) : 0;
        let endDateTime = data.payrollEndDate ?  Date.parse(data.payrollEndDate) : Infinity;

        endDateTime += (86400000 - 1); 

        let givenDateTime = Date.parse(date); 
        if ( givenDateTime >= startDateTime && (givenDateTime <= endDateTime || endDateTime === Infinity )) {  // Filter out the entries on the basis of date range
            requiredPayroll = data;
        } 
    }); 

    // Calculation for salary (monthly)
    const basicIncome = Number(requiredPayroll.basicPay) + Number(requiredPayroll.hrAllowance) + Number(requiredPayroll.executiveAllowance);
    
    // Deduction from CTC
    const deductionFromComp = Number(requiredPayroll.providentFundComp) + Number(requiredPayroll.lwfComp) + Number(requiredPayroll.gratuityComp); 
    
    // Gross income
    const grossIncome = basicIncome + deductionFromComp; 

    // Total tax for the given month
    const totalTax = calculateTax(requiredPayroll, tempDate); 

    // CESS on the tax
    const totalCess = calculateCess(totalTax); 
    
    // Total accumulated tax
    const totalFinalTax = Math.round(totalTax + totalCess); 

    // Total final deduction
    const deductionFromSelf = Number(requiredPayroll.providentFundSelf) + Number(requiredPayroll.lwfSelf) + totalFinalTax; 
    
    // In Hand Salary
    const inHandIncome = basicIncome + calculateBonus(requiredPayroll, tempDate.getMonth()) - deductionFromSelf; 

    $(".pscw-detail-display").show();
    if (!isNaN(inHandIncome)) {
        $(".display-number").text(inHandIncome);
    } else {
        $(".display-number").text("No data found.");
    }
    
}

$(document).ready(() => {
    
    let today = new Date();
    // load CTC data for today
    let todatStr = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
    $("#pscwSearchDate").val(todatStr);

    loadDataToForm(todatStr); 

    $(".ctcDetailTitle").click(() => {
        $(".pscw-detail-item").hide(); 
        if ($(".ctcDetailTitle").hasClass('active')) {
            $(".ctcDetailTitle").removeClass("active");
            $(".ctcDetailForm").hide();
        } else {
            $(".pscw-detail-header").removeClass("active");
            $(".ctcDetailTitle").addClass("active");
            $(".ctcDetailForm").show(); 
        }
    })

    $("#savePayInfo").click(() => {
        setDataFromForm();
    }) 

    $(".salaryPredictionTitle").click(() => {
        $(".pscw-detail-item").hide(); 
        if ($(".salaryPredictionTitle").hasClass('active')) {
            $(".salaryPredictionTitle").removeClass("active");
            $(".salaryPredictionForm").hide();
        } else {
            $(".pscw-detail-header").removeClass("active");
            $(".salaryPredictionTitle").addClass("active");
            $(".salaryPredictionForm").show(); 
        }
    })

    fillYear("#pscwSalaryPredictYear");
    fillMonth("#pscwSalaryPredictMonth");

    $("#findSalaryPrediction").click(() => {
        let year = $("#pscwSalaryPredictYear").val();
        let month = $("#pscwSalaryPredictMonth").val();

        predictSalary(Number(month), year);
    })

    $(document).on('change', "#pscwSearchDate", () => {
        let date = $("#pscwSearchDate").val();
        loadDataToForm(date);
    })
})