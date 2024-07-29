import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Heart from "../icons/Heart";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";

// eslint-disable-next-line react/prop-types
export default function Post({ postId }) {
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [postUser, setPostUser] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const postDoc = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postDoc);
            if (postSnapshot.exists()) {
                setPost(postSnapshot.data());

                const userDoc = doc(db, "users", postSnapshot.data().userId);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setPostUser(userSnapshot.data());
                }
            }
        };

        fetchPost();
    }, [postId]);

    if (!post || !postUser) {
        return (
            <div className="flex w-96 gap-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="flex w-52 flex-col gap-4">
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl w-1/2 h-80 box-border">
            <figure className="relative w-1/2">
                <img
                    src={
                        post.postImage ||
                        "https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                    }
                    alt="Post"
                />
                <div className="flex items-center text-center absolute bottom-5 left-5 h-fit">
                    <div className="cursor-pointer">
                        <Heart />
                    </div>
                    <div>25.6K</div>
                </div>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <h4>@{postUser.displayName}</h4> <p>{post.body}</p>
                {currentUser && currentUser.uid === post.userId && (
                    <div className="card-actions justify-end">
                        <button
                            type="button"
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                            Delete
                        </button>
                        <Link
                            to={`/post/edit/${postId}`}
                            type="button"
                            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
