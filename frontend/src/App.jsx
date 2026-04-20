import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import {Crops} from "./pages/Crops"
import {Equipment} from "./pages/Equipment"
import {Labour} from "./pages/Labour"
import {Reports} from "./pages/Reports"
import Weather from "./pages/Weather"
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}> 
        <Route path="/dashboard" element={<Dashboard/>}/> 
        <Route path="/crops" element={<Crops/>}/> 
        <Route path="/weather" element={<Weather/>}/> 
        <Route path="/equipment" element={<Equipment/>}/> 
        <Route path="/labor" element={<Labour/>}/> 
        <Route path="/reports" element={<Reports/>}/> 
      </Route>
    </Routes>
  );
}

export default App;
