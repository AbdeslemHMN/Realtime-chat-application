import SignUpCard from '../components/SignUpCard'
import LoginCard from '../components/LoginCard'
import { useEffect } from 'react'
import { useRecoilValue ,useSetRecoilState} from 'recoil'
import authScreenAtom from '../atoms/authAtom'
const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    const setAuthscreenState = useSetRecoilState(authScreenAtom)
    console.log(authScreenState)
    useEffect(() => {
      const screen = localStorage.getItem('authScreen')
      if (screen) {
        setAuthscreenState(screen)
      } else {
        setAuthscreenState('login')
      }
    }, [setAuthscreenState])
    
    useEffect(() => {
      localStorage.setItem('authScreen', authScreenState)
    },
     [authScreenState])
  return (
    <>
        {authScreenState === 'login' ? <LoginCard /> : <SignUpCard />}
    </>
  )
}

export default AuthPage