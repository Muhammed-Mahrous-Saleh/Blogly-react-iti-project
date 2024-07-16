import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col min-h-screen box-border">
            <Navbar />
            <Routes>
                <Route path="/" element={<Blog />}></Route>
                <Route path="/login-register" element={<Login />}></Route>
            </Routes>
        </div>
    );
}

export default App;
