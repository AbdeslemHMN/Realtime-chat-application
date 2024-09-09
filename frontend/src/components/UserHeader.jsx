import {Box, VStack ,Flex ,Text,useToast , useColorModeValue , useColorMode} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Avatar } from '@chakra-ui/react'
import React from 'react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { Menu , MenuButton, MenuList,MenuItem } from '@chakra-ui/react'
import { Portal } from '@chakra-ui/react'

const UserHeader = ({user}) => {
    const toast = useToast()
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
            <Text fontSize={"2xl"}>
                Mark
            </Text>
            <Flex gap={2} alignItems={'center'}> 
                <Text fontSize={'sm'} fontWeight={'bold'}>Mark</Text>
                <Text fontSize={'xs'} bg={useColorModeValue('transparent', 'gray.dark')} color={"gray.light"} p={1} borderRadius={"full"} >
                    threads.net
                </Text>
            </Flex>
        </Box>
        <Box>
            <Avatar 
            name={'Mark'}
            src="/zuck-avatar.png"
            size={'xl'}
            />
        </Box>
       </Flex>
       <Text>Co-founder and bla bla bla and CEO of meta plateforme.</Text>
       <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
            <Text color={'gray.light'}>3.2K followers</Text>
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
                        <MenuList bg={"gray.dark"}>
                            <MenuItem bg={"gray.dark"} onClick={copyURL}>
                            copy link
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