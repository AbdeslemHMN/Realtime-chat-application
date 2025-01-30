import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function UserNotFound() {
  const navigate = useNavigate(); // Initialize navigate
  const handleNavigate = () => navigate("/"); // Create a function to navigate back
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={"red.500"}
          rounded={"50px"}
          w={"55px"}
          h={"55px"}
          textAlign="center"
        >
          <CloseIcon boxSize={"20px"} color={"white"} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        User Not Found
      </Heading>
      <Text color={"gray.500"}>User doesn't exist</Text>
      <Flex justifyContent={"center"}>
        <Button mt={3} mx={"auto"} onClick={handleNavigate}>
          Go Back
        </Button>
      </Flex>
    </Box>
  );
}
