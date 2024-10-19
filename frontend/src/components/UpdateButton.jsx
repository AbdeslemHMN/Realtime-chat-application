import { Button , Flex} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UpdateButton = () => {
    return (
        <Link to={"update"}>
            <Flex w={"full"} justifyContent={"center"} mt={3}>
                <Button mx={"auto"}>Update Profile Page</Button>
            </Flex>
    </Link>
);
};

export default UpdateButton;
