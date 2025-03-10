import { Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import { Header } from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import Error404 from "./pages/Error404";
import SearchUser from "./components/SearchUser";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/profile/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/search" element={<SearchUser />} />
        <Route path="/*" element={<Error404 />} />
      </Routes>

    </Container>
  );
}
export default App;
