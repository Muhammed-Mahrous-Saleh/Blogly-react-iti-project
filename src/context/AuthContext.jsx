import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                const userDoc = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setUserInfo(userSnapshot.data());
                } else {
                    setUserInfo(null);
                }
            } else {
                setUserInfo(null);
            }
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);
    return (
        <AuthContext.Provider value={{ currentUser, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
