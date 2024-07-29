import "./App.css";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import RouteNotFound from "./pages/RouteNotFound";

import "react-toastify/dist/ReactToastify.css";
import PostForm from "./pages/PostForm";
import { useState } from "react";

import { addDoc, collection } from "firebase/firestore";
import { db } from "./config/firebase";

const postsCollectionRef = collection(db, "posts");
const createPost = async () => {
    await addDoc(postsCollectionRef, {});
};

function App() {
    const [editingPost, setEditingPost] = useState(null);
    const [posts, setPosts] = useState([]);

    const handleAddPost = (post) => {
        setPosts([...posts, post]);
        console.log("Post added:", post);
    };

    const handleEditPost = (post) => {
        const updatedPosts = posts.map((p) =>
            p.title === editingPost.title ? post : p
        );
        setPosts(updatedPosts);
        setEditingPost(null);
        console.log("Post edited:", post);
    };
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
                <Route
                    path="/"
                    element={
                        <Blog
                            posts={posts}
                            setPosts={setPosts}
                            setEditingPost={setEditingPost}
                        />
                    }
                ></Route>
                <Route
                    path="/post"
                    element={
                        <PostForm
                            onSubmit={
                                editingPost ? handleEditPost : handleAddPost
                            }
                            initialPost={editingPost}
                        />
                    }
                ></Route>
                {/* <Route path="/login-register" element={<Login />}></Route> */}
                <Route path="*" element={<RouteNotFound />}></Route>
            </Routes>
        </div>
    );
}

export default App;
