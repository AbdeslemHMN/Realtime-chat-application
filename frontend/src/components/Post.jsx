import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";           
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue , useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";



const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null)
  const toast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts , setPosts] = useRecoilState(postAtom)


  
	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					toast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				toast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, toast]);  


    

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/delete/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      toast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      toast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user?.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/profile/${user?.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name={post.replies[0].username}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name={post.replies[1].username}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name={post.replies[2].username}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/profile/${user?.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image w={4} h={4} ml={1} src="/verified.png" />
            </Flex>
            <Flex gap={3} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id &&(
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
        </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              border={"1px solid"}
              overflow={"hidden"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
