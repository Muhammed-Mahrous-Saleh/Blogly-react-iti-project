import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../config/firebase";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { useLocation, useNavigate } from "react-router-dom";
import { notify } from "../helpers/toastify";

// eslint-disable-next-line react/prop-types
export default function PostForm({ onSubmit }) {
    const { state } = useLocation();
    const initialPost = state?.post;
    const [title, setTitle] = useState(initialPost?.title || "");
    const [body, setBody] = useState(initialPost?.body || "");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(initialPost?.postImage || null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(image);
        } else if (initialPost) {
            setPreview(initialPost.postImage);
        } else {
            setPreview(null);
        }
    }, [image, initialPost]);

    const postsCollectionRef = collection(db, "posts");

    const createPost = async () => {
        let postImageUrl = "";
        if (image) {
            const imageRef = ref(
                storage,
                `postImages/${image.name + Math.random}`
            );
            const snapshot = await uploadBytes(imageRef, image);
            postImageUrl = await getDownloadURL(snapshot.ref);
        }

        const newPost = {
            title,
            body,
            userId: currentUser.uid,
            postImage: postImageUrl,
            likes: [], // Initialize likes as an empty array
        };

        try {
            await addDoc(postsCollectionRef, newPost);
            notify("Post added successfully", "success");
            navigate(`/`);
        } catch (error) {
            notify("Failed to add the post", "error");
        }
    };

    const updatePost = async () => {
        let postImageUrl = initialPost.postImage;
        if (image && image !== initialPost.postImage) {
            if (initialPost.postImage) {
                const oldImageRef = ref(storage, initialPost.postImage);
                await deleteObject(oldImageRef).catch((e) => {
                    console.log("e", e);
                });
            }
            const imageRef = ref(
                storage,
                `postImages/${image.name + Math.random}`
            );
            const snapshot = await uploadBytes(imageRef, image);
            postImageUrl = await getDownloadURL(snapshot.ref);
        }

        const updatedPost = {
            ...initialPost,
            title,
            body,
            postImage: postImageUrl,
            likes: initialPost.likes,
        };

        try {
            const postDoc = doc(db, "posts", initialPost.id);
            await updateDoc(postDoc, updatedPost);
            notify("Post updated successfully", "success");
            navigate(`/`);
        } catch (error) {
            notify("Failed to update the post", "error");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleImageClick = () => {
        document.getElementById("imageInput").click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (initialPost) {
            await updatePost();
        } else {
            await createPost();
        }
        onSubmit({ title, body, image });
    };

    return (
        <div className="p-4 max-w-4xl mx-auto flex flex-col lg:flex-row gap-4">
            <div className="card lg:card-side bg-base-100 shadow-xl w-1/2 h-80">
                {preview ? (
                    <figure className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="cursor-pointer"
                            onClick={handleImageClick}
                        />
                    </figure>
                ) : (
                    <div
                        className="w-full h-64 bg-gray-200 flex items-center justify-center cursor-pointer"
                        onClick={handleImageClick}
                    >
                        <span className="text-gray-500">
                            Click to add image
                        </span>
                    </div>
                )}
                <input
                    type="file"
                    id="imageInput"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>
            <div className="lg:w-1/2">
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Post Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="input input-bordered"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Post Body</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered"
                            placeholder="Body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary">
                            {initialPost ? "Edit Post" : "Add Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
