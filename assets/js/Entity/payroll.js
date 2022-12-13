class Payroll {
    constructor(
        basicPay,
        bonusAmount,
        bonusDate,
        bonusFreq,
        bonusDelay,
        executiveAllowance,
        gratuityComp,
        groupInsuranceAmount,
        groupInsuranceFreq,
        groupInsuranceDate,
        hrAllowance,
        lwfComp,
        lwfSelf,
        providentFundComp,
        providentFundSelf,
        taxRegime,
    ) {
        this.basicPay = basicPay
        this.bonusAmount = bonusAmount
        this.bonusDate = bonusDate
        this.bonusFreq = bonusFreq
        this.bonusDelay = bonusDelay
        this.executiveAllowance = executiveAllowance
        this.gratuityComp = gratuityComp
        this.groupInsuranceAmount = groupInsuranceAmount
        this.groupInsuranceFreq = groupInsuranceFreq
        this.groupInsuranceDate = groupInsuranceDate
        this.hrAllowance = hrAllowance
        this.lwfComp = lwfComp
        this.lwfSelf = lwfSelf
        this.providentFundComp = providentFundComp
        this.providentFundSelf = providentFundSelf
        this.taxRegime = taxRegime
    }
}

const payrollConverter = {
    toFirestore: (payroll) => {
        return {
            basicPay: payroll.basicPay,
            bonusAmount: payroll.bonusAmount,
            bonusDate: payroll.bonusDate,
            bonusFreq: payroll.bonusFreq,
            bonusDelay: payroll.bonusDelay,
            executiveAllowance: payroll.executiveAllowance,
            gratuityComp: payroll.gratuityComp,
            groupInsuranceAmount: payroll.groupInsuranceAmount,
            groupInsuranceFreq: payroll.groupInsuranceFreq,
            groupInsuranceDate: payroll.groupInsuranceDate,
            hrAllowance: payroll.hrAllowance,
            lwfComp: payroll.lwfComp,
            lwfSelf: payroll.lwfSelf,
            providentFundComp: payroll.providentFundComp,
            providentFundSelf: payroll.providentFundSelf,
            taxRegime: payroll.taxRegime
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Payroll( 
            data.basicPay,
            data.bonusAmount,
            data.bonusDate,
            data.bonusFreq,
            data.bonusDelay,
            data.executiveAllowance,
            data.gratuityComp,
            data.groupInsuranceAmount,
            data.groupInsuranceFreq,
            data.groupInsuranceDate,
            data.hrAllowance,
            data.lwfComp,
            data.lwfSelf,
            data.providentFundComp,
            data.providentFundSelf,
            data.taxRegime
        );
    }
};

export {Payroll,payrollConverter};