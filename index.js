const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const Expense = require("./models/expense.js");
const User = require("./models/user.js");
const Group = require("./models/group.js");

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

// To insert sample users
app.post('/users',async (req,res)=>{
  try { let sampleUsers = await User.insertMany([
    { user: "Akash" },
    { user: "Sam" },
    { user: "Govind" },
  ]);
  console.log("Saved Successfully");
  console.log(sampleUsers);
  res.send("Users saved successfully!");
  }
  catch(err){
  console.log("Err: ",err);
  }
});

//User clicks on add group
app.post("/groups",async (req,res)=>{
  let sampleGroup = await Group.insertOne({
    title: "Goa Trip",
    members: ["Akash", "Sam", "Govind"],
  });

  console.log("Sample Group");
  console.log(sampleGroup);
  res.send("Group created successfully!");
})


// User clicks on add expense
app.post('/groups/expense',async (req,res)=>{
  /* let split = req.body.equal;
  // let {title,amount,paidBy,participants} = req.body;
     let amountOwe = 0;
  // let numberOfParticipants = participants.length;
  // if (split == "equal"){
     amountOwe = amount / numberOfParticipant;
     for (participant of participants){
      for (participant.username == paidBy){
        amountOwe == 0; 
      } 
     }
    }
  let sampleExpense = new Expense({
    title: title,
    amount: amount,
    paidBy: paidBy,
    participants: [
        
        {
          userName: participants[0].username,
          amountOwe: amountOwe,
        },
        {
          userName: participants[1].username,
          amountOwe: amountOwe,
        },
        {
          userName: participants[2].username,
          amountOwe: amountOwe,
        },
    ],
  });
    


  */  

  let amount = 1200;
  let paidBy = "Akash"
  let sampleExpense = new Expense({
    title: "Hotel",
    amount: amount,
    paidBy: paidBy,
    participants: [
        
        {
          userName: "Akash",
          amountOwe: paidBy == "Akash" ? 0 : amount / 3,
        },
        {
          userName: "Sam",
          amountOwe: paidBy == "Sam" ? 0 : amount / 3,
        },
        {
          userName: "Govind",
          amountOwe: paidBy == "Govind" ? 0 : amount / 3,
        },
    ],
  });
  
  let savedExpense = await sampleExpense.save();
  console.log(savedExpense);
  res.send("Expense saved successfully!");
})


// Tp fetch group dataUser
app.get("/groups/:id",async (req,res)=>{
  let {id} = req.params;
  let sampleGroupData = await Group.findById(id);
  console.log(sampleGroupData)
  res.send(sampleGroupData)
})

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
