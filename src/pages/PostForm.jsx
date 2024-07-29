/* eslint-disable react/prop-types */
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
import { useNavigate } from "react-router-dom";
import { notify } from "../helpers/toastify";

function PostForm({ onSubmit, initialPost }) {
    const [title, setTitle] = useState(initialPost?.title || "");
    const [body, setBody] = useState(initialPost?.body || "");
    const [image, setImage] = useState(initialPost?.image || null);
    const [preview, setPreview] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }
    }, [image]);

    const postsCollectionRef = collection(db, "posts");

    const createPost = async () => {
        let postImageUrl = "";
        if (image) {
            const imageRef = ref(storage, `postImages/${image.name}`);
            const snapshot = await uploadBytes(imageRef, image);
            postImageUrl = await getDownloadURL(snapshot.ref);
        }

        const newPost = {
            title,
            body,
            userId: currentUser.uid,
            userName: currentUser.displayName,
            postImage: postImageUrl,
            likes: [], // Initialize likes as an empty array
        };

        try {
            const docRef = await addDoc(postsCollectionRef, newPost);
            notify("Post added successfully", "success");
            navigate(`/post/${docRef.id}`);
        } catch (error) {
            notify("Failed to add the post", "error");
        }
    };

    const updatePost = async () => {
        let postImageUrl = initialPost.postImage;
        if (image && image !== initialPost.image) {
            if (initialPost.postImage) {
                // Delete the old image from Firebase Storage
                const oldImageRef = ref(storage, initialPost.postImage);
                await deleteObject(oldImageRef);
            }
            // Upload the new image to Firebase Storage
            const imageRef = ref(storage, `postImages/${image.name}`);
            const snapshot = await uploadBytes(imageRef, image);
            postImageUrl = await getDownloadURL(snapshot.ref);
        }

        const updatedPost = {
            ...initialPost,
            title,
            body,
            postImage: postImageUrl,
        };

        try {
            const postDoc = doc(db, "posts", initialPost.id);
            await updateDoc(postDoc, updatedPost);
            notify("Post updated successfully", "success");
            navigate(`/post/${initialPost.id}`);
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

        const postData = {
            title,
            body,
            image,
        };
        onSubmit(postData);
        if (initialPost) {
            await updatePost();
        } else {
            await createPost();
        }
        navigate("/");
    };

    return (
        <div className="p-4 max-w-4xl mx-auto flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col items-center justify-center lg:w-1/2">
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto cursor-pointer"
                        onClick={handleImageClick}
                    />
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

export default PostForm;
