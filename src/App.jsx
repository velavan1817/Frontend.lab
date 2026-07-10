import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Equipment from "./pages/Equipment";

function App() {
  return (
    <Routes>

      <Route 
        path="/" 
        element={<Login />} 
      />

      <Route 
        path="/equipment" 
        element={<Equipment />} 
      />

    </Routes>
  );
}

export default App;