import {Box, VStack ,Flex ,Text} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import React from 'react'

const UserHeader = ({user}) => {
  return (
    <VStack gap={4} alignItems={"start"}>
       <Flex justifyContent={'space-between'} w={("full")}>
        <Box>
            <Text fontSize={"2xl"}>
                Mark
            </Text>
            <Flex gap={2} alignItems={'center'}> 
                <Text fontSize={'sm'} fontWeight={'bold'}>Mark</Text>
                <Text fontSize={'xs'} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"} >
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
        </Flex>
        <Flex></Flex>
       </Flex>
    </VStack>
  )
}

export default UserHeader