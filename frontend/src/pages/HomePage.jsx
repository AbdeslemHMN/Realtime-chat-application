import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LougoutButton from "../components/LogoutButton";
import UpdateButton from "../components/UpdateButton";

const HomePage = () => {
  return (
    <>
    <Link to={"/profile/abdou"}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"}>Visit Profile Page</Button>
      </Flex>
    </Link>
      <LougoutButton />
      <UpdateButton />
      </>
      );
};

export default HomePage;
