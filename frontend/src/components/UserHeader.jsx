import {Box, VStack ,Flex ,Text,useToast , useColorModeValue , useColorMode , Button} from '@chakra-ui/react'
import { Link as RouterLink , Link } from 'react-router-dom'
import { Avatar } from '@chakra-ui/react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { Menu , MenuButton, MenuList,MenuItem } from '@chakra-ui/react'
import { Portal } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import userAtom from './../atoms/userAtom';

const UserHeader = ({user}) => {
    const toast = useToast()
    const currentUser = useRecoilValue(userAtom)

    const { colorMode } = useColorMode();
    const copyURL = () => {
        const currentURL = window.location.href
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: "Success.",
                status: "success",
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true,
            })
        }) 
    }
  return (
    <VStack gap={4} alignItems={"start"}>
       <Flex justifyContent={'space-between'} w={("full")}>
        <Box>
            <Text fontSize={{base:"lg" , md:"xl", lg:"2xl"}} fontWeight={"bold"} mb={2}>
                {user.name}
            </Text>
            <Flex gap={2} alignItems={'center'}> 
                <Text fontSize={{base:"xs" , md:"sm", lg:"md"}} fontWeight={'bold'} >{user.username}</Text>
                <Text fontSize={{base:"xs" , md:"sm", lg:"md"}} bg={useColorModeValue('transparent', 'gray.dark')} color={"gray.light"} p={1} borderRadius={"full"} >
                    threads.net
                </Text>
            </Flex>
        </Box>
        <Box>
            <Avatar 
            name={user.name}
            src={user.profilePic}
            size={{
                base:"lg",
                md: "xl",
            }}
            />
        </Box>
       </Flex>
       <Text>{user.bio}</Text>
       {
        currentUser._id === user._id && (
            <RouterLink to={'/update'}>
                <Box  boxShadow='md'  rounded='md'>
                <Button size={"lg"} borderRadius={"10"} >
                    <Text fontSize={"sm"}  >
                    Edit Profile
                    </Text>  
                </Button>
                </Box>
            </RouterLink>
        )
       }

         {
        currentUser._id !== user._id && (
            <RouterLink to={'/update'}>
                <Flex alignItems={"center"} gap={2} >
                <Box  boxShadow='md'  rounded='md'>
                <Button size={"lg"} borderRadius={"10"} >
                    <Text fontSize={"sm"}  >
                    Follow
                    </Text>  
                </Button>
                </Box>
                <Box  boxShadow='md'  rounded='md'>
                <Button size={"lg"} borderRadius={"10"}>
                    <Text fontSize={"sm"}  >
                    Message
                    </Text>  
                </Button>
                </Box>
                </Flex>
            </RouterLink>
        )
       }

       <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
            <Text color={'gray.light'}>{user.followers.length} followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={'full'}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
            <Box 
            className='icon-container'
            _hover={{backgroundColor: colorMode === "dark" ? "rgb(30, 30, 30)" : "transparent",}}
            >
                <BsInstagram size={24} cursor={"pointer"}/>
            </Box>
            <Box
            className='icon-container'
            _hover={{backgroundColor: colorMode === "dark" ? "rgb(30, 30, 30)" : "transparent",}}
            >
                <Menu>
                    <MenuButton>
                    <CgMoreO size={24} cursor={"pointer"}/>
                    </MenuButton>
                    <Portal>
                        <MenuList bg={useColorModeValue('white', 'gray.dark')}>
                            <MenuItem bg={useColorModeValue('white', 'gray.dark')} onClick={copyURL}>
                            <Text color={useColorModeValue('gray.dark', 'gary.light')}>copy link</Text>
                            </MenuItem>
                        </MenuList>
                    </Portal>
                </Menu>
            </Box>
        </Flex>
       </Flex>
       <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white" } justifyContent={"center"} pb="3" cursor={"pointer"}>
            <Text fontWeight={"bold"}>
                Threads
            </Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray" } justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
            <Text fontWeight={"bold"}>
                Replies
            </Text>
        </Flex>
       </Flex>
    </VStack>
  )
}

export default UserHeader