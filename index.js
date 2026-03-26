const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const Expense = require("./models/expense.js");

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
  // let sampleUser = new User({
  //     amount: 1900,
  //     paidBy: "Akash"
  // });
  // console.log(sampleUser);
  let sampleUser = new Expense({
    amount: 1000,
    paidBy: "Akash",
    participants: [
      { user: "Sam", amountOwe: Math.round(1000 / 3) },
      { user: "Agnel", amountOwe: Math.round(1000 / 3) },
      { user: "Govind", amountOwe:  Math.round(1000 / 3) },
    ],
  });

  console.log(sampleUser);
  await sampleUser.save();
  res.send("Saving Sample User!");
});

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
