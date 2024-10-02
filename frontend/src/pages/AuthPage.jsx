import SignUpCard from '../components/SignUpCard'
import LoginCard from '../components/LoginCard'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import { useEffect } from 'react'
const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  const setAuthScreenState = useSetRecoilState(authScreenAtom)

  useEffect(() => {
    const screen = localStorage.getItem('authScreen')
    if (screen) {
      setAuthScreenState(screen)
    } else {
      setAuthScreenState("login")
    }
    
  },[setAuthScreenState])
   
  useEffect(() => {
    localStorage.setItem('authScreen', authScreenState)
  },[authScreenState])

  
  return (
    <>
        {authScreenState === 'login' ? <LoginCard /> : <SignUpCard />}
    </>
  )
}

export default AuthPage