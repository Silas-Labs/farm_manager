import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import {Crops} from "./pages/Crops"
import {Equipment} from "./pages/Equipment"
import {Labour} from "./pages/Labour"
import {Reports} from "./pages/Reports"
import Weather from "./pages/Weather"
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}> 
    <Route path="/crops" element={<Crops/>}/> 
    <Route path="/weather" element={<Equipment/>}/> 
    <Route path="/equipment" element={<Weather/>}/> 
    <Route path="/labor" element={<Labour/>}/> 
    <Route path="/reports" element={<Reports/>}/> 
        </Route>
    </Routes>
  );
}

export default App;
