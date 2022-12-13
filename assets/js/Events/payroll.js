import {where, query, db, deleteDoc, getDocs, getDoc, doc, setDoc, addDoc, collection} from '../app.js';
import {categoryRelation, categoryDictionary,monthNames,iconDictionary} from '../Dict/dictionary.js';
import {payrollConverter} from '../Entity/payroll.js'; 

async function loadDataToForm() {
    var data = {};
    let q = query(collection(db, "payrollInformation").withConverter(payrollConverter));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => { 
        data = doc.data(); 
        data.id = doc.id;
    });

    $("#payrollId").val(data.id);
    $("#pscwPayBasic").val(data.basicPay);
    $("#pscwPayHRA").val(data.hrAllowance);
    $("#pscwPayEA").val(data.executiveAllowance);
    $("#pscwPayPF1").val(data.providentFundComp);
    $("#pscwPayPF2").val(data.providentFundSelf);
    $("#pscwPayLWF1").val(data.lwfComp);
    $("#pscwPayLWF2").val(data.lwfSelf);
    $("#pscwPayGratuity").val(data.gratuityComp);
    $("#pscwPayGIPremium").val(data.groupInsuranceAmount);
    $("#pscwPayGIPremiumFrequency").val(data.groupInsuranceFreq);
    $("#pscwPayGIPremiumDate").val(data.groupInsuranceDate);
    $("#pscwPayBonusAmount").val(data.bonusAmount);
    $("#pscwPayBonusFrequency").val(data.bonusFreq);
    $("#pscwPayBonusDate").val(data.bonusDate);
    $("#pscwPayBonusDelay").val(data.bonusDelay);
    $("#pscwTaxRegime").val(data.taxRegime); 

    // Calculations
    const basicIncome = Number(data.basicPay) + Number(data.hrAllowance) + Number(data.executiveAllowance);
    const initialAddition = Number(data.providentFundComp) + Number(data.lwfComp) + Number(data.gratuityComp); 
    const grossIncome = (basicIncome + initialAddition);
    const initialDeduction = Number(data.providentFundSelf) + Number(data.lwfSelf) + Number(data.gratuityComp); 
    const basicTds = 0;

    $(".grossIncome").text(grossIncome*12);
    $(".totalEarningBasic").text(basicIncome*12);
    $(".totalDeductionCalc").text( initialDeduction *12);
}

function calculateTax() {

}

async function setDataFromForm() {

    const id = $("#payrollId").val(); 
    if (id === null || id === undefined) { 
        showError("Error! Id not defined");
    }

    const docRef = doc(db, "payrollInformation", id);

    let modifiedPayroll = {}
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

    let data = payrollConverter.toFirestore(modifiedPayroll)
    let response = await setDoc(docRef, data); console.log(response);

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

$(document).ready(() => {
    
    loadDataToForm();

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
})