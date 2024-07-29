/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import PlusSign from "../icons/PlusSign";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { getDocs, collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function Blog({ posts, setPosts, setEditingPost }) {
    const navigator = useNavigate();
    function handleAddPost(e) {
        e.preventDefault();
        setEditingPost(null);
        navigator("/post");
    }
    function handleEditPost(post) {
        setEditingPost(post);
        navigator("/post");
    }
    useEffect(() => {
        (async () => {
            try {
                // getdata
                const postCollectionRef = collection(db, "posts");
                const res = await getDocs(postCollectionRef);
                const data = res.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                // update data state with fetched data
                setPosts(data);
            } catch (err) {
                console.error(err);
            }
        })();
        console.log(posts);
    }, []);
    const { currentUser } = useAuth();
    console.log("posts", posts);
    return (
        <div className="flex flex-col gap-5 my-7 w-full items-center mt-20">
            {currentUser && (
                <Link
                    onClick={(e) => {
                        handleAddPost(e);
                    }}
                    className="fixed bottom-10 btn btn-circle bg-blue-700 hover:bg-blue-800 text-white self-end me-32"
                >
                    <PlusSign />
                </Link>
            )}
            {posts.map((post) => (
                <Post key={post.id} postId={post.id} />
            ))}
        </div>
    );
}
