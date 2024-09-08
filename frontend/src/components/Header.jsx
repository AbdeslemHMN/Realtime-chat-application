import { Flex , Image , useColorMode} from '@chakra-ui/react'
import React from 'react'

export const Header = () => {
    const {colorMode , toggleColorMode} = useColorMode()
  return (
    <Flex justifyContent={'center'} mt={6} mb='12'>
        <Image 
        w={6}
        cursor={'pointer'}
        alt={'logo'}
        src = {colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
        onClick={toggleColorMode}
        />
    </Flex>
  )
}
