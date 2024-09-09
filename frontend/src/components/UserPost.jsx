import React from 'react'
import { Link } from 'react-router-dom'
import { Flex ,Box,Text} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
const UserPost = () => {
  return (
    <Link to={"/markzackerburg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar size={"md"} name='Mark Zuckreberg' src='/zuck-avatar.png'/>
        <Box w="1px" h={"full"} bg={'gray.light'} my={2}></Box>
        <Box position={"relative"} w={"full"}>
          <Avatar 
          size="xs"
          name='jhon doe'
          src='https://bit.ly/dan-abramov'
          position={"absolute"}
          top={"0px"}
          left="15px"
          padding={"2px"}
          />
          <Avatar 
          size="xs"
          name='jim law'
          src='https://bit.ly/prosper-baba'
          position={"absolute"}
          bottom={"0px"}
          right='-5px'
          padding={"2px"}
          />
          <Avatar 
          size="xs"
          name='yahiko nolan'
          src='https://bit.ly/tioluwani-kolawole'
          position={"absolute"}
          bottom={"0px"}
          left="4px"
          padding={"2px"}
          />
        </Box>
        </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>Mark Zuckerberg</Text>
                <Image w={4} h={4} ml={1} src='/verified.png' />
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                <BsThreeDots />
              </Flex>
            </Flex>
            <Text fontSize={"sm"}>
              This is my first post on threads. I am so excited to be here.
            </Text>
            <Box borderRadius={6} border={"1px solid"} overflow={"hidden"} borderColor={"gray.light"}> 
              <Image src='/post1.png' w={"full"} />
            </Box>
        </Flex>
      </Flex>
    </Link>
  )
}

export default UserPost