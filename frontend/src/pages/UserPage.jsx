import UserHeader from "../components/UserHeader"
import UserPost from './../components/UserPost';

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={"555 Likes"} replies={"348 replies"} postImg={"/post1.png"} postTitle={"Let's talk about threads"} time={"7h"}/>
      <UserPost likes={"374 Likes"} replies={"478 replies"} postImg={"/post2.png"} postTitle={"Nice tutorial"} time={"2d"}/>
      <UserPost likes={"465 Likes"} replies={"198 replies"}postImg={"/post3.png"} postTitle={"I love this guy"} time={"3d"}/>
      <UserPost likes={"756 Likes"} replies={"894 replies"} postImg={"/post4.png"} postTitle={"This is my first thread & let's talk about my favorite app salck"} time={"4d"}/>
    </>
  )
}

export default UserPage