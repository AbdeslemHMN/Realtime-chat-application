import { useNavigate } from "react-router-dom";
import useShowToast from './useShowToast'; // Ensure you import useShowToast
const useSearchUser = (username) => {
    const navigate = useNavigate();
    const toast = useShowToast();

    const handleSearch = async () => {
        if (!username) {
            return toast("Error", "Please enter a username", "error");
        }
        try {
            navigate(`/profile/${username}`);
        } catch (err) {
            toast("An error occurred.", err.message, "error");
        }
    };


    return { handleSearch }; // Return the user and handleSearch function
};

export default useSearchUser;
