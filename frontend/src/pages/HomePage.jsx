import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LougoutButton from "../components/LogoutButton";
import UpdateButton from "../components/UpdateButton";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import SearchUser from "../components/SearchUser";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";

const toast = useShowToast()

useEffect(() => {
  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/posts/feed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        toast("An error occurred.", data.error, "error");
        return;
      }
      
      
    } catch (err) {
      toast("An error occurred.", err.message, "error")
    }
  }
}, []);

const HomePage = () => {
  const user = useRecoilValue(userAtom)
  return (
    <>
    <Link to={`/profile/${user.username}`}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"}>Visit Profile Page</Button>
      </Flex>
    </Link>
      <LougoutButton />
      <UpdateButton />
      <SearchUser />

      </>
      );
};

export default HomePage;
