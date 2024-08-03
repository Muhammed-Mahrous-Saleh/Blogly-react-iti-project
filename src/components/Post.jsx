import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
} from "firebase/firestore";
import Heart from "../icons/Heart";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../config/firebase";
import { notify } from "../helpers/toastify";
import { deleteObject, ref } from "firebase/storage";

// eslint-disable-next-line react/prop-types
export default function Post({ postId, handleEdit, handleDelete }) {
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [postUser, setPostUser] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            const postDoc = doc(db, "posts", postId);
            const postSnapshot = await getDoc(postDoc);
            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                setPost(postData);
                setLikeCount(postData.likes.length);
                if (currentUser)
                    setIsLiked(postData.likes.includes(currentUser.uid));
                else setIsLiked(false);

                const userDoc = doc(db, "users", postData.userId);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    setPostUser(userSnapshot.data());
                }
            }
        };

        fetchPost();
    }, [postId, currentUser]);

    const handleLike = async () => {
        if (currentUser) {
            const postDoc = doc(db, "posts", postId);
            if (isLiked) {
                await updateDoc(postDoc, {
                    likes: arrayRemove(currentUser.uid),
                });
                setIsLiked(false);
                setLikeCount(likeCount - 1);
            } else {
                await updateDoc(postDoc, {
                    likes: arrayUnion(currentUser.uid),
                });
                setIsLiked(true);
                setLikeCount(likeCount + 1);
            }
        } else {
            document.getElementById("my_modal_1").showModal();
        }
    };

    if (!post || !postUser) {
        return <div></div>;
    }

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl w-3/4 h-96 flex flex-col lg:flex-row">
            <figure className="relative w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
                <img
                    src={post.postImage}
                    alt="Post"
                    className="object-cover w-full h-full"
                />
                <div className="flex items-center text-center absolute bottom-5 left-5 h-fit">
                    <div className="cursor-pointer" onClick={handleLike}>
                        <Heart filled={isLiked} />
                    </div>
                    <div className="text-red-600">{likeCount}</div>
                </div>
            </figure>
            <div className="card-body w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                    <h2 className="card-title break-words">{post.title}</h2>
                    <h4 className="py-6">
                        by{" "}
                        <span className="font-bold">
                            {postUser.displayName}
                        </span>
                    </h4>
                    <p className="break-words">{post.body}</p>
                </div>
                {currentUser && currentUser.uid === post.userId && (
                    <div className="card-actions justify-end">
                        <button
                            onClick={() => handleDelete(post)}
                            type="button"
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleEdit}
                            type="button"
                            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
