
import { useEffect, useState } from "react";
function App() {
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    fetch("http://localhost:8080/users")
    .then(res => res.json())
    .then(data =>{
      console.log(data);
      setUsers(data);
    })
  },[])
  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Welcome to Expense Splitter</h1>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>This is a simple application to split expenses among friends. Please use the API endpoints to create groups, add expenses, and view balances.</p>
      <h3>Users</h3>
      <ul>
        {
          users.map((u) =>{
            return <li key={u._id}>{u.user}</li>
          })
        }
      </ul>
    </>
  )
}

export default App
