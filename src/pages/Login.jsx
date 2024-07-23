import { useState } from "react";
import { auth } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import EmailIcon from "../icons/EmailIcon";
import UserIcon from "../icons/UserIcon";
import KeyIcon from "../icons/KeyIcon";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);

    const handleSignin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSigninRegister = async () => {
        if (isLoginMode) {
            await handleSignin();
        } else {
            await handleRegister();
        }
        document.getElementById("my_modal_1").close();
    };
    // const mode = "register";
    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <div className="mt-20 flex flex-col gap-5 w-96 mx-auto pb-8">
                    <label className="input input-bordered flex items-center gap-2">
                        <EmailIcon />
                        <input
                            type="text"
                            className="grow"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    {!isLoginMode && (
                        <label className="input input-bordered flex items-center gap-2">
                            <UserIcon />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Username"
                            />
                        </label>
                    )}
                    <label className="input input-bordered flex items-center gap-2">
                        <KeyIcon />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    {!isLoginMode && (
                        <label className="input input-bordered flex items-center gap-2">
                            <KeyIcon />
                            <input
                                type="password"
                                className="grow"
                                placeholder="Retype Password"
                            />
                        </label>
                    )}

                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        to="/login-register"
                        onClick={handleSigninRegister}
                    >
                        {isLoginMode ? "Login" : "Register"}
                    </button>
                    <p>
                        {isLoginMode
                            ? `Not have an account `
                            : `Have an account `}
                        <a
                            className="text-blue-800 cursor-pointer"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                            }}
                        >
                            {isLoginMode ? `Register.` : `Login.`}
                        </a>
                    </p>
                </div>
            </div>
        </dialog>
    );
}
