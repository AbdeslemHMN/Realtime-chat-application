import UserHeader from "../components/UserHeader"
import UserNotFound from "../components/UserNotFound";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState } from 'recoil';
import postAtom from '../atoms/postAtom';
import useGetUserProfile from '../hooks/useGetUserProfile';
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";

const UserPage = () => {
  
  const {user, loading} = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postAtom)
  const {username} = useParams()
  const toast = useShowToast()
  const [fetchingPosts, setFetchingPosts] = useState(true);
  

  useEffect( () => {
    const getPosts = async () => { 
      try {
        setFetchingPosts(true)
        const res = await fetch(`/api/posts/user/${username}`, {
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
        setPosts(data)
      } catch (err) {
        toast("Error", err.message, "error")
        setPosts([])
      } finally {
        setFetchingPosts(false)
      }
    }
    getPosts();
  }, [username, toast , setPosts ,user])
  
  if(!user && loading) return (
    <Flex justifyContent={"center"}>
      <Spinner size={"xl"} />
    </Flex>
  )
  if (!user && !loading) return <UserNotFound />

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not post</h1>}
      {fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}
          /> 
      ))}
      <CreatePost />
    </>
  )
}

export default UserPage