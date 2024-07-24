import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import EmailIcon from "../icons/EmailIcon";
import UserIcon from "../icons/UserIcon";
import KeyIcon from "../icons/KeyIcon";
import { notify } from "../helpers/toastify";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    retypePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .when("isLoginMode", {
            is: false,
            then: Yup.string().required("Retype Password is required"),
        }),
    username: Yup.string().when("isLoginMode", {
        is: false,
        then: Yup.string().required("Username is required"),
    }),
});

export default function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { userInfo, currentUser } = useAuth();

    const closeModal = () => {
        document.getElementById("my_modal_1").close();
    };

    const fetchUserInfo = async (uid) => {
        try {
            const userDoc = doc(db, "users", uid);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                return userSnapshot.data();
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
        return null;
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            retypePassword: "",
            username: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isLoginMode) {
                try {
                    const { user } = await signInWithEmailAndPassword(
                        auth,
                        values.email,
                        values.password
                    );
                    const userInfo = await fetchUserInfo(user.uid);
                    notify(
                        `Logged in successfully, Welcome back ${
                            userInfo ? userInfo.username : ""
                        }`,
                        "success"
                    );
                    closeModal();
                } catch (error) {
                    notify(
                        "Email or Password is incorrect, please try again.",
                        "error"
                    );
                    console.error("Login error:", error);
                }
            } else {
                try {
                    const { user } = await createUserWithEmailAndPassword(
                        auth,
                        values.email,
                        values.password
                    );
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: values.email,
                        username: values.username,
                    });

                    const userInfo = await fetchUserInfo(user.uid);
                    notify(
                        `Registered successfully, Hello ${userInfo.username}.`,
                        "success"
                    );
                    closeModal();
                } catch (error) {
                    notify(
                        "Failed to register, please make sure of correct inputs.",
                        "error"
                    );
                    console.error("Registration error:", error);
                }
            }
        },
    });

    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <div className="mt-20 flex flex-col gap-5 w-96 mx-auto pb-8">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="input input-bordered flex items-center gap-2">
                                <EmailIcon />
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Email"
                                    id="email"
                                    {...formik.getFieldProps("email")}
                                />
                            </label>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-600">
                                    {formik.errors.email}
                                </div>
                            ) : null}
                        </div>
                        {!isLoginMode && (
                            <div className="flex flex-col gap-1">
                                <label className="input input-bordered flex items-center gap-2">
                                    <UserIcon />
                                    <input
                                        type="text"
                                        className="grow"
                                        placeholder="Username"
                                        id="username"
                                        {...formik.getFieldProps("username")}
                                    />
                                </label>
                                {formik.touched.username &&
                                formik.errors.username ? (
                                    <div className="text-red-600">
                                        {formik.errors.username}
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="input input-bordered flex items-center gap-2">
                                <KeyIcon />
                                <input
                                    type="password"
                                    className="grow"
                                    placeholder="Password"
                                    id="password"
                                    {...formik.getFieldProps("password")}
                                />
                            </label>
                            {formik.touched.password &&
                            formik.errors.password ? (
                                <div className="text-red-600">
                                    {formik.errors.password}
                                </div>
                            ) : null}
                        </div>
                        {!isLoginMode && (
                            <div className="flex flex-col gap-1">
                                <label className="input input-bordered flex items-center gap-2">
                                    <KeyIcon />
                                    <input
                                        type="password"
                                        className="grow"
                                        placeholder="Retype Password"
                                        id="retypePassword"
                                        {...formik.getFieldProps(
                                            "retypePassword"
                                        )}
                                    />
                                </label>
                                {formik.touched.retypePassword &&
                                formik.errors.retypePassword ? (
                                    <div className="text-red-600">
                                        {formik.errors.retypePassword}
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            {isLoginMode ? "Login" : "Register"}
                        </button>
                    </form>
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
