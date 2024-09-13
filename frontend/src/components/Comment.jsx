import Actions from "./Actions"
import { Avatar, Flex ,Text,Divider} from "@chakra-ui/react"
import {useState} from "react"
import { BsThreeDots } from 'react-icons/bs';

const Comment = ({likes,comment,day,name,avatar}) => {
    const [liked, setLiked] = useState(false)
  return (
    <>
    <Flex gap={4} my={2} py={2} w={"full"}>
      <Avatar size="sm" src={avatar} />
      <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"sm"} fontWeight={"bold"}>{name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>{day}</Text>
            <BsThreeDots />
          </Flex>
        </Flex>
        <Text>{comment}</Text>
        <Actions liked={liked} setLiked={setLiked} />
        <Text fontSize={"sm"} color={"gray.light"}>{likes + (liked ? 1 : 0)} Likes</Text>
      </Flex>
    </Flex>
    <Divider />
    </>
  )
}

export default Comment