const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./models/expense.js");
const User = require("./models/user.js");
const Group = require("./models/group.js");


const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ExpenseSplitter");
}

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is working");
});

/* ---------------- USERS ---------------- */

app.post("/users", async (req, res) => {
  try {
    const users = await User.insertMany([
      { user: "Akash" },
      { user: "Sam" },
      { user: "Govind" },
    ]);
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GROUPS ---------------- */

app.post("/groups", async (req, res) => {
  try {
    const { title, members } = req.body;

    if (!title || !Array.isArray(members)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const group = await Group.create({
      title,
      members,
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/groups/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const group = await Group.findById(groupId).populate("members");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- EXPENSES ---------------- */

app.post("/groups/:groupId/expenses", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, amount, paidBy, participants } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({ error: "Invalid participants" });
    }

    if (!participants.includes(paidBy)) {
      return res.status(400).json({ error: "paidBy must be in participants" });
    }

    const share = amount / participants.length;

    const result = participants.map((userId) => ({
      userId,
      amountOwe: userId === paidBy ? 0 : share,
    }));

    const expense = await Expense.create({
      title,
      amount,
      paidBy,
      participants: result,
      group: groupId,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/groups/:groupId/expenses", async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy")
      .populate("participants.userId");

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SERVER ---------------- */

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});