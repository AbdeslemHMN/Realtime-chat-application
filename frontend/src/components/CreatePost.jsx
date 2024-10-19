import { Button, FormControl, Textarea , Text , useColorModeValue , useDisclosure , Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton  } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { useState } from "react"


const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState('')
    const handleText = (e) => {
        setPostText(e.target.value)
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
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={7}>
           <FormControl>
            <Textarea
            placeholder="Post something"
            onChange = {handleText}
            value={postText}
            >
            </Textarea>
            <Text>
                {postText.length}/500
            </Text>
           </FormControl>
          </ModalBody >

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default CreatePost