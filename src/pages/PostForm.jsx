import React, { useState } from "react";

const PostForm = ({ onSubmit, initialPost }) => {
    const [title, setTitle] = useState(initialPost?.title || "");
    const [body, setBody] = useState(initialPost?.body || "");
    const [image, setImage] = useState(initialPost?.image || null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
            title,
            body,
            image,
        };
        onSubmit(postData);
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
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
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Image</span>
                    </label>
                    <input
                        type="file"
                        className="file-input file-input-bordered"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="form-control mt-6">
                    <button className="btn btn-primary">
                        {initialPost ? "Edit Post" : "Add Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
