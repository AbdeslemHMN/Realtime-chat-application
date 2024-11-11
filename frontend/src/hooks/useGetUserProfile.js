import { useEffect , useState} from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";


const useGetUserProfile = () => {

    const [user, setUser] = useState(null)
    const [loading , setLoading] = useState(true)
    const { username } = useParams()
    const toast = useShowToast()
     useEffect( () => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, { 
          method: "GET" ,
          headers: { "Content-Type": "application/json" 
          } }
        )
        const data = await res.json()
        if (data.error) {
          toast("Error" , data.error , "error")
          console.log(data.error)
          return
        }
        setUser(data)
      } catch (err) {
        toast("Error" , err.message , "error")
        console.log(err)
      } finally {
          setLoading(false)
      }
    } ;
    getUser()
  } ,[username , toast])
  return {loading , user }
}

export default useGetUserProfile
