import { Link } from "react-router-dom";
import Login from "../pages/Login";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function NavBar() {
    // let currentUser = false;
    const { currentUser } = useAuth();

    const handleLogOut = async () => {
        try {
            signOut(auth);
            notify("Failed to sign out, check network connection!", "error");
        } catch (err) {
            notify("Failed to sign out, check network connection!", "error");
        }
    };

    const notify = (msg, msgType) => toast(msg, { type: msgType });
    return (
        <div className="navbar bg-base-100 container mx-auto">
            <div className="navbar-start">
                <Link
                    to="/"
                    className="btn btn-ghost hover:bg-transparent text-xl"
                >
                    <img
                        src="/blog_icon.ico"
                        className="mr-3 h-6 sm:h-9"
                        alt="Flowbite React Logo"
                    />
                    Blogly
                </Link>
            </div>

            <div className="navbar-end">
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={
                        currentUser
                            ? handleLogOut
                            : () =>
                                  document
                                      .getElementById("my_modal_1")
                                      .showModal()
                    }
                >
                    {!currentUser ? "Log in / Sign up" : "Log out"}
                </button>
                <Login />
            </div>
        </div>
    );
}

export default NavBar;
