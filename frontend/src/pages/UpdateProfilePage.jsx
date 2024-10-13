import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import usePrevImg from "../hooks/usePrevImg";

const UpdateProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useRecoilState(userAtom);

  const [updating, setUpdating] = useState(false);

  const toast = useShowToast();

  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
    confirm_password: "",
    bio: user.bio,
  });

  const fileRef = useRef(null);

  const { handleImageChange, imgUrl } = usePrevImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    // Build a payload with only the fields that have been changed
    let updatedFields = {};
    if (inputs.name !== user.name) updatedFields.name = inputs.name;
    if (inputs.username !== user.username) updatedFields.username = inputs.username;
    if (inputs.email !== user.email) updatedFields.email = inputs.email;
    if (inputs.bio !== user.bio) updatedFields.bio = inputs.bio;
    if (inputs.password) updatedFields.password = inputs.password;
    if (inputs.confirm_password) updatedFields.confirm_password = inputs.confirm_password;

    // If there is a new profile picture
    if (imgUrl) updatedFields.profilePic = imgUrl;

    // If no fields were changed, show a message and return
    if (Object.keys(updatedFields).length === 0 ) {
      toast("Info", "No changes made to the profile", "info");
      return;
    }
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        let contentType = res.headers.get("Content-Type")
        // Try to extract error data (assuming the response may contain error text instead of JSON)
        let errorData;
        if (contentType && contentType.includes("application/json")) {
          errorData = await res.json(); // Parse error as JSON
        } else {
          errorData = await res.text(); // Fallback to parsing as text (HTML or plain text)
        }

        console.log("Error response:", errorData); // Log the error data for debugging
        toast("Error", `Failed to update profile: ${errorData}`, "error"); // Show error toast
        return;
      }
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast("Success", "Profile updated successfully", "success");
    } catch (err) {
      toast("Error", err.message, "error");
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };


  return (
    <>
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Edit Your Profile
          </Heading>
          <FormControl id="profilePic">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Edit picture
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="name">
            <FormLabel>name</FormLabel>
            <Input
              placeholder={user.name || "name"}
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>
          <FormControl id="userName">
            <FormLabel>User name</FormLabel>
            <Input
              placeholder={user.username || "username"}
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder={user.email || "email"}
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>
          <FormControl id="bio">
            <FormLabel>bio</FormLabel>
            <Input
              placeholder={user.bio || "bio"}
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                value={inputs.password}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirm_password">
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="confirm password"
                onChange={(e) =>
                  setInputs({ ...inputs, confirm_password: e.target.value })
                }
                value={inputs.confirm_password}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
              // disabled={updating}
              isLoading={updating}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
     </>
  );
};

export default UpdateProfilePage;
