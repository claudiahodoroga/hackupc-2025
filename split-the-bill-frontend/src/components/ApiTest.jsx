// src/components/ApiTest.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ApiTest = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/users") // <-- Esto usa el proxy de Vite
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al hacer la petición:", error);
        setError("No se pudo obtener la información.");
      });
  }, []);

  return (
    <div>
      <h2>Prueba de API</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ApiTest;