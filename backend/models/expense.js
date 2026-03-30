const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },

  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },

  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amountOwe: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
}, { timestamps: true });

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;