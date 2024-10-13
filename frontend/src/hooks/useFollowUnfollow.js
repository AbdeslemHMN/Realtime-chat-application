import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";
const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const toast = useShowToast();
  const [updating, setUpdating] = useState(false);
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      toast("Error", "please login to follow", "error");
      return;
    }
      if (updating) return;
      setUpdating(true)
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }

      if (following) {
          toast("Success", `Unfollowed ${user.username}`, "success");
          user.followers.pop(currentUser?._id);
      } else {
          toast("Success", `Followed ${user.username}`, "success");
          user.followers.push(currentUser?._id)
      }
      setFollowing(!following);
    } catch (err) {
      toast("Error", err.message, "error");
    } finally {
      setUpdating(false);
    }
  };
  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
