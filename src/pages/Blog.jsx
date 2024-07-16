import { Link } from "react-router-dom";
import Post from "../components/Post";
import PlusSign from "../icons/PlusSign";

export default function Blog() {
    return (
        <div className="flex flex-col gap-5 my-7 w-full items-center mt-20">
            <Post />
            <Post />
            <Link
                to="/post/add"
                className="btn btn-circle bg-blue-700 hover:bg-blue-800 text-white self-end me-32"
            >
                <PlusSign />
            </Link>
        </div>
    );
}
