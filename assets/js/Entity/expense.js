class Expenses {
    constructor (datetime, category, subcategory, amount, notes) {
        this.datetime = datetime
        this.category = category
        this.subcategory = subcategory
        this.amount = amount
        this.notes = notes
    } 
}
const expenseConverter = {
    toFirestore: (expense) => {
        return {
            datetime: expense.datetime,
            category: expense.category,
            subcategory: expense.subcategory,
            amount: expense.amount,
            notes: expense.notes
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Expenses(data.datetime, data.category, data.subcategory, data.amount, data.notes);
    }
};

export {Expenses,expenseConverter};
