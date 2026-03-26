const mongoose = require("mongoose");


const ParticipantSchema = new mongoose.Schema({
    user: {
        type: String,
      },
      amountOwe:{
        type: Number,
      }
});
const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paidBy: {
    type: String,
    required: true,
  },
  participants: [
    ParticipantSchema
  ],
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
