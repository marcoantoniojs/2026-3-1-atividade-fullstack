import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
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
      <Route element={<Shell />}>
        <Route path="/" element={<Placeholder title="Feed Global" />} />
        <Route path="/buscar" element={<Placeholder title="Pesquisar" />} />
        <Route path="/meus-posts" element={<Placeholder title="Meus Posts" />} />
        <Route path="/stats" element={<Placeholder title="Social Stats" />} />
        <Route path="/novo" element={<Placeholder title="Nova publicação" />} />
        <Route path="/post/:id" element={<Placeholder title="Publicação" />} />
        <Route path="/perfil/:username" element={<Placeholder title="Perfil" />} />
      </Route>
      <Route path="/login" element={<Placeholder title="Entrar" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
