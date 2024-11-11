import { Flex , Image , useColorMode, Link } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import userAtom from './../atoms/userAtom';
import { AiFillHome  } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import { Link as RouterLink } from 'react-router-dom';
import LougoutButton  from './LogoutButton';





export const Header = () => {
    const {colorMode , toggleColorMode} = useColorMode()
    const user = useRecoilValue(userAtom)
  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb='12'>
      {user && 
     ( <Link as = {RouterLink} to = "/">
        <AiFillHome size={24} />  
        </Link>)
        }
        <Image 
        w={6}
        cursor={'pointer'}
        alt={'logo'}
        src = {colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
        onClick={toggleColorMode}
        />
        {user && 
          ( <Link as = {RouterLink} to ={ `/profile/${user.username}`}>
             <RxAvatar size={24} />
             </Link>)
             }
             <LougoutButton />
    </Flex>
  )
}
