import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar, AvatarBadge, IconButton, Center } from '@chakra-ui/react'
import { useState } from 'react'
import useShowToast from '../hooks/useShowToast'

const UpdateProfilePage = () => {
  const toast = useShowToast()
  const [inputs, setInputs] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    profilePic: '',
    bio: ''
  })
  const res = async () => {
    try {
      const res = await fetch('/api/users/update', {
        method : "POST",
        headers: {
          'Content-Type': 'application/json'
        }, 
        body : JSON.stringify(inputs)
      })
      const data = await res.json()
      if (data.error) {
        toast("An error occurred.", data.error, "error")
        return ;
      }
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      
    } catch (err) {
      console.log(err)
      toast("An error occurred.", err.message, "error")
    }
  }
  return (
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Edit Your Profile
        </Heading>
        <FormControl id="userName">
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src="/" /> 
            </Center>
            <Center w="full">
              <Button w="full">Edit picture</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="name" isRequired>
          <FormLabel>name</FormLabel>
          <Input
            placeholder="name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="bio" isRequired>
          <FormLabel>bio</FormLabel>
          <Input
            placeholder="bio"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
          
        </FormControl>
        <FormControl id="confirm_password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            placeholder="confirm password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default UpdateProfilePage