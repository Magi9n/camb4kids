import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() { return <div>Home</div>; }
function Login() { return <div>Login</div>; }
function Dashboard() { return <div>Dashboard</div>; }
function ExchangeCalculator() { return <div>Exchange Calculator</div>; }
function AdminPanel() { return <div>Admin Panel</div>; }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exchange" element={<ExchangeCalculator />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 