import { useState } from "react";
import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import useSearchUser from "../hooks/useSearchUser"; // Import the hook

const SearchUser = () => {
    const [username, setUsername] = useState(""); // Local state for username
    const { handleSearch } = useSearchUser(username); // Use the hook and pass the username

    
    return (
        <Flex w={"80%"} justifyContent={"center"} mt={10}>
            <FormControl id="username" alignItems={"center"}>
                <FormLabel mb={2} mr={3}>Search a user</FormLabel>
                <Flex alignItems={"center"}>
                    <Input
                        placeholder={"Search a user profile"}
                        _placeholder={{ color: "gray.500" }}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <Button onClick={handleSearch} ml={3} rightIcon={<SearchIcon />}> 
                        Search
                    </Button>
                </Flex>
            </FormControl>
        </Flex>
    );
};

export default SearchUser;
