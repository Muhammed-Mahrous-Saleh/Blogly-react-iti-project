import "./App.css";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import RouteNotFound from "./pages/RouteNotFound";

import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div className="flex flex-col min-h-screen box-border">
            <Navbar />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
            />
            <Routes>
                <Route path="/" element={<Blog />}></Route>
                <Route path="/post" element={<Blog />}></Route>
                {/* <Route path="/login-register" element={<Login />}></Route> */}
                <Route path="*" element={<RouteNotFound />}></Route>
            </Routes>
        </div>
    );
}

export default App;
