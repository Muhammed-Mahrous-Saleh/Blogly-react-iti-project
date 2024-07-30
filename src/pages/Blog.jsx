/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import PlusSign from "../icons/PlusSign";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Blog({ posts, setPosts, setEditingPost }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(posts);

    function handleAddPost(e) {
        e.preventDefault();
        setEditingPost(null);
        navigate("/post");
    }

    function handleEditPost(post) {
        setEditingPost(post);
        navigate(`/post`, { state: { post } });
    }

    function handleSearch(e) {
        setSearch(e.target.value);

        setFiltered(
            posts.filter(
                (post) =>
                    post.body
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                    post.title
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
            )
        );
    }

    useEffect(() => {
        const postCollectionRef = collection(db, "posts");
        const q = query(postCollectionRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const posts = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setPosts(posts);
                setFiltered(posts);
                setLoading(false);
            },
            (error) => {
                console.error("Failed to fetch posts:", error);
            }
        );

        return () => unsubscribe(); // Clean up the subscription
    }, [setPosts]);

    const { currentUser } = useAuth();

    return (
        <div className="flex flex-col gap-5 my-7 w-full items-center mt-20">
            <label className="input input-bordered flex items-center gap-2 w-1/2">
                <input
                    type="text"
                    className="grow"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => handleSearch(e)}
                />
            </label>
            <div className="flex flex-col gap-5 my-7 w-full items-center mt-10">
                {currentUser && (
                    <Link
                        onClick={(e) => {
                            handleAddPost(e);
                        }}
                        className="fixed bottom-10 btn btn-circle bg-blue-700 hover:bg-blue-800 text-white self-end me-5 lg:me-24 z-20 "
                    >
                        <PlusSign />
                    </Link>
                )}
                {loading ? (
                    <div className="flex flex-col gap-5 w-full justify-center items-center">
                        <div className="card lg:card-side bg-base-100 shadow-xl w-3/4 h-96 flex flex-col lg:flex-row">
                            <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
                                <div className="skeleton h-full w-full"></div>
                            </div>

                            <div className="card-body w-full lg:w-1/2 flex flex-col justify-between">
                                <div>
                                    <div className="skeleton h-4 w-28 mb-2"></div>
                                    <div className="skeleton h-4 w-16 mb-2"></div>
                                    <div>
                                        <div className="skeleton h-4 w-full mb-2"></div>
                                        <div className="skeleton h-4 w-full mb-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card lg:card-side bg-base-100 shadow-xl w-3/4 h-96 flex flex-col lg:flex-row">
                            <figure className="relative w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
                                <div className="skeleton h-full w-full"></div>
                            </figure>
                            <div className="card-body w-full lg:w-1/2 flex flex-col justify-between">
                                <div>
                                    <div className="skeleton h-4 w-28 mb-2"></div>
                                    <div className="skeleton h-4 w-16 mb-2"></div>
                                    <div>
                                        <div className="skeleton h-4 w-full mb-2"></div>
                                        <div className="skeleton h-4 w-full mb-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {posts.length === 0 ? (
                            <div className="text-5xl font-bold text-gray-400">
                                No posts
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-5xl font-bold text-gray-400">
                                No posts for {search} key words.
                            </div>
                        ) : (
                            filtered.map((post) => (
                                <Post
                                    key={post.id}
                                    postId={post.id}
                                    handleEdit={() => handleEditPost(post)}
                                />
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
