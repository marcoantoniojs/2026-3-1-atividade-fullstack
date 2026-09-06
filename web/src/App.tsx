import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { RequireAuth } from "./components/RequireAuth";
import { Login } from "./pages/Login";
import { SuapCallback } from "./pages/SuapCallback";
import { Feed } from "./pages/Feed";
import { Placeholder } from "./pages/Placeholder";

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
        <Route path="/buscar" element={<Placeholder title="Pesquisar" />} />
        <Route path="/post/:id" element={<Placeholder title="Publicação" />} />
        <Route path="/perfil/:username" element={<Placeholder title="Perfil" />} />

        <Route element={<RequireAuth />}>
          <Route path="/novo" element={<Placeholder title="Nova publicação" />} />
          <Route path="/meus-posts" element={<Placeholder title="Meus Posts" />} />
          <Route path="/stats" element={<Placeholder title="Social Stats" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
