import { Toaster } from "sonner";
import Signup from "./Pages/Sign up/Signup";
import Signin from "./Pages/Sign in/Signin";
import Home from "./Pages/Home/Home";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./Layout/Layout";
import UserProvider from "./context/UserContext";
import Notifications from "./Pages/Notifications/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import PostDetails from "./components/PostDetails";
import ProfilePage from "./Pages/Profile/Profile";
import CreatePostPage from "./components/CreatePostCard";
import LikesList from "./components/LikesList";
import UserProfile from "./components/UserProfile";
import Followers from "./components/Followers";
import Following from "./components/Following";
import ForYou from "./Pages/ForYou/ForYou";
import UpdatePost from "./components/UpdatePost";
import NotFound from "./Pages/NotFound/NotFound";
function App() {
  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(7, 17, 13, 0.82)",
            color: "#F3F8F5",
            border: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "4px solid #1DB854",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "18px",
            boxShadow: "0 10px 35px rgba(0,0,0,.35)",
            padding: "16px",
            fontSize: "14px",
          },
        }}
      />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="post/:id" element={<PostDetails />} />
              <Route path="postlikes/:id" element={<LikesList />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="user/:id" element={<UserProfile />} />
              <Route path="update/:id" element={<UpdatePost />} />
              <Route path="/user/:id/followers" element={<Followers />} />
              <Route path="/user/:id/following" element={<Following />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="foryou" element={<ForYou />} />
              <Route path="createPost" element={<CreatePostPage />} />
            </Route>

            <Route path="/signin" element={<Signin />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
