import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LougoutButton from "../components/LogoutButton";
import UpdateButton from "../components/UpdateButton";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import SearchUser from "../components/SearchUser";

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
