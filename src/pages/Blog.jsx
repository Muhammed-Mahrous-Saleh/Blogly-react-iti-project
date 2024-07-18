import { Link } from "react-router-dom";
import Post from "../components/Post";
import PlusSign from "../icons/PlusSign";
import { useAuth } from "../context/AuthContext";

export default function Blog() {
    const { currentUser } = useAuth();
    return (
        <div className="flex flex-col gap-5 my-7 w-full items-center mt-20">
            <Post />
            <Post />
            {currentUser && (
                <Link
                    to="/post/add"
                    className="btn btn-circle bg-blue-700 hover:bg-blue-800 text-white self-end me-32"
                >
                    <PlusSign />
                </Link>
            )}
        </div>
    );
}
