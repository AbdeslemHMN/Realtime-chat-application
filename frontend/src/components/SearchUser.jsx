import { useState } from "react";
import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import useSearchUser from "../hooks/useSearchUser"; // Import the hook
import { useRef } from "react";

const SearchUser = () => {
    const [username, setUsername] = useState(""); // Local state for username
    const { handleSearch } = useSearchUser(username); // Use the hook and pass the username
    const searchButtonRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            searchButtonRef.current.click();
        }
    };

    return (
        <Flex w={"full"} justifyContent={"center"} mt={10} >
            <FormControl id="username" alignItems={"center"}>
                <FormLabel mb={4} mr={3} htmlFor="username-input">Search a user</FormLabel>
                <Flex alignItems={"center"}>
                    <Input
                        id="username-input"
                        placeholder={"Search a user profile"}
                        _placeholder={{ color: "gray.500" }}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress} // Add onKeyPress handler
                        autoFocus // This will automatically focus the input field
                    />
                    <Button ref={searchButtonRef} onClick={handleSearch} ml={3} rightIcon={<SearchIcon />}>
                        Search
                    </Button>
                </Flex>
            </FormControl>
        </Flex>
    );
};

export default SearchUser;
