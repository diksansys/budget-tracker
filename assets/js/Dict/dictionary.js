const categoryRelation = {
    "VEX" : [ "GRO", "MED", "REC", "SHO", "OTT", "FOD", "MOV", "DON", "EXP" ],
    "FEX" : ["TBJ","TOD"],
    "INV" : ["CRY","PPF","EIN"],
    "INC" : ["SAL","ESL"]
}
const categoryDictionary = {
    "VEX" : "Variable Expense",
    "FEX" : "Fixed Expense",
    "INV" : "Investment",
    "INC" : "Income",
    "GRO" : "Grocery",
    "MED" : "Medicine",
    "REC" : "Recharge",
    "SHO" : "Shopping",
    "FOD" : "Foods & Drinks",
    "DON" : "Donations",
    "MOV" : "Movies",
    "OTT" : "OTT",
    "EXP" : "Extra Expense",
    "TBJ" : "To Bauji",
    "TOD" : "To Deeksha",
    "CRY" : "Cryptos",
    "PPF" : "PPF",
    "EIN" : "Extra Investment",
    "SAL" : "Salary",
    "ESL" : "Extra Income"
}
const iconDictionary = { 
    "GRO" : "shopping_basket",
    "MED" : "vaccines",
    "REC" : "phone_android",
    "SHO" : "shop",
    "FOD" : "restaurant",
    "DON" : "volunteer_activism",
    "OTT" : "movie",
    "MOV" : "theaters",
    "EXP" : "monetization_on",
    "TBJ" : "person",
    "TOD" : "woman",
    "CRY" : "currency_bitcoin",
    "PPF" : "energy_savings_leaf",
    "EIN" : "payments",
    "SAL" : "payments",
    "ESL" : "paid"
}

const colors = {
    "VEX" : "red accent-2",
    "FEX" : "orange lighten-1",
    "INV" : "lime accent-3",
    "INC" : "green accent-2"
}
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export {categoryRelation,categoryDictionary,colors,monthNames,iconDictionary};