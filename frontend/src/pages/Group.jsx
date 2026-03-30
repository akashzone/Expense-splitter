import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Group() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState([]);

  // fetch expenses
  const fetchExpenses = () => {
    fetch(`http://localhost:8080/groups/${id}/expenses`)
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error(err));
  };

  // fetch group + expenses
  useEffect(() => {
    fetch(`http://localhost:8080/groups/${id}`)
      .then((res) => res.json())
      .then((data) => setGroup(data))
      .catch((err) => console.error(err));

    fetchExpenses();
  }, [id]);

  // select participants
  const handleSelect = (userId) => {
    setParticipants((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((p) => p !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // add expense
  const handleAddExpense = async () => {
    try {
      const res = await fetch(`http://localhost:8080/groups/${id}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          paidBy,
          participants,
        }),
      });

      await res.json();

      fetchExpenses();

      setTitle("");
      setAmount("");
      setPaidBy("");
      setParticipants([]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // calculate balances
  const calculateBalances = () => {
    if (!group) return {};

    const balance = {};

    group.members.forEach((m) => {
      balance[m._id] = {
        name: m.user,
        amount: 0,
      };
    });

    expenses.forEach((exp) => {
      if (!exp.paidBy || !exp.participants) return;

      balance[exp.paidBy._id].amount += exp.amount;

      exp.participants.forEach((p) => {
        if (p.userId._id !== exp.paidBy._id) {
          balance[p.userId._id].amount -= p.amountOwe;
        }
      });
    });

    return balance;
  };

  // simplify debts
  const simplifyDebts = (balances) => {
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([id, user]) => {
      if (user.amount > 0) {
        creditors.push({ id, ...user });
      } else if (user.amount < 0) {
        debtors.push({ id, ...user });
      }
    });

    const transactions = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(
        Math.abs(debtor.amount),
        creditor.amount
      );

      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount),
      });

      debtor.amount += amount;
      creditor.amount -= amount;

      if (Math.abs(debtor.amount) < 1) i++;
      if (creditor.amount < 1) j++;
    }

    return transactions;
  };

  if (!group) return <p>Loading...</p>;

  const balances = calculateBalances();
  const settlements = simplifyDebts(balances);

  return (
    <div>
      <h2>{group.title}</h2>

      <h3>Members</h3>
      {group.members.map((m) => (
        <div key={m._id}>{m.user}</div>
      ))}

      <br />

      <button onClick={() => setShowForm(true)}>
        Add Expense
      </button>

      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <h3>Add Expense</h3>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <br />

          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select payer</option>
            {group.members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.user}
              </option>
            ))}
          </select>

          <h4>Participants</h4>
          {group.members.map((m) => (
            <div key={m._id}>
              <input
                type="checkbox"
                onChange={() => handleSelect(m._id)}
              />
              {m.user}
            </div>
          ))}

          <br />

          <button onClick={handleAddExpense}>
            Submit Expense
          </button>
        </div>
      )}

      <h3>Expenses</h3>

      {expenses.length === 0 && <p>No expenses yet</p>}

      {expenses.map((exp) => (
        <div
          key={exp._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
          }}
        >
          <strong>{exp.title}</strong> - ₹{exp.amount}

          <p>Paid by: {exp.paidBy?.user}</p>

          <p>Participants:</p>
          {exp.participants.map((p) => (
            <div key={p.userId?._id}>
              {p.userId?.user} owes ₹{p.amountOwe}
            </div>
          ))}
        </div>
      ))}

      <h3>Balances</h3>
      {Object.values(balances).map((b, i) => (
        <div key={i}>
          {b.name}: ₹{Math.round(b.amount)}
        </div>
      ))}

      <h3>Settlements</h3>
      {settlements.length === 0 && <p>All settled</p>}

      {settlements.map((t, i) => (
        <div key={i}>
          {t.from} pays {t.to} ₹{t.amount}
        </div>
      ))}
    </div>
  );
}

export default Group;