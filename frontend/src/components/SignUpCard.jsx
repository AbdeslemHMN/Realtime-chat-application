  import {
      Flex,
      Box,
      FormControl,
      FormLabel,
      Input,
      InputGroup,
      HStack,
      InputRightElement,
      Stack,
      Button,
      Heading,
      Text,
      useColorModeValue,
      Link,
    } from '@chakra-ui/react'
    import { useState } from 'react'
    import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
    import { useSetRecoilState } from 'recoil'
    import authScreenAtom from '../atoms/authAtom'
    import userAtom from '../atoms/userAtom'
    import useShowToast from '../hooks/useShowToast'

    
    
    const SignUpCard = () => {
      const [showPassword, setShowPassword] = useState(false)
      const setAuthscreen  = useSetRecoilState(authScreenAtom)
      const setUser = useSetRecoilState(userAtom)
      const [inputs, setInputs] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
      })
      const toast = useShowToast()
      const handleSignUp = async () => { 
        try {
          const res = await fetch('/api/users/signup', {
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
          toast("An error occurred.", err.message, "error")
          console.log(err)
        }
      }
    
      return (
        <Flex
          align={'center'}
          justify={'center'}>
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Sign up
              </Heading>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.dark')}
              boxShadow={'lg'}
              p={8}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>Full name</FormLabel>
                      <Input type="text" 
                      onChange = {(e) => setInputs({...inputs, name: e.target.value})}
                      value={inputs.name}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>Username</FormLabel>
                      <Input type="text" 
                      onChange = {(e) => setInputs({...inputs, username: e.target.value})}
                      value={inputs.username}
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" 
                  onChange = {(e) => setInputs({...inputs, email: e.target.value})}
                  value={inputs.email}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} 
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
                  <FormLabel>confirm password</FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} 
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
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={useColorModeValue('gray.600', 'gray.700')}
                    color={'white'}
                    _hover={{
                      bg: useColorModeValue('gray.700', 'gray.800'),
                    }}
                    onClick={handleSignUp}
                    >
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Already a user? <Link color={'blue.400'} onClick={() => setAuthscreen("login")}>Login</Link>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      )
    }

  export default SignUpCard