import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "./Avatar";
import { Icon, type IconName } from "./Icon";
import { SocialStatsRail } from "./SocialStatsRail";
import styles from "./AppLayout.module.css";

const NAV_ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/buscar", label: "Buscar", icon: "search" },
  { to: "/meus-posts", label: "Meus Posts", icon: "grid" },
  { to: "/stats", label: "Social Stats", icon: "users" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(query.trim() ? `/buscar?q=${encodeURIComponent(query.trim())}` : "/buscar");
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            Diatinf X
          </Link>

          <form className={styles.searchForm} role="search" onSubmit={submitSearch}>
            <label className="visually-hidden" htmlFor="busca-desktop">
              Pesquisar publicações
            </label>
            <input
              id="busca-desktop"
              className={styles.searchInput}
              type="search"
              placeholder="Pesquisar publicações e pessoas..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className={styles.searchSubmit} type="submit" aria-label="Pesquisar">
              <Icon name="search" />
            </button>
          </form>

          {user ? (
            <Link className={styles.chip} to={`/perfil/${user.username}`}>
              <Avatar user={user} size={36} />
              <span>
                <span className={styles.chipName}>{user.name}</span>
                <span className={styles.chipHandle}>@{user.username}</span>
              </span>
            </Link>
          ) : (
            <Link className={styles.signIn} to="/login">
              Entrar
            </Link>
          )}
        </div>

        <div className={styles.headerMobile}>
          {user ? (
            <Link className={styles.identity} to={`/perfil/${user.username}`}>
              <Avatar user={user} size={36} />
              <span className={styles.identityText}>
                <span className={styles.identityName}>{user.name}</span>
                <span className={styles.identityHandle}>@{user.username}</span>
              </span>
            </Link>
          ) : (
            <Link className={styles.identity} to="/login">
              <span className={styles.identityText}>
                <span className={styles.identityName}>Entrar</span>
                <span className={styles.identityHandle}>acesse sua conta</span>
              </span>
            </Link>
          )}

          <Link className={styles.iconButton} to="/buscar" aria-label="Pesquisar">
            <Icon name="search" />
          </Link>
          <Link className={styles.iconButton} to="/novo" aria-label="Nova publicação">
            <Icon name="plus" />
          </Link>
          <button
            className={styles.ghostButton}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>

        {menuOpen && (
          <div className={styles.menu} ref={menuRef}>
            {user ? (
              <>
                <Link className={styles.menuItem} to={`/perfil/${user.username}`}>
                  <Icon name="user" size={18} />
                  Meu perfil
                </Link>
                <Link className={styles.menuItem} to="/meus-posts">
                  <Icon name="grid" size={18} />
                  Meus posts
                </Link>
                <button className={styles.menuItem} type="button" onClick={logout}>
                  <Icon name="logout" size={18} />
                  Sair
                </button>
              </>
            ) : (
              <Link className={styles.menuItem} to="/login">
                <Icon name="user" size={18} />
                Entrar
              </Link>
            )}
          </div>
        )}
      </header>

      <div className={styles.body}>
        <aside className={`${styles.rail} ${styles.railLeft}`}>
          <Link className={styles.railButton} to="/novo">
            <Icon name="plus" />
            NOVO POST
          </Link>
          <Link className={styles.railButton} to="/meus-posts">
            <Icon name="grid" />
            MEUS POSTS
          </Link>
        </aside>

        <main className={styles.main}>{children}</main>

        <aside className={`${styles.rail} ${styles.railRight}`}>
          <SocialStatsRail />
        </aside>
      </div>

      <nav className={styles.bottomNav} aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
          >
            <Icon name={item.icon} size={22} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
