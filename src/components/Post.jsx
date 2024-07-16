import { Link } from "react-router-dom";

export default function Post() {
    return (
        <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                    alt="Album"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">New album is released!</h2>
                <h4>@user_name</h4>
                <p>Click the button to listen on Spotiwhy app.</p>
                <div className="card-actions justify-end">
                    <button
                        to="/"
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                        Delete
                    </button>
                    <Link
                        to="/post/edit"
                        type="button"
                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                    >
                        {" "}
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}
