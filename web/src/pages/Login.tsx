import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../lib/api";
import { startSuapLogin } from "../lib/suap";
import ui from "../styles/ui.module.css";
import styles from "./Login.module.css";

type Mode = "login" | "register";

export function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register({ username, name, password });
      }
      navigate(from, { replace: true });
    } catch (cause) {
      const detail = cause instanceof ApiError ? cause.details?.[0]?.message : null;
      setError(detail ?? (cause instanceof Error ? cause.message : "Não foi possível entrar."));
    } finally {
      setSubmitting(false);
    }
  };

  const suapLogin = async () => {
    setError(null);

    try {
      await startSuapLogin();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "O login pelo SUAP está indisponível.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo}>Diatinf X</span>
        <p className={styles.tagline}>A rede da turma de Informática para Internet.</p>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => setMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            onClick={() => setMode("register")}
          >
            Criar conta
          </button>
        </div>

        {error && <p className={ui.error}>{error}</p>}

        <form onSubmit={submit}>
          <label className={ui.field}>
            <span className={ui.label}>Usuário</span>
            <input
              className={ui.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="joaosouza"
              required
            />
          </label>

          {mode === "register" && (
            <label className={ui.field}>
              <span className={ui.label}>Nome</span>
              <input
                className={ui.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="João Souza"
                required
              />
            </label>
          )}

          <label className={ui.field}>
            <span className={ui.label}>Senha</span>
            <input
              className={ui.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </label>

          <button className={`${ui.button} ${ui.primary}`} type="submit" disabled={submitting}>
            {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <button className={`${ui.button} ${ui.navy}`} type="button" onClick={suapLogin}>
          Entrar com o SUAP
        </button>

        <p className={styles.demo}>
          Usuários de demonstração: <code>joaosouza</code>, <code>mariasilva</code> — senha <code>diatinf123</code>
        </p>

        <Link className={styles.back} to="/">
          Continuar sem entrar
        </Link>
      </div>
    </div>
  );
}
