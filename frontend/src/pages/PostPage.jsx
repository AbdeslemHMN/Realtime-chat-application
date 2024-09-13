import { Flex ,Avatar ,Text,Image,Box,Button,Divider} from "@chakra-ui/react"
import { BsThreeDots } from 'react-icons/bs';
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";


const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
    <Flex>
      <Flex w={"full"} alignItems={"center"} gap={3}>
        <Avatar src="/zuck-avatar.png" size={"md"} name="Mark"/>
        <Flex>
          <Text fontSize={"sm"} fontWeight={"bold"}>Mark Zuckerberg</Text>
          <Image src="/verified.png" w={4} h={4} ml={1}/>
        </Flex>
      </Flex>
      <Flex gap={3} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
          <BsThreeDots />
        </Flex>
    </Flex>
    <Text my={3}>Meta is the next big thing</Text>
    <Box borderRadius={6} border={"1px solid"} overflow={"hidden"} borderColor={"gray.light"}> 
      <Image src='/post1.png' w={"full"} />
    </Box>
    <Flex gap={3} margin={3}>
    <Actions liked={liked} setLiked={setLiked}/>
    </Flex>
    <Flex alignItems={"center"} gap={2}>
      <Text color={"gary.light"} fontSize={"sm"}>123k replies</Text>
      <Box h={1} w={1} borderRadius={"full"} bg={"gray.light"}></Box>
      <Text color={"gary.light"} fontSize={"sm"}>{200 + (liked ? 1 : 0)} likes</Text>
    </Flex>
    <Divider my={4}/>
    <Flex justifyContent={"space-between"}>
      <Flex alignItems={"center"} gap={2}>
        <Text fontSize={"2xl"}>👋</Text>
        <Text color={"gray.light"}>Get the app to like , reply and post.</Text>
      </Flex>
        <Button>
          Get
        </Button>
    </Flex>
    <Divider my={4}/>
    <Comment likes={58} comment={"thank you gays "} day={"5h"} avatar={"/zuck-avatar.png"} name={"Mark"}/>
    <Comment likes={50} comment={"u are a hero man"} day={"23h"} avatar={"https://bit.ly/prosper-baba"} name={"Snowy"}/>
    <Comment likes={37} comment={"mete really prove a great thing"} day={"1d"} avatar={"https://bit.ly/kent-c-dodds"} name={"Kent Dodds"}/>
    </>
  )
}

export default PostPage