import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <Navbar fluid rounded className="fixed left-0 right-0 drop-shadow">
            <NavbarBrand href="https://flowbite-react.com">
                <img
                    src="/blog_icon.ico"
                    className="mr-3 h-6 sm:h-9"
                    alt="Flowbite React Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    Flowbite React
                </span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <Link
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    to="/login-register"
                >
                    Log in / Sign up
                </Link>
            </div>
        </Navbar>
    );
}

export default NavBar;
