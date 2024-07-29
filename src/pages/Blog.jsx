/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import PlusSign from "../icons/PlusSign";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
export default function Blog({ posts, setPosts, setEditingPost }) {
    const navigate = useNavigate();
    function handleAddPost(e) {
        e.preventDefault();
        setEditingPost(null);
        navigate("/post");
    }
    function handleEditPost(post) {
        setEditingPost(post);
        navigate(`/post`, { state: { post } });
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
    }, []);
    const { currentUser } = useAuth();
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
            {posts.length > 0 &&
                posts.map((post) => (
                    <Post
                        key={post.id}
                        postId={post.id}
                        handleEdit={() => handleEditPost(post)}
                    />
                ))}
        </div>
    );
}
