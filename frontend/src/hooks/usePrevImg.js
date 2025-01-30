import { useState } from 'react'
import useShowToast from './useShowToast'

const usePrevImg = () => {
    const [imgUrl, setImgUrl] = useState(null)
    const toast = useShowToast()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file && file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setImgUrl(reader.result)
          }   
          reader.readAsDataURL(file)
        } else {
          toast("Invalid file type.", "Please upload an image file.", "error")}
          setImgUrl(null)
    };
    // console.log(imgUrl); // testing
    return {handleImageChange, imgUrl , setImgUrl} ;
}

export default usePrevImg 