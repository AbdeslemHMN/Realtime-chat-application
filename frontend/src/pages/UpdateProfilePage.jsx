import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar,  Center, InputGroup,InputRightElement } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import usePrevImg from '../hooks/usePrevImg'

const UpdateProfilePage = () => {

  const [showPassword, setShowPassword] = useState(false)
 
  const [user , setUser] = useRecoilState(userAtom)

  const toast = useShowToast()

  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: '',
    confirm_password: '',
    profilePic: "",
    bio: user.bio
  })

  const fileRef = useRef( null )
  const {handleImageChange , imgUrl} = usePrevImg()

  const handleChange = async () => {
    try {
      const res = await fetch('/api/users/update/${user._id}', {
        method : "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      })
      const data = await res.json()

      if(data.error) {
        toast("An error occurred.", data.error, "error")
        return ;
      }
      toast("Profile updated.", "Your profile has been updated.", "success")
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      
    } catch (err) {
      toast("An error occurred.", err.message, "error")
      console.log(err)
      
    }
  }


  return (
    <Flex
      align={'center'}
      justify={'center'}
      my={6}
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
              <Avatar size="xl" boxShadow={"md"} src={user.profilePic} /> 
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Edit picture</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImageChange} accept="image/*"/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="name" isRequired>
          <FormLabel>name</FormLabel>
          <Input
            placeholder={user.name || "name"}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.name}
            onChange = {(e) => setInputs({...inputs, name: e.target.value})}
          />
        </FormControl>
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder={user.username || "username"}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.username}
            onChange = {(e) => setInputs({...inputs, username: e.target.value})}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder={user.email || "email"}
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={inputs.email}
            onChange = {(e) => setInputs({...inputs, email: e.target.value})}
          />
        </FormControl>
        <FormControl id="bio" isRequired>
          <FormLabel>bio</FormLabel>
          <Input
            placeholder={user.bio || "bio"}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={inputs.bio}
            onChange = {(e) => setInputs({...inputs, bio: e.target.value})}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
          <Input type={showPassword ? 'text' : 'password'} 
          placeholder='password'
          onChange = {(e) => setInputs({...inputs, password: e.target.value})}
          value={inputs.password}
          />
             <InputRightElement h={'full'}>
                <Button
                variant={'ghost'}
                onClick={() => setShowPassword((showPassword) => !showPassword)}>
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
              </InputGroup> 
        </FormControl>
        <FormControl id="confirm_password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
          <Input type={showPassword ? 'text' : 'password'} 
          placeholder='confirm password'
          onChange = {(e) => setInputs({...inputs, confirm_password: e.target.value})}
          value={inputs.confirm_password}
          />
             <InputRightElement h={'full'}>
                <Button
                variant={'ghost'}
                onClick={() => setShowPassword((showPassword) => !showPassword)}>
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
              </InputGroup>
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
            }}
            onClick = {handleChange}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default UpdateProfilePage