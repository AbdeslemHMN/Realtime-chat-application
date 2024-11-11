import { Button, Flex ,Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilState} from "recoil";
import { useEffect , useState } from "react";
import useShowToast from "../hooks/useShowToast";
import postAtom from "../atoms/postAtom";
import { SearchIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";
import Post from "../components/Post";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const toast = useShowToast();
  const [loading, setLoading] = useState(true);
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
        // console.log(data);
        setPosts(data);
        
      } catch (err) {
        toast("An error occurred.", err.message, "error")
      } finally {
        setLoading(false);
      };
    }
    fetchFeed();
  }, [toast , setPosts]);
  return (
    <>
    {!loading && (<Link to={"/search"}>
      <Flex w={"full"} justifyContent={"center"} mb={5}>
        <Button mx={"auto"} leftIcon={<SearchIcon />}>Search for a user </Button>
      </Flex>
    </Link>)}
    {loading && <Flex justifyContent={"center"}><Spinner size={"xl"}/></Flex>}

    {!loading && posts.length === 0 && <Text textAlign={"center"} fontSize={"2xl"}  color={"gray.light"}>you should follow somme people to reach your feed ...</Text>}

    {posts.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy}/>
      )
    )
    }
    
      </>
      );
};

export default HomePage;
