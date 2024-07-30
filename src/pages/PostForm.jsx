import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
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
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    title: Yup.string()
        .min(5, "Title must be at least 5 characters")
        .max(25, "Title must be less than 25 characters")
        .required("Title is required"),
    body: Yup.string()
        .min(5, "Body must be at least 5 characters")
        .max(100, "Body must be less than 100 characters")
        .required("Body is required"),
});

// eslint-disable-next-line react/prop-types
export default function PostForm({ onSubmit }) {
    const { state } = useLocation();
    const initialPost = state?.post;
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

    const createPost = async (values) => {
        let postImageUrl = "";
        if (image) {
            const imageRef = ref(
                storage,
                `postImages/${image.name + Math.random()}`
            );
            const snapshot = await uploadBytes(imageRef, image);
            postImageUrl = await getDownloadURL(snapshot.ref);
        }

        const newPost = {
            ...values,
            userId: currentUser.uid,
            postImage: postImageUrl,
            likes: [], // Initialize likes as an empty array
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(postsCollectionRef, newPost);
            notify("Post added successfully", "success");
            navigate(`/`);
        } catch (error) {
            notify("Failed to add the post", "error");
        }
    };

    const updatePost = async (values) => {
        let postImageUrl = initialPost.postImage;
        if (image && image !== initialPost.postImage) {
            if (initialPost.postImage) {
                const oldImageRef = ref(storage, initialPost.postImage);
                await deleteObject(oldImageRef).catch((e) => {
                    console.error("error", e);
                });
            }
            const imageRef = ref(
                storage,
                `postImages/${image.name + Math.random()}`
            );
            const snapshot = await uploadBytes(imageRef, image);
            postImageUrl = await getDownloadURL(snapshot.ref);
        }

        const updatedPost = {
            ...initialPost,
            ...values,
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

    const formik = useFormik({
        initialValues: {
            title: initialPost?.title || "",
            body: initialPost?.body || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (initialPost) {
                await updatePost(values);
            } else {
                await createPost(values);
            }
            onSubmit(values);
        },
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleImageClick = () => {
        document.getElementById("imageInput").click();
    };

    return (
        <div className="p-4 max-w-4xl mx-auto flex flex-col lg:flex-row gap-4 mt-20">
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
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Post Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="input input-bordered"
                            {...formik.getFieldProps("title")}
                            required
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <div className="text-red-600">
                                {formik.errors.title}
                            </div>
                        ) : null}
                    </div>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Post Body</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered"
                            placeholder="Body"
                            {...formik.getFieldProps("body")}
                            required
                        ></textarea>
                        {formik.touched.body && formik.errors.body ? (
                            <div className="text-red-600">
                                {formik.errors.body}
                            </div>
                        ) : null}
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary" type="submit">
                            {initialPost ? "Edit Post" : "Add Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
