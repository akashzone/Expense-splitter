

const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  paidBy: {
    type: String,
    required: true,
  },
  participants: [
  {
    userName: {
      type: String,
    },
    amountOwe: Number,
  }
]
});



const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
