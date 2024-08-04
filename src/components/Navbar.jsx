import { Link } from "react-router-dom";
import Login from "../pages/Login";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { notify } from "../helpers/toastify";

function NavBar() {
    const { currentUser } = useAuth();

    const handleLogOut = async () => {
        try {
            signOut(auth);
            notify("Signed out successfully", "success");
        } catch (err) {
            notify("Failed to sign out, check network connection!", "error");
        }
    };

    return (
        <div className="bg-base-200  left-0 right-0 fixed z-50 w-full shadow-md">
            <div className="navbar container  mx-auto ">
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
        </div>
    );
}

export default NavBar;
