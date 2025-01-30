import { Flex ,Avatar ,Text,Image,Box,Button,Divider} from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons";
import Actions from "../components/Actions";
import { useEffect} from "react";
import useShowToast from "../hooks/useShowToast";
import { Spinner } from "@chakra-ui/react";
import Comment from "../components/Comment";
import { formatDistanceToNow } from "date-fns";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState , useRecoilValue } from "recoil";
import postAtom from "../atoms/postAtom";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";



const PostPage = () => {
  const { user, loading } = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postAtom)
  const { username } = useParams();
  const toast = useShowToast();
  const { pid } = useParams()
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];


useEffect( () => {
  const getPosts = async () => { 
      setPosts([])
      try { 
        const res = await fetch(`/api/posts/${pid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
        )
        const data = await res.json()
        if (data.error) {
          toast("Error", data.error, "error")
          return
        }
        setPosts([data])
      } catch (err) {
        toast("Error", err.message, "error")
      }
      }
    getPosts();
}, [toast, pid, setPosts])
  
  const handleDeletePost = async (e) => { 
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/delete/${currentPost._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      if (data.error) {
        toast("Error", data.error, "error")
        return
      }
      toast("Success", "Post deleted successfully", "success")
      navigate(`/profile/${username}`)
    } catch (err) {
      toast("Error", err.message, "error")
    }
  }

  if (!user && loading) {
    return (
    <Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
    </Flex>
  )
  }

  if (!currentPost) return null;
  
  return (
    <>
    <Flex>
      <Flex w={"full"} alignItems={"center"} gap={3}>
        <Avatar src={user?.profilePic} size={"md"} name={user?.username}/>
        <Flex>
          <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
          <Image src="/verified.png" w={4} h={4} ml={1}/>
        </Flex>
      </Flex>
      <Flex gap={3} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id &&(
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
        </Flex>
    </Flex>
      <Text my={3}>{currentPost?.text}</Text>
    {currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
      </Flex>
      
    <Divider my={4}/>
    {currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
          lastReply={reply._id === currentPost?.replies[currentPost.replies.length - 1]._id}
				/>
			))}
    </>
  )
}

export default PostPage