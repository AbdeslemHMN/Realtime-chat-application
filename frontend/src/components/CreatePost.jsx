import { Button, FormControl, Textarea , Text , Input, useColorModeValue , useDisclosure , Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Flex , Image  } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { BsFillImageFill } from "react-icons/bs"
import { CloseButton } from "@chakra-ui/react"
import { useState , useRef} from "react"
import usePrevImg from "../hooks/usePrevImg"
import useShowToast from "../hooks/useShowToast"
import { useRecoilState ,  useRecoilValue } from "recoil"
import postAtom from "../atoms/postAtom"
import userAtom from "../atoms/userAtom"
import { useParams } from "react-router-dom"


const Max_char = 500 // maximum character for post


const CreatePost = () => {
  
  const [posts, setPosts] = useRecoilState(postAtom)
  const { isOpen, onOpen, onClose } = useDisclosure() // hook for modal
  const [postText, setPostText] = useState('') // state for post text
  const {handleImageChange, imgUrl , setImgUrl} = usePrevImg() // hook for image preview
  const [loading, setLoading] = useState(false) // state for loading
  const [remainingChar, setRemainingChar] = useState(0) // state for remaining character
  const toast = useShowToast()  // hook for toast
  const imgRef = useRef(null) // ref for image input
  const user = useRecoilValue(userAtom)
  const {username} = useParams()
  

  const handleText = (e) => {
    const inputText = e.target.value
    if (inputText.length <= Max_char) {
      setPostText(inputText)
      setRemainingChar(inputText.length)
    } else {
      const truncatedText = inputText.slice(0, Max_char)
      setPostText(truncatedText)
    }    
    }

  const handleClose = () => {
      setPostText('')
      setImgUrl('')
      setRemainingChar(0)
      onClose()
    }

  const handleCreatePost = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: postText, img: imgUrl }),
        })
      const data = await res.json()
      if(data.error) {
          toast("An error occurred.", data.error, "error")
      }
      if (username === user?.username) {
        setPosts([data, ...posts])
      }
      toast("Post created successfully.", "Your post has been created.", "success")

      } catch (err) {
        toast("An error occurred.", err.message, "error")
      }finally {
        setLoading(false)
        onClose()
        setPostText('')
        setImgUrl('')
      }
  }
  return (
    <>
    <Button
    position={'fixed'}
    bottom={10}
    right={10}
    leftIcon={<AddIcon />}
    bg={useColorModeValue('gray.300', 'blue.dark')}
    onClick={onOpen}
    >
        Post 
    </Button>
    <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton  />
          <ModalBody mb={7}>
          <FormControl>
            <Textarea
            placeholder="Post something"
            onChange = {handleText}
            value={postText}
            >
            </Textarea>
            <Text
            fontSize={"xs"}
            textAlign={"right"}
            fontWeight={"bold"}
            color={useColorModeValue('gray.600', 'gray.400')}
            m={"1"}
            >
                {remainingChar}/{Max_char} 
            </Text>
            <Input 
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImageChange}
            />
            <BsFillImageFill
            size={16}
            style={{cursor: 'pointer' , marginLeft: '5px'}}
            onClick={() => imgRef.current.click()}
            />
          </FormControl>
          {
            imgUrl && (
              <Flex mt={5} position={'relative'} width={'full'} >
                <Image src={imgUrl} alt="selected img" /> 
                <CloseButton 
                position="absolute"
                size={"sm"}
                top={2}
                right={2}
                onClick={() => setImgUrl('')}
                bg={'gray.800'}
                />
              </Flex>
            )
          }
          </ModalBody >

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default CreatePost