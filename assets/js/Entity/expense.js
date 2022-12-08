class Expenses {
    constructor ( 
        datetime, 
        category, 
        subcategory, 
        amount, 
        notes, 
        hasRecurrence = false, 
        recurrenceFrequency = null,
        recurrenceValue = null
    ) { 
        this.datetime = datetime
        this.category = category
        this.subcategory = subcategory
        this.amount = amount
        this.notes = notes
        this.hasRecurrence = hasRecurrence
        this.recurrenceFrequency = recurrenceFrequency
        this.recurrenceValue = recurrenceValue
    } 
}
const expenseConverter = {
    toFirestore: (expense) => {
        return {
            datetime: expense.datetime,
            category: expense.category,
            subcategory: expense.subcategory,
            amount: expense.amount,
            notes: expense.notes,
            hasRecurrence: expense.hasRecurrence,
            recurrenceFrequency: expense.recurrenceFrequency,
            recurrenceValue: expense.recurrenceValue
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        let hasRecurrence = data.hasRecurrence ? data.hasRecurrence : false;
        let recurrenceFrequency = data.recurrenceFrequency ? data.recurrenceFrequency : null;
        let recurrenceValue = data.recurrenceValue ? data.recurrenceValue : null; 
        return new Expenses( 
            data.datetime, 
            data.category, 
            data.subcategory, 
            data.amount, 
            data.notes,
            hasRecurrence,
            recurrenceFrequency,
            recurrenceValue
        );
    }
};

export {Expenses,expenseConverter};
