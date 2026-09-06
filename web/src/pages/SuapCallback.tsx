import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { consumeSuapState } from "../lib/suap";
import ui from "../styles/ui.module.css";
import styles from "./Login.module.css";

export function SuapCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithSuapCode } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;

    const expectedState = consumeSuapState();
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const denied = searchParams.get("error_description") ?? searchParams.get("error");

    if (denied) {
      setError(denied);
      return;
    }

    if (!code) {
      setError("O SUAP não devolveu o código de autorização.");
      return;
    }

    if (expectedState && state !== expectedState) {
      setError("A resposta do SUAP não confere com a solicitação feita neste navegador.");
      return;
    }

    loginWithSuapCode(code)
      .then(() => navigate("/", { replace: true }))
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Não foi possível entrar pelo SUAP.");
      });
  }, [searchParams, loginWithSuapCode, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo}>Diatinf X</span>
        {error ? (
          <>
            <p className={ui.error}>{error}</p>
            <Link className={`${ui.button} ${ui.primary}`} to="/login">
              Voltar para o login
            </Link>
          </>
        ) : (
          <p className={styles.tagline}>Validando seu acesso no SUAP...</p>
        )}
      </div>
    </div>
  );
}
