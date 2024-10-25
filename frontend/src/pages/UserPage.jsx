import UserHeader from "../components/UserHeader"
import UserPost from './../components/UserPost';
import UserNotFound from "../components/UserNotFound";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user , setUser] = useState(null)
  const {username} = useParams()
  const toast = useShowToast()
  const [loading, setLoading] = useState(true)

  useEffect( () => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, { 
          method: "GET" ,
          headers: { "Content-Type": "application/json" 
          } }
        )
        const data = await res.json()
        if (data.error) {
          toast("Error" , data.error , "error")
          return
        }
        setUser(data)
      } catch (err) {
        toast("Error" , err.message , "error")
        console.log(err)
      } finally{
        setLoading(false)
      }
    } ;
    getUser()
  } ,[username , toast])
  if(!user && loading) return (
    <Flex justifyContent={"center"}>
      <Spinner size={"xl"} />
    </Flex>
  )
  if (!user && !loading) return <UserNotFound />

  return (
    <>
      <UserHeader user = {user} />
      <UserPost likes={"555 Likes"} replies={"348 replies"} postImg={"/post1.png"} postTitle={"Let's talk about threads"} time={"7h"}/>
      <UserPost likes={"374 Likes"} replies={"478 replies"} postImg={"/post2.png"} postTitle={"Nice tutorial"} time={"2d"}/>
      <UserPost likes={"465 Likes"} replies={"198 replies"}postImg={"/post3.png"} postTitle={"I love this guy"} time={"3d"}/>
      <UserPost likes={"756 Likes"} replies={"894 replies"} postImg={"/post4.png"} postTitle={"This is my first thread & let's talk about my favorite app salck"} time={"4d"}/>
    </>
  )
}

export default UserPage