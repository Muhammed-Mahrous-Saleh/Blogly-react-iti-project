/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import Heart from "../icons/Heart";
import IconArrowsFullscreen from "../icons/Fullscreen";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { formatDistanceToNow } from "date-fns";

// eslint-disable-next-line react/prop-types
export default function Post({
    handleEdit,
    handleDelete,
    post,
    toggleImageOverlay,
}) {
    const { currentUser } = useAuth();
    const [postUser, setPostUser] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes.length);

    useEffect(() => {
        (async () => {
            const userDoc = doc(db, "users", post.userId);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                setPostUser(userSnapshot.data());
            }
        })();
        setIsLiked(post.likes.includes(currentUser?.uid));
    }, [post, currentUser]);

    const handleLike = async () => {
        if (currentUser) {
            const postDoc = doc(db, "posts", post.id);
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

    // Convert post createdAt Date object
    const ceatedAtDate = new Date(
        post.createdAt.seconds * 1000 + post.createdAt.nanoseconds / 1000000
    );

    const updatedAtDate = post.updatedAt
        ? new Date(
              post.updatedAt.seconds * 1000 +
                  post.updatedAt.nanoseconds / 1000000
          )
        : null;

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
                <div className="flex items-center text-center absolute bottom-5 right-5 w-fit h-fit text-transparent-reverse ">
                    <div
                        className="cursor-pointer"
                        onClick={toggleImageOverlay}
                    >
                        <IconArrowsFullscreen />
                    </div>
                </div>
            </figure>
            <div className="card-body w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                    <h2 className="card-title break-words">{post.title}</h2>
                    <h4 className="py-6 flex flex-wrap gap-2">
                        by{" "}
                        <span className="font-bold">
                            {postUser.displayName}
                        </span>
                        <span>
                            &bull;&ensp;
                            {formatDistanceToNow(ceatedAtDate, {
                                addSuffix: true,
                            })}
                        </span>
                        {updatedAtDate && (
                            <span className="">
                                last update&ensp;
                                {formatDistanceToNow(updatedAtDate, {
                                    addSuffix: true,
                                })}
                            </span>
                        )}
                    </h4>

                    <p className="break-words">{post.body}</p>
                </div>
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
                {console.log()}
            </div>
        </div>
    );
}
