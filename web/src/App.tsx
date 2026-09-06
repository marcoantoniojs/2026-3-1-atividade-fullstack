import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { RequireAuth } from "./components/RequireAuth";
import { Feed } from "./pages/Feed";
import { Login } from "./pages/Login";
import { MyPosts } from "./pages/MyPosts";
import { NewPost } from "./pages/NewPost";
import { PostDetail } from "./pages/PostDetail";
import { Profile } from "./pages/Profile";
import { Search } from "./pages/Search";
import { Stats } from "./pages/Stats";
import { SuapCallback } from "./pages/SuapCallback";

function Shell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/suap/callback" element={<SuapCallback />} />

      <Route element={<Shell />}>
        <Route path="/" element={<Feed />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/perfil/:username" element={<Profile />} />

        <Route element={<RequireAuth />}>
          <Route path="/novo" element={<NewPost />} />
          <Route path="/meus-posts" element={<MyPosts />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
