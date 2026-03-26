const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const Expense = require("./models/expense.js");
const User = require("./models/user.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ExpenseSplitter");
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Yess, working root !!");
});

app.get("/testUser", async (req, res) => {
  try { let sampleUsers = await User.insertMany([
    { user: "Akash" },
    { user: "Sam" },
    { user: "Govind" },
  ]);
  console.log("Saved Successfully");
  console.log(sampleUsers);
  let amount = 1200;

  let sampleExpense = new Expense({
    amount: amount,
    paidBy: sampleUsers[0]._id,
    participants: [
      
        {
          userName: sampleUsers[0]._id,
          amountOwe: amount / 3,
        },
        {
          userName: sampleUsers[1]._id,
          amountOwe: amount / 3,
        },
        {
          userName: sampleUsers[2]._id,
          amountOwe: amount / 3,
        },
    ],
  });
  
  let savedExpense = await sampleExpense.save();
  console.log(savedExpense);
  res.send("Users & Expense saved successfully!");
  }
  catch(err){
  console.log("Err: ",err);
  }
});

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
