import React, { useState } from "react";
import api from "../services/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password
      });

      console.log("Response:", response.data);

      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");

      window.location.href = "/dashboard";

    } catch (error) {

      console.log("Login Error:", error);

      if (error.response) {

        console.log("Backend Error:", error.response.data);

        alert(
          error.response.data.message ||
          JSON.stringify(error.response.data)
        );

      } else {

        alert("Cannot connect to backend.");

      }
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />


        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />


        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Login
        </button>


      </div>

    </div>
  );
}