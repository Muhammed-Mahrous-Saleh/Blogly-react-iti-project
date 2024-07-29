import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
} from "firebase/firestore"; // Import necessary functions
import Heart from "../icons/Heart";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../config/firebase";
import { notify } from "../helpers/toastify";
import { deleteObject, ref } from "firebase/storage";

// eslint-disable-next-line react/prop-types
export default function Post({ postId }) {
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

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setPost(null); // Optimistically remove the post from the UI
            try {
                const postDoc = doc(db, "posts", postId);
                const postSnapshot = await getDoc(postDoc);
                if (postSnapshot.exists()) {
                    const postData = postSnapshot.data();

                    // Delete the image from Firebase Storage
                    if (postData.postImage) {
                        const imageRef = ref(storage, postData.postImage);
                        await deleteObject(imageRef);
                    }
                    await deleteDoc(postDoc);
                    notify("Post deleted successfully", "success");
                    navigate("/"); // Redirect to the home page after deletion
                }
            } catch (error) {
                notify("Failed to delete the post", "error");
                setPost(post); // Revert the optimistic UI change
            }
        }
    };

    const handleEdit = () => {
        navigate(`/post/${postId}`, { state: { post } }); // Pass the current post data to the edit page
    };

    if (!post || !postUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl w-1/2 h-80">
            <figure className="relative w-1/2">
                <img src={post.postImage} alt="Post" />
                <div className="flex items-center text-center absolute bottom-5 left-5 h-fit">
                    <div className="cursor-pointer" onClick={handleLike}>
                        <Heart filled={isLiked} />{" "}
                    </div>
                    <div>{likeCount}</div>
                </div>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <h4>by {postUser.displayName}</h4>{" "}
                {/* Using userName from users collection */}
                <p>{post.body}</p>
                {currentUser && currentUser.uid === post.userId && (
                    <div className="card-actions justify-end">
                        <button
                            onClick={handleDelete}
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
