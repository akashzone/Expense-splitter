
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Group from "./pages/Group";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUsers(data);
      })
  }, []);



  const handleSelect = (id) => {
    setSelectedMembers((prev) => {
      if (prev.includes(id)) {
        console.log(prev);
        return prev.filter((m) => m !== id); // remove
      } else {
        console.log(selectedMembers);
        return [...prev, id]; // add
      }
    });
  };

  const handleCreateGroup = async () => {
    try {
      const res = await fetch("http://localhost:8080/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          members: selectedMembers
        })
      });

      const data = await res.json();
      navigate(`/groups/${data._id}`);
      console.log(data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
              Welcome to Expense Splitter
            </h1>

            <h3>Users</h3>

            {users.map((u) => (
              <div key={u._id}>
                <input
                  type="checkbox"
                  onChange={() => handleSelect(u._id)}
                />
                {u.user}
              </div>
            ))}

            <input
              type="text"
              placeholder="Enter group title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button onClick={handleCreateGroup}>
              Create Group
            </button>
          </>
        } />

        <Route path="/groups/:id" element={<Group />} />
      </Routes>
    </>
  )
}

export default App
